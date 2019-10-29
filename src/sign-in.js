import React, { useEffect, useState, useContext } from 'react';
import { SantaContext } from "./context";
import { initialise, signIn } from './db';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';

const SignIn = () => {
    const [formState, setFormState] = useState({
        email: '',
        password: ''
    });

    const boot = async () => {
        await initialise();
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                dispatch({
                    ...state,
                    user: {
                        email: user.email,
                        signedIn: true
                    }
                });
            } else {
                dispatch({
                    ...state,
                    signedIn: false
                });
            }
        });
    }

    const { state, dispatch } = useContext(SantaContext);

    const onChangeEmail = aEvent => {
        const email = aEvent.target.value;

        if (email.length >= 3) {
            setFormState({
                ...formState,
                email: email
            });
        }
    };

    const onChangePassword = aEvent => {
        const password = aEvent.target.value;

        if (password.length >= 3) {
            setFormState({
                ...formState,
                password: password
            });
        }
    };

    const onSubmit = aEvent => {
        aEvent.preventDefault();
        if (formState.email.length && formState.password.length) {
            signIn(formState.email, formState.password);
        }
    };

    useEffect(() => {
        boot();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
        { state.user.signed && <Redirect to='/add-names' /> }
            <div className='sign-in'>
                Sign in
                <fieldset>
                    <div className='form-control'>
                        <label htmlFor='email'>Email address:</label>
                        <input type='text' id='email' name='email' />
                    </div>
                    <div className='form-control'>
                        <label htmlFor='password'>Password:</label>
                        <input type='password' id='password' name='password' />
                    </div>
                    <div className='form-control'>
                        <button type='submit' id='submit' name='submit'>
                            Sign in
                        </button>
                    </div>
                </fieldset>
            </div>
        </>
    )

};

export default SignIn;
