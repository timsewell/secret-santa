import axios from 'axios';
import config from './config';
import md5 from 'md5';

export const addName = async (aName = '', aState) => {
    const hash = md5(aName);

    return new Promise((resolve) => {
         if (aName.length) {
            const data = {
                name: aName,
                hash: hash,
                allocated: false,
                visited: false,
            };

            aState.names.push(data);
            axios.put(config.api, aState.names).then(aResponse => {
                resolve(aState);
            });
        }
    });
};

export const saveState = (aState) => {
    axios.put(config.api, aState.names);
};

export const deleteName = aNames => {
    return new Promise(resolve => {
        axios.put(config.api, aNames).then(() => {
            resolve(aNames);
        });
    });
};

export const fetchNames = () => {
    return new Promise(resolve => {
        axios.get(config.api).then(aResponse => {
            if (aResponse.data) {
                resolve(aResponse.data);
            }
        });
    });
};