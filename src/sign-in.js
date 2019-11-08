import React, { useEffect, useState, useContext } from 'react';
import { SantaContext } from "./context";
import { initialise, signIn } from './db';
import firebase from 'firebase';
import 'firebase/auth';
import { Redirect } from 'react-router-dom';

const SignIn = () => {
    const [formState, setFormState] = useState({
        email: '',
        password: ''
    });

    const { state, dispatch } = useContext(SantaContext);

    const onChangeEmail = aEvent => {
        const email = aEvent.target.value;

            setFormState({
                ...formState,
                email: email
            });
    };

    const onChangePassword = aEvent => {
        const password = aEvent.target.value;

            setFormState({
                ...formState,
                password: password
            });
    };

    const onSubmit = aEvent => {
        aEvent.preventDefault();
        if (formState.email.length && formState.password.length) {
            signIn(formState.email, formState.password).then((aUser) => {
                sessionStorage.setItem('signedIn', true);
                dispatch({
                    ...state,
                    user: {
                        email: aUser.email,
                        signedIn: true
                    }
                });
            });
        }
    };

    return (
        <>
        { state.user.signedIn && <Redirect to='/add-names' /> }
            <div className='sign-in container'>
                <h1>Secret Santa Machine</h1>
                <p className='form-title'>Sign in</p>
                    <div className='form-control'>
                        <input type='text'
                               id='email'
                               name='email'
                               onChange={ onChangeEmail }
                               value={ formState.email }
                               placeholder='Email'
                        />
                    </div>
                    <div className='form-control'>
                        <input type='password'
                               id='password'
                               name='password'
                               onChange={ onChangePassword }
                               value={ formState.password }
                               placeholder='Password'
                        />
                    </div>
                    <div className='form-control'>
                        <button type='submit' className='btn btn--primary' id='submit' name='submit' onClick={ onSubmit }>
                            Sign in
                        </button>
                    </div>
            </div>
        </>
    )

};

export default SignIn;
