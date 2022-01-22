import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";
import {getAllUsers} from '../apiCalls/index';

function RenjuForm()
{
    const [players, setPlayers] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          console.log('useEffect running')
          const users = await getAllUsers();
          if(users) setPlayers(users);
    
        }
        fetchData();
      }, []);
    let arr1 = [];
    let counter = 0;
    for(let i = 3; i < 16; i++)
    {
        arr1[counter] = i;
        counter++;
    }

    return<div>
       <h1>RenjuForm</h1>
       <form>
            <label> Number of Rows : </label>
            <select name = "numRows" id = "numRows">
                {arr1.map((num, indx)=> <option value = {num} key = {indx}>{num}</option>)}
            </select>
            <label> Number of Columns : </label>
            <select name = "numColumns" id = "numColumns">
               {arr1.map((num, indx)=> <option value = {num} key = {indx}>{num}</option>)}
            </select>
            <label> Number in a row needed to win:</label>
            <select name = "winLength" id = "winLength">
                {arr1.map((num, indx)=> <option value = {num} key = {indx}>{num}</option>)}
            </select>
            <label>Board Style: </label>
            <select name = "styles" id = "styles">
                <option value = "x">Tic-Tac-Toe</option>
                <option value = "go">Go Board</option>
            </select>
            <label>Challenge: </label>
            <select>
                {players.map((player) => <option key ={player.id} value = {player.id}>{player.username}</option>)}
            </select>
            <label> Order </label>
            <select name = "gametype" id = "gametype">
                <option value = "shuffle"> Shuffle turn order</option>
                <option value = "black"> Play First</option>
                <option value = "white"> Play Second </option>
            </select>
         
            <input type = "submit" />
            
            
            
        </form>
    </div>
}

export default RenjuForm;