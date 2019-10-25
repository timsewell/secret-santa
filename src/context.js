import React from 'react';

const initialState = { names: [] };

export const SantaContext = React.createContext(initialState);

const reducer = (state, action) => {
    console.log(action);
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