import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";
import {login, register} from '../apiCalls/index';
import { useNavigate } from "react-router-dom";

function Login({setToken})
{
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    let navigate = useNavigate();
    return<div>
        <h1>Login</h1>
        <form onSubmit = { async (event) => {
            event.preventDefault();
            const result = await login(username, password);
            if (result.error) alert(result.message); // error message(incorrect or missing info)
            else {
                // successful login
                console.log(result);
                localStorage.setItem('token', result.token);
                localStorage.setItem('username', result.username);
                setToken(result.token);
                navigate("../");
              
                
            }
        }}>
            <input type = "text" placeholder = "username"  value={username}  
            onChange={(event) => {
                setUserName(event.target.value);
                    }}/>
            <input type = "text" placeholder = "password" value={password}
             onChange={(event) => {
                setPassword(event.target.value);
            }}/>
            <input type = "submit"/>
        </form>
    </div>
}

export default Login;