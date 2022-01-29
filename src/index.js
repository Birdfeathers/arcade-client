import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import { BaseUrl as ENDPOINT } from "./constants";
import {Renju, RenjuForm, Home, Login, Register, Profile} from './Components'
import { useNavigate } from "react-router-dom";

function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      console.log('useEffect running')
      const storedToken = localStorage.getItem('token');
      if(storedToken) setToken(storedToken);

      const storedUsername = localStorage.getItem('username');
      if(storedUsername) setUsername(storedUsername);

    }
    fetchData();
  }, [token]);

  return<Router>
    {token? <div>Logged in as {username}</div>: <div>You are not logged in</div>}
    <div id = "nav" >
        <Link to = '/'>Home</Link>
        { token?<>
        <Link to = '/profile'> Profile </Link>
        <Link to = '/' onClick = {() => {
          if(window.confirm('Are you sure you want to log out?'))
          {
            //let navigate = useNavigate();
            setToken('');
            setUsername('');
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            //navigate("../login");
          } }}> Logout</Link>
        </>: <>
          <Link to = '/login'>Login</Link>
          <Link to = '/register'>Register</Link>
          </>
        }

    </div>
    <Routes>
      <Route path = '/' element = {<Home token = {token}/>}></Route>
      <Route path = '/renju/:gameId' element={<Renju token = {token} username = {username} />}></Route>
      <Route path = '/renjuform' element = {<RenjuForm token = {token}/>}></Route>
      <Route path = '/login' element = {<Login setToken = {setToken}/>}></Route>
      <Route path = '/register' element = {<Register setToken = {setToken}/>}></Route>
      <Route path = '/profile' element = {<Profile username = {username} token = {token} />}></Route>
    </Routes>
  </Router>
}


ReactDOM.render(
    <App />,
    document.getElementById('root'),
);