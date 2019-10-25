import React, { useContext, useState, useEffect, useRef } from 'react';
import { SantaContext } from "./context";
import { addName, deleteName } from "./api";
import { CopyToClipboard } from 'react-copy-to-clipboard';

const NameEntry = () => {
    const { state, dispatch } = useContext(SantaContext);

    const [nameState, setNameState] = useState('');

    const [copyState, setCopyState] = useState('');

    const [message, setMessage] = useState('');

    const textareaRef = useRef(null);

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

    const onCopy = aEvent => {
        aEvent.preventDefault();
        setCopyState(`${window.location.protocol}//${window.location.host}/${aEvent.target.dataset.hash}`);
    };

    return (
        <>
            <form>
                <label htmlFor='name'>Enter name: </label>
                <input type='text'
                       name='name'
                       id='name'
                       onChange={onChange}
                       value={ nameState }/>
                <button type='submit' onClick={onSubmit}>Submit</button>
            </form>
            {state.names.length > 1 &&
                <ul id='links'>
                    {
                        state.names.map((aUser, aIndex) => {
                            if (aUser.name !== 'admin') {
                                return <li key={ aUser.hash }>{ aUser.name }
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a className='btn btn--delete'
                                       href=''
                                       onClick={ onDelete }
                                       data-hash={ aUser.hash }>
                                        Delete
                                    </a>
                                    <CopyToClipboard text={`${window.location.protocol}//${window.location.host}/${aUser.hash}`}>
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <button className='btn btn--primary'>Copy to clipboard</button>
                                    </CopyToClipboard>
                                </li>
                            }
                        }).filter(aLi => aLi)
                    }
            </ul>
            }
            <textarea defaultValue={ copyState } ref={textareaRef} />

        </>)
};

export default NameEntry;