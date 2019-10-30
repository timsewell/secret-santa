import React from 'react';

const initialState = { names: [], user: { email: '', signedIn: false } };

export const SantaContext = React.createContext(initialState);

const reducer = (state, action) => {
    return {
        ...state,
        ...action
    };
};

export const SantaProvider = ({ children }) => {
    const [ state, dispatch ] = React.useReducer(reducer, initialState);

    return (
        <SantaContext.Provider value={ { state: state, dispatch: dispatch }}>
            { children }
        </SantaContext.Provider>
    );
};
