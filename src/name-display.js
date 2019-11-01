import React, { useContext, useEffect, useState, useRef } from 'react';
import { SantaContext } from "./context";
import loadingSanta from './assets/santa-gif.gif';
import { editUser } from "./db";

const NameDisplay = (props) => {
    const { state, dispatch } = useContext(SantaContext);

    const [currentUser, setCurrentUser] = useState(null);

    const [allocated, setAllocated] = useState(null);

    const [usersAvailable, setUsersAvailable] = useState(true);

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
        }
    }, [state.names]);

    useEffect(() => {
        if (state.names.length && currentUser && !currentUser.buyingFor) {
            shakeTheHat();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    return <>
        { currentUser && allocated &&
        (
            <><div className='name-display'>
                <p>Hi</p>
                <p className='current-user'>
                    { (currentUser || {}).name }
                </p>
                <p>You are buying a present for</p>
                <p className='allocated-user'>
                    { (allocated || {}).name }
                </p>
            </div>
            <div className={ currentUser && allocated ? 'done loading' : 'loading'}>
                <img alt='loading' src={ loadingSanta } />
            </div></>)
        }
        { currentUser && !usersAvailable &&
            <div className='no-users'>
                <p>Sorry { currentUser.name }, nobody's available for you to buy for right now. Maybe try again tomorrow?</p>
            </div>
        }
        </>
};
export default NameDisplay;
