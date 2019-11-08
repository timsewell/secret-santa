import React, { useContext, useEffect } from 'react';
import { SantaContext } from './context';
import { getAllUsers, initialise } from './db';
import santa from './assets/santa.png';

const Header = () => {
    const { state, dispatch } = useContext(SantaContext);

    const fetchState = async () => {
        const names = await getAllUsers();

        const toState = [];

        const dev = process.env.NODE_ENV === 'development';

        names.forEach(aDocument => {
            const data = dev ? aDocument : aDocument.data();

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

    useEffect(() => {
        initialise();
        fetchState();
    }, []);

    return (
        <header>

        </header>
        )
};
export default Header;
