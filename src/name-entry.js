import React, { useContext, useState } from 'react';
import { SantaContext } from "./context";
import { addName } from "./api";

const NameEntry = () => {
    const { state, dispatch } = useContext(SantaContext);

    const [nameState, setNameState] = useState('');

    const [message, setMessage] = useState('');

    const onChange = aEvent => {
        const name = aEvent.target.value;

        if (name.length) {
            setNameState(name);
        }
    };

    const onSubmit = async aEvent => {
        const name = nameState;

        let result;

        aEvent.preventDefault();
        if (name.length) {
            result = addName(name, state);
            if (!result.error) {
                dispatch({
                    ...state,
                    names: result
                });
                setNameState('');
                setMessage('Name added successfully.');
            }
        }
    };

    return (
        <>
            <form>
                <label htmlFor='name'>Enter name: </label>
                <input type='text' name='name' id='name' onChange={onChange} value={ nameState }/>
                <button type='submit' onClick={onSubmit}>Submit</button>
            </form>
            {(state.names || []).length &&
                <ul id='links'>
                    {
                        state.names.map((aUser, aIndex) => {
                            return <li key={aIndex}>{aUser.name}: {window.location
                                // eslint-disable-next-line react/jsx-no-comment-textnodes
                                .protocol}//{window.location
                                    .host}/{aUser.hash}</li>
                        })
                    }
            </ul>
            }
        </>)
};

export default NameEntry;