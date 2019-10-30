import React, { useContext } from 'react';
import { SantaContext } from './context';
import { getAllNames } from './db';

const wrapper = BaseComponent => props => {
    return <Wrapper>hello{ props }bybye</Wrapper>
};

export default Wrapper;
