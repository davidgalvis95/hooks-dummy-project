import React, {useContext} from 'react';

import Card from './UI/Card';
import './Auth.css';
import {AuthContext} from "../context/auth-context";

const Auth = props => {
    //Through the context can also be sent functions to be executed as we send props as method references in the components
    const authContext = useContext(AuthContext);
    const loginHandler = () => {
        //auth context login function used to login
        authContext.login();
    };

    return (
        <div className="auth">
            <Card>
                <h2>You are not authenticated!</h2>
                <p>Please log in to continue.</p>
                <button onClick={loginHandler}>Log In</button>
            </Card>
        </div>
    );
};

export default Auth;
