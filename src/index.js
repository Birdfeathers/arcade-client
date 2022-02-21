import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import { BaseUrl as ENDPOINT } from "./constants";
import {Renju, RenjuForm, Home, Login, Register, Profile, PendingGames} from './Components'
import { useNavigate } from "react-router-dom";

function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [socket, setSocket] = useState('');
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

  useEffect(() => {
    console.log('useEffect for setting socket running');
    const socket = socketIOClient(ENDPOINT,{ transports : ['websocket'] });
    setSocket(socket);
    return () => socket.disconnect();
}, [setSocket])

  return<Router>
    {token? <div>
        <p className = "inline" >Logged in as {username}  </p>
        <button className = "inline" onClick = {() => {
          if(window.confirm('Are you sure you want to log out?'))
          {
            setToken('');
            setUsername('');
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            window.location='/login';
          }}}>Logout</button>
        </div>
          : <div><p>You are not logged in</p></div>}
    <div id = "nav" >
        <Link to = '/'>Home</Link>
        { token?<>
        <Link to = '/profile'> Profile </Link>
        {/* <Link to = '/login' onClick = {() => {
          if(window.confirm('Are you sure you want to log out?'))
          {
            setToken('');
            setUsername('');
            localStorage.removeItem('token');
            localStorage.removeItem('username');
          } }}> Logout</Link> */}
          <Link to = '/pendinggames' >PendingGames</Link>
        </>: <>
          <Link to = '/login'>Login</Link>
          <Link to = '/register'>Register</Link>
          </>
        }

    </div>
    <Routes>
      <Route path = '/' element = {<Home token = {token}/>}></Route>
      <Route path = '/renju/:gameId' element={<Renju token = {token} username = {username} socket = {socket}/>}></Route>
      <Route path = '/renjuform' element = {<RenjuForm token = {token} socket = {socket}/>}></Route>
      <Route path = '/login' element = {<Login setToken = {setToken}/>}></Route>
      <Route path = '/register' element = {<Register setToken = {setToken}/>}></Route>
      <Route path = '/profile' element = {<Profile username = {username} token = {token} socket = {socket}/>}></Route>
      <Route path = '/pendinggames' element = {<PendingGames token = {token} username = {username} socket = {socket}/>}></Route>
    </Routes>
  </Router>
}


ReactDOM.render(
    <App />,
    document.getElementById('root'),
);