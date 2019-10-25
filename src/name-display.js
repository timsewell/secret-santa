import React, { useContext, useEffect } from 'react';
import { SantaContext } from "./context";
import config from './config';
import axios from 'axios';

const NameDisplay = () => {
    const { state, dispatch } = useContext(SantaContext);

    const fetchState = async () => {
        console.log('run')
        const result = axios.get(config.api).then((aResponse => {
            if (aResponse) {
                return aResponse.data;
            }
        }));
        dispatch({
            names: result
        });
    };
    useEffect(() => {
        fetchState();
    }, []);
console.log(state)
    return <div>{ state.names.map(aName => aName.name) }</div>;
};
export default NameDisplay;