import React, { useContext, useState, useEffect } from 'react';
import { SantaContext } from "./context";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { initialise, addToLIst, getAllUsers, deleteFromList, signOut } from "./db";
import { Redirect } from "react-router";

const NameEntry = () => {
    const { state, dispatch } = useContext(SantaContext);

    const [formState, setFormState] = useState({
        name: '',
        email: ''
    });

    const onChange = aEvent => {
        const data = aEvent.target.value;

        setFormState({
            ...formState,
            [aEvent.target.id]: data
        });
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
        const name = formState.name;

        const email = formState.email;

        const names = state.names || [];

        let result, data;

        aEvent.preventDefault();
        if (name.length && email.length) {
            result = await addToLIst(name, email);
            data = await result.get();
            if (data && typeof data === 'object') {
                data = data.data();
                data.id = result.id;
                names.push(data);
                dispatch({
                    ...state,
                    names: names
                });
            }
        }
    };

    const onDelete = async aEvent => {
        aEvent.preventDefault();

        await deleteFromList(aEvent.target.dataset.id);
        fetchState();
    };

    const onSignOut = async aEvent => {
        aEvent.preventDefault();
        await signOut();
        sessionStorage.setItem('signedIn', false);
        dispatch({
            ...state,
            user: {
                signedIn: false,
                email: ''
            }
        });
    };

    useEffect(() => {
        initialise();
        fetchState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            { !state.user.signedIn && <Redirect to='/' /> }
            <form>
                <div className='form-control'>
                    <label htmlFor='name'>Enter name: </label>
                    <input type='text'
                           name='name'
                           id='name'
                           onChange={onChange}
                           value={ formState.name }/>
                </div>
                <div className='form-control'>
                    <label htmlFor='email'>Enter email: </label>
                    <input type='email'
                           name='email'
                           id='email'
                           onChange={onChange}
                           value={ formState.email }/>
                </div>
                <button type='submit' onClick={onSubmit}>Submit</button>
            </form>
            {state.names.length > 1 &&
                <>
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
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <button className='btn btn--primary'>
                                            Copy to clipboard
                                        </button>
                                </li>
                            })
                        }
                    </ul>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a href='#' onClick={ onSignOut } className='btn btn--primary'>Sign out</a>
                </>
            }
        </>)
};

export default NameEntry;