import React, { useState, useEffect } from "react";
import {login, register} from '../apiCalls/index';
import { useNavigate } from "react-router-dom";

function Register({setToken})
{
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    let navigate = useNavigate();
    return<div>
        <h1>Register</h1>
        <form onSubmit = { async (event) => {
            event.preventDefault();
            if(password !== confirmPassword) alert('Password does match confirm password!');
            else{
                const result = await register(username, password);
                if (result.error) alert(result.message);
                else{
                    alert('Successful login!');
                    console.log(result);
                    navigate('../login');

                }
            }}}>
            <input type = "text" placeholder = "username"  value={username}  
            onChange={(event) => {
                setUserName(event.target.value);
                    }}/>
            <input type = "text" placeholder = "password" value={password}
             onChange={(event) => {
                setPassword(event.target.value);
            }}/>
            <input type = "text" placeholder = "confirm password" value={confirmPassword}
             onChange={(event) => {
                setConfirmPassword(event.target.value);
            }}/>
            <input type = "submit"/>
        </form>
    </div>
}

export default Register;