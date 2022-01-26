import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";
import {Renju, RenjuForm, Home, Login, Register, Profile} from './Components'
import {getGamesByUser} from './apiCalls/index';

function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    // socket.on("FromAPI", data => {
    //   setResponse(data);
    // });

    const fetchData = async () => {
      console.log('useEffect running')
      const storedToken = localStorage.getItem('token');
      if(storedToken) setToken(storedToken);

      const storedUsername = localStorage.getItem('username');
      if(storedUsername) setUsername(storedUsername);

      // if(token) {
      //   const games = await getGamesByUser(token);
      //   if(games) setMyGames(games);
        
      // }


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
            setToken('');
            setUsername('');
            localStorage.removeItem('token');
            localStorage.removeItem('username');
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