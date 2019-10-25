import axios from 'axios';
import config from './config';
import md5 from 'md5';

export const addName = async (aName = '', aState) => {
    const hash = md5(aName);

    return new Promise((resolve) => {
        let ret;

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

export const deleteName = aNames => {
    return new Promise(resolve => {
        axios.put(config.api, aNames).then(() => {
            resolve(aNames);
        });
    });
};