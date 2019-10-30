import React, { useContext, useEffect, useState, useRef } from 'react';
import { SantaContext } from "./context";
import { fetchNames, saveState } from "./api";
import loadingSanta from './assets/santa-gif.gif';
import { initialise, getAllUsers, editUser } from "./db";

const NameDisplay = (props) => {
    const { state, dispatch } = useContext(SantaContext);

    const [currentUser, setCurrentUser] = useState(null);

    const [allocated, setAllocated] = useState(null);

    const firstRender = useRef(true);

    const showCurrentUser = () => {
        const hash = props.location.pathname.slice(1);

        let currentUser, allocatedUser;

        if (hash && hash.length) {
            currentUser = state.names.find(aUser => aUser.hash === hash);
            if (currentUser) {
                setCurrentUser(currentUser);
                if (currentUser.allocated) {
                    allocatedUser = atob(currentUser.allocated);
                    setAllocated({ name: state.names
                            .find(aUser => aUser.hash === allocatedUser).name });
                }
            }
        }
    };

    const allocateUserInDb = () => {
        console.log(currentUser);
        editUser(currentUser.id, allocated.name);
    };

    const shakeTheHat = () => {
        const unallocated = state.names.filter(aUser => !aUser.allocated
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
                allocatedUser = unallocated[rand];
                setAllocated(allocatedUser);
            }
            currentUser.allocated = allocatedUser.name;
            setCurrentUser(buyer);
            allocateUserInDb();
            dispatch({
                ...state,
                names: state.names.map(aName => aName.hash === currentUser
                    .hash ? currentUser : aName)
            });
        }
    };

    useEffect(() => {
        if (!currentUser && state.names.length) {
            showCurrentUser();
        }
    }, [state.names]);

    useEffect(() => {
        if (state.names.length && currentUser && !currentUser.allocated) {
            shakeTheHat();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    return <>
        { currentUser && allocated &&
        (
            <div className='name-display'>
                <p>Hi</p>
                <p className='current-user'>
                    { (currentUser || {}).name }
                </p>
                <p>You are buying a present for</p>
                <p className='allocated-user'>
                    { (allocated || {}).name }
                </p>
            </div>)
        }
        {/* eslint-disable-next-line no-mixed-operators */}
            <div className={ currentUser && allocated ? 'done loading' : 'loading'}>
                <img alt='loading' src={ loadingSanta } />
            </div>
        </>
};
export default NameDisplay;
