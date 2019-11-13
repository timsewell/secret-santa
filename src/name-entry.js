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
                names.unshift(data);
                dispatch({
                    ...state,
                    names
                });
                setFormState({
                    name: '',
                    email: ''
                });
            }
        }
    };

    const onDelete = async aEvent => {
        const names = state.names;

        const { target } = aEvent;

        let newNames;

        aEvent.preventDefault();

        await deleteFromList(target.dataset.id);
        newNames = names.filter(aUser => aUser.hash !== target.dataset.hash);
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

        const emailIndex = user.sent ? 1 : 0;

        let result;

        if (user) {
            result = await sendEmail(user, emailIndex);
            if (result && !result.error) {
                user.sent = true;
                editUser(user.id, true, 'sent');
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
            <div className='container'>
                <h1>Secret Santa Machine</h1>
                <p className='form-title'>Add users</p>
                <form>
                    <div className='form-control'>
                        <input type='text'
                               placeholder='Name'
                               name='name'
                               id='name'
                               onChange={onChange}
                               value={ formState.name }/>
                    </div>
                    <div className='form-control'>
                        <input type='email'
                               placeholder='Email'
                               name='email'
                               id='email'
                               onChange={onChange}
                               value={ formState.email }/>
                    </div>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a href='#' className='btn btn--primary' onClick={onSubmit}>Submit</a>
                </form>
                {state.names.length ?

                    <ul id='links'>
                        {
                            state.names.map((aUser) => {
                                const showDelete = !aUser.visited && !aUser
                                    .beingBoughtFor;

                                const visits = aUser.visited || 0;
                                return <li key={aUser.hash}>
                                    <span className='user-name'>
                                        {aUser.name}
                                    </span>
                                    <div className='user-visits'>
                                        <span className='visits'>{ visits }</span>
                                        <p>visits</p>
                                    </div>
                                    { showDelete &&
                                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                                        <a className='delete'
                                            href=''
                                            onClick={onDelete}
                                            data-id={aUser.id}
                                            data-hash={aUser.hash}>
                                            X
                                            <span>Delete</span>
                                        </a>
                                    }
                                    {!!aUser.email.length &&
                                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                                    <a className={'btn btn--primary' +
                                        ((!showDelete) ? ' no-delete' : '')}
                                           onClick={onSendEmail}
                                           data-hash={aUser.hash}>
                                            {aUser.sent ? 'Send email again' : 'Send email'}
                                    </a>
                                    }
                                </li>
                            })
                        }
                    </ul>
                :
                <div className='no-users-yet'><p>No users yet</p>Why not add some?</div>
                }
            </div>
            <div className='action-container'>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href='#'
                   onClick={ onSignOut }
                   className='btn btn--primary btn--sign-out'>
                    Sign out
                </a>
            </div>
        </>
    )
};

export default NameEntry;
