import React, { useContext, useState } from 'react';
import { SantaContext } from "./context";
import { addName, deleteName } from "./api";

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
            result = await addName(name, state);
            console.log(result);
            if (!result.error) {
                dispatch({
                    ...result
                });
                setNameState('');
                setMessage('Name added successfully.');
            }
        }
    };

    const onDelete = async aEvent => {
        const hash = aEvent.target.dataset.hash;

        const { names } = state;

        const newNames = names.filter(aName => aName.hash !== hash);

        aEvent.preventDefault();

        const result = await deleteName(newNames);
        dispatch({
            names: result
        });
    };

    return (
        <>
            <form>
                <label htmlFor='name'>Enter name: </label>
                <input type='text' name='name' id='name' onChange={onChange} value={ nameState }/>
                <button type='submit' onClick={onSubmit}>Submit</button>
            </form>
            {state.names.length > 1 &&
                <ul id='links'>
                    {
                        state.names.map((aUser, aIndex) => {
                            if (aUser.name !== 'admin') {
                                return <li key={ aUser.hash }>{ aUser.name }: { window.location
                                    // eslint-disable-next-line react/jsx-no-comment-textnodes
                                    .protocol }//{window.location
                                    .host }/{ aUser.hash }
                                    <a className='btn btn--delete' href='' onClick={ onDelete } data-hash={ aUser.hash }>Delete</a></li>
                            }
                        }).filter(aLi => aLi)
                    }
            </ul>
            }
        </>)
};

export default NameEntry;