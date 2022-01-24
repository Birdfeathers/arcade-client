import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";

function Home({token})
{
    return<div>
        <h1>Arcade Games</h1>
        {token? <Link to = '/renjuform'><button>Create New Tic-Tac-Toe/Renju Game</button></Link>: null}
    </div>
}

export default Home;