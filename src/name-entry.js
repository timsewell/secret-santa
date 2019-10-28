import React, { useContext, useState, useEffect } from 'react';
import { SantaContext } from "./context";
import { addName, deleteName, fetchNames } from "./api";
import { CopyToClipboard } from 'react-copy-to-clipboard';

const NameEntry = () => {
    const { state, dispatch } = useContext(SantaContext);

    const [nameState, setNameState] = useState('');

    const onChange = aEvent => {
        const name = aEvent.target.value;

        if (name.length) {
            setNameState(name);
        }
    };

    const fetchState = async () => {
        const names = await fetchNames();

        dispatch({
            ...state,
            names: names.filter(aName => aName.name !== 'admin')
        });
    };

    const onSubmit = async aEvent => {
        const name = nameState;

        let result;

        aEvent.preventDefault();
        if (name.length) {
            result = await addName(name, state);
            if (!result.error) {
                dispatch({
                    ...result
                });
                setNameState('');
            }
        }
    };

    const onDelete = async aEvent => {
        const hash = aEvent.target.dataset.hash;

        const { names } = state;

        const newNames = names.filter(aName => aName.hash !== hash);

        const result = await deleteName(newNames);

        aEvent.preventDefault();
        dispatch({
            names: result
        });
    };

    useEffect(() => {
        fetchState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            { state.names.length > 1 &&
                <ul id='links'>
                        {
                            state.names.map((aUser) => {
                                if (aUser.name !== 'admin') {
                                    return <li key={aUser.hash}>{aUser.name}
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <a className='btn btn--delete'
                                           href=''
                                           onClick={onDelete}
                                           data-hash={aUser.hash}>
                                            Delete
                                        </a>
                                        <CopyToClipboard text={`${window.location
                                            .protocol}//${window.location
                                            .host}/${aUser.hash}`}>
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                            <button className='btn btn--primary'>
                                                Copy to clipboard
                                            </button>
                                        </CopyToClipboard>
                                    </li>
                                }
                            }).filter(aLi => aLi)
                        }
                    }
            </ul>
            }
        </>)
};

export default NameEntry;