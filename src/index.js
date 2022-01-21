import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";
import {Renju, RenjuForm, Home, Login} from './Components'

function App() {
  // const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    // socket.on("FromAPI", data => {
    //   setResponse(data);
    // });
  }, []);

  return<Router>
    <div id = "nav" >
        <Link to = '/'>Home</Link>
        <Link to = '/renju'>Renju/Tic-Tac-Toe</Link>
        <Link to = '/login'>Login</Link>
    </div>
    <Routes>
      <Route path = '/' element = {<Home/>}></Route>
      <Route path = '/renju' element={<Renju />}></Route>
      <Route path = '/renjuform' element = {<RenjuForm/>}></Route>
      <Route path = '/login' element = {<Login/>}></Route>
    </Routes>
  </Router>
}


ReactDOM.render(
    <App />,
    document.getElementById('root'),
);