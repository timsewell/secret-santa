import React, { useContext, useState, useEffect } from 'react';
import { SantaContext } from "./context";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { initialise, addToLIst, getAllUsers, deleteFromList } from "./db";

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
        const names = await getAllUsers();

        const toState = [];

        names.forEach(aDocument => {
            const data = aDocument.data();

            if (data.name !== 'admin') {
                data.id = aDocument.id;
                toState.push(data);
            }
        });

        dispatch({
            ...state,
            names: toState
        });
    };

    const onSubmit = async aEvent => {
        const name = nameState;

        aEvent.preventDefault();
        if (name.length) {
            await addToLIst(name);
            fetchState();
        }
    };

    const onDelete = async aEvent => {
        aEvent.preventDefault();

        await deleteFromList(aEvent.target.dataset.id);
        fetchState();
    };

    useEffect(() => {
        initialise();
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
            {state.names.length > 1 &&
            <ul id='links'>
                {
                    state.names.map((aUser) => {
                        return <li key={aUser.hash}>{aUser.name}
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a className='btn btn--delete'
                               href=''
                               onClick={onDelete}
                               data-id={aUser.id}>
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
                    })
                }
            </ul>
            }
        </>)
};

export default NameEntry;