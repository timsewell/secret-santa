import React, { useContext, useEffect, useState, useRef } from 'react';
import { SantaContext } from "./context";
import { fetchNames, saveState } from "./api";

const NameDisplay = (props) => {
    const { state, dispatch } = useContext(SantaContext);

    const [currentUser, setCurrentUser] = useState(null);

    const [allocated, setAllocated] = useState(null);

    const firstRender = useRef(true);

    const fetchState = async () => {
        const names = await fetchNames();

        dispatch({
            ...state,
            names: names
        });
        showCurrentUser(names);
    };

    const showCurrentUser = (aNames) => {
        const hash = props.location.pathname.slice(1);

        let currentUser, allocatedUser;

        if (hash && hash.length) {
            currentUser = aNames.find(aUser => aUser.hash === hash);
            if (currentUser) {
                setCurrentUser(currentUser);
                if (currentUser.allocated) {
                    allocatedUser = atob(currentUser.allocated);
                    setAllocated({ name: aNames
                            .find(aUser => aUser.hash === allocatedUser).name });
                }
            }
        }
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
        fetchState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (state.names.length && currentUser && !currentUser.allocated) {
            shakeTheHat();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        saveState(state);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.names]);

    return <>
        { currentUser && allocated &&
        (<div>
                Hi { (currentUser || {}).name }.
            You are buying a present for { (allocated || {}).name }
            </div>)
        }
        </>
};
export default NameDisplay;