import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function Home({token})
{
    return<div>
        <h1>Arcade Games</h1>
        {token? <Link to = '/renjuform'><button>Create New Tic-Tac-Toe/Renju Game</button></Link>: null}
    </div>
}

export default Home;