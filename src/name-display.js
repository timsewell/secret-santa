import React, { useContext, useEffect, useState } from 'react';
import { SantaContext } from "./context";
import { editUser, sendEmail } from "./db";

const NameDisplay = (props) => {
    const { state, dispatch } = useContext(SantaContext);

    const [currentUser, setCurrentUser] = useState(null);

    const [allocated, setAllocated] = useState(null);

    const [showName, setShowName] = useState('');

    const [usersAvailable, setUsersAvailable] = useState(true);

    let nameClass = '';

    const showCurrentUser = () => {
        const hash = props.location.pathname.slice(1);

        let currentUser, allocatedUser, visits;

        if (hash && hash.length) {
            currentUser = state.names.find(aUser => aUser.hash === hash);
            if (currentUser) {
                visits = currentUser.visited || 0;
                setCurrentUser(currentUser);
                editUser(currentUser.id, visits + 1, 'visited');
                if (currentUser.buyingFor) {
                    allocatedUser = currentUser.buyingFor;
                    setAllocated({ name: state.names
                            .find(aUser => aUser.hash === allocatedUser).name });
                }
            }
        }
    };

    const allocateUserInDb = (aAllocatedUser) => {
        editUser(currentUser.id, aAllocatedUser.hash, 'buyingFor');
    };

    const shakeTheHat = async () => {
        const unallocated = state.names.filter(aUser => !aUser.beingBoughtFor
            && aUser.hash !== (currentUser || {}).hash);

        const length = unallocated.length;

        const rand = Math.floor(Math.random() * length);

        const buyer = currentUser;

        let allocatedUser;

        if (unallocated.length && buyer) {
            if (unallocated.length === 1) {
                allocatedUser = unallocated[0];
                setAllocated(allocatedUser);
            }
            else {
                if (unallocated.length) {
                    allocatedUser = unallocated[rand];
                    setAllocated(allocatedUser);
                }
            }
            if (allocatedUser) {
                currentUser.buyingFor = allocatedUser.hash;
                allocatedUser.beingBoughtFor = currentUser.hash;
                setCurrentUser(buyer);
                await editUser(currentUser.id, allocatedUser.hash, 'buyingFor');
                await editUser(allocatedUser.id, currentUser.hash, 'beingBoughtFor');
                currentUser.tempBuyingFor = allocatedUser.name;
                await sendEmail(currentUser, 2);
                await editUser(currentUser.id, '', 'email');
                dispatch({
                    ...state,
                    names: state.names.map(aName => aName.hash === currentUser
                        .hash ? currentUser : aName)
                });
            }
        }
        else {
            setUsersAvailable(false);
        }
    };

    useEffect(() => {
        if (!currentUser && state.names.length) {
            showCurrentUser();
            setTimeout(() => {
                setShowName('show');
            }, 500);
        }
    }, [state.names]);

    useEffect(() => {
        if (state.names.length && currentUser && !currentUser.buyingFor) {
            shakeTheHat();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    if (currentUser && currentUser.name.split(' ').length > 1) {
        nameClass = ' split';
    }
    if (allocated && allocated.name.split(' ').length > 1) {
        nameClass = ' split';
    }

    return <>
        { currentUser && allocated &&
        (
            <>
                <div className='name-display'>
                    <div className='text-container'>
                        <p>Hi</p>
                        <p className={'current-user' + nameClass}>
                            { (currentUser || {}).name }
                        </p>
                        <p>You are buying a present for</p>
                        {/* eslint-disable-next-line no-useless-concat */}
                        <p className={'allocated-user' + ' ' + showName + nameClass}>
                            { (allocated || {}).name }
                        </p>
                        <p className='rules'>
                            <strong>Rules of play:</strong><br />
                            £5 maximum spend.<br />
                            Present(s) must be purchased from a charity shop.
                        </p>
                    </div>
                </div>
            </>)
        }
        { currentUser && !usersAvailable &&
            <div className='no-users'>
                <p>Sorry { currentUser.name }, nobody's available for you to buy for right now. Maybe try again tomorrow?</p>
            </div>
        }
        </>
};
export default NameDisplay;
