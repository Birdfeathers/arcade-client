import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";

function Home()
{
    return<div>
        <h1>Arcade Games</h1>
    </div>
}

export default Home;