import React, { useContext, useEffect } from 'react';
import { SantaContext } from "./context";
import config from './config';
import axios from 'axios';

const NameDisplay = () => {
    const { state, dispatch } = useContext(SantaContext);

    const fetchState = () => {
        let result;

        axios.get(config.api).then(aResponse => {
            // if (aResponse.data) {
            //     result = aResponse.data;
            //     dispatch({
            //         names: result
            //     });
            // }
            console.log(aResponse.data);
            dispatch({
                names: aResponse.data
            });
        });
    };
    useEffect(() => {
        fetchState();
    }, []);


    return <div></div>;
};
export default NameDisplay;