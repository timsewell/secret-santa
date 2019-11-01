import React, { useContext, useState, useEffect } from 'react';
import { SantaContext } from "./context";
import { editUser, addToLIst, getAllUsers, deleteFromList, signOut, sendEmail } from "./db";
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
                    names
                });
            }
        }
    };

    const onDelete = async aEvent => {
        const names = state.names;

        let newNames;

        aEvent.preventDefault();

        await deleteFromList(aEvent.target.dataset.id);
        newNames = names.filter(aUser => aUser.hash !== aEvent.dataset.hash);
        dispatch({
            ...state,
            names: newNames
        });
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

    const onSendEmail = async aEvent => {
        const names = state.names;

        const user = names.find(aUser => aUser.hash === aEvent
            .target.dataset.hash);

        let result;

        if (user) {
            result = await sendEmail(user);
            if (result && !result.error) {
                user.sent = true;


                dispatch({
                    ...state,
                    names: names
                });
            }
        }
    };

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
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href='#' className='btn btn--primary' onClick={onSubmit}>Submit</a>
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
                                       data-id={aUser.id}
                                       data-hash={aUser.hash}>
                                        Delete
                                    </a>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a className='btn btn--primary'
                                       onClick={ onSendEmail }
                                       data-hash={ aUser.hash }>
                                        { aUser.sent ? 'Send email again' : 'Send email' }
                                    </a>
                                </li>
                            })
                        }
                    </ul>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a href='#'
                       onClick={ onSignOut }
                       className='btn btn--primary'>
                        Sign out
                    </a>
                </>
            }
        </>)
};

export default NameEntry;
