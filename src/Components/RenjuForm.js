import e from "cors";
import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";
import {getAllUsers, newGame} from '../apiCalls/index';

function RenjuForm({token})
{
    const [players, setPlayers] = useState([]);
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);
    const [toWin, setToWin] = useState(3);
    const [style, setStyle] = useState('x');
    const [against, setAgainst] = useState(1);
    const [order, setOrder] = useState('shuffle');
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
       <form onSubmit = {async (event) =>{
           event.preventDefault();
           if(Number(toWin) > Number(rows) || Number(toWin) > Number(cols)) alert("Cannot make game with win Length greater than rows or columns.");
           else{
                let goesFirst;
                if(order === "black" || (order === "shuffle" && Math.floor(Math.random() * 2))) goesFirst = true;
                else goesFirst = false;
                const game = await newGame(token, rows, cols, toWin, against, goesFirst);
                if(game.error) alert(game.message);
                console.log(game);
            }

       }}>
            <label> Number of Rows : </label>
            <select name = "numRows" id = "numRows" value = {rows} onChange = {(e)=> {setRows(e.target.value)}}>
                {arr1.map((num, indx)=> <option value = {num} key = {indx}>{num}</option>)}
            </select>
            <label> Number of Columns : </label>
            <select name = "numColumns" id = "numColumns" value = {cols} onChange = {(e)=> {setCols(e.target.value)}}>
               {arr1.map((num, indx)=> <option value = {num} key = {indx}>{num}</option>)}
            </select>
            <label> Number in a row needed to win:</label>
            <select name = "winLength" id = "winLength" value = {toWin} onChange = {(e)=> {setToWin(e.target.value)}}>
                {arr1.map((num, indx)=> <option value = {num} key = {indx}>{num}</option>)}
            </select>
            <label>Board Style: </label>
            <select name = "styles" id = "styles" value = {style} onChange = {(e)=> {setStyle(e.target.value)}}>
                <option value = "x">Tic-Tac-Toe</option>
                <option value = "go">Go Board</option>
            </select>
            <label>Challenge: </label>
            <select value = {against} onChange = {(e)=> {setAgainst(e.target.value)}}>
                {players.map((player) => <option key ={player.id} value = {player.id}>{player.username}</option>)}
            </select>
            <label> Order </label>
            <select name = "gametype" id = "gametype" value = {order} onChange = {(e)=> {setOrder(e.target.value)}}>
                <option value = "shuffle"> Shuffle turn order</option>
                <option value = "black"> Play First</option>
                <option value = "white"> Play Second </option>
            </select>
         
            <input type = "submit" />
            
            
            
        </form>
    </div>
}

export default RenjuForm;