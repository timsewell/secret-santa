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

    const fetchState = async () => {
        const names = await getAllUsers();

        const toState = [];

        names.forEach(aDocument => {
            const data = aDocument.data();

            if (data.name !== 'admin') {
                data.id = aDocument.id;
                toState.push(data);
            }
        });

        dispatch({
            ...state,
            names: toState
        });
    };

    const showCurrentUser = () => {
        const hash = props.location.pathname.slice(1);

        let currentUser, allocatedUser;

        if (hash && hash.length) {
            currentUser = state.names.find(aUser => aUser.hash === hash);
            console.log(currentUser);
            console.log(state);
            if (currentUser) {
                setCurrentUser(currentUser);
                if (currentUser.allocated) {
                    allocatedUser = atob(currentUser.allocated);
                    console.log(allocatedUser);
                    setAllocated({ name: state.names
                            .find(aUser => aUser.hash === allocatedUser).name });
                }
            }
        }
    };

    const allocateUserInDb = () => {
        editUser(currentUser.id, allocated.hash);
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
            currentUser.allocated = btoa(allocatedUser.hash);
            setCurrentUser(buyer);
            dispatch({
                ...state,
                names: state.names.map(aName => aName.hash === currentUser
                    .hash ? currentUser : aName)
            });
        }
    };

    useEffect(() => {
        setTimeout(fetchState, 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    useEffect(() => {
        initialise();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (!currentUser.allocated) {
            allocateUserInDb();
        }
    }, [allocated]);

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
