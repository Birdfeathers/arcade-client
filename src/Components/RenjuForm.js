import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";

function RenjuForm()
{
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
            <label> GameType</label>
            <select name = "gametype" id = "gametype">
                <option value = "twoPlayer"> Two Players</option>
                <option value = "whiteComp"> Play First</option>
                <option value = "blackComp"> Play Second </option>
                <option value = "allComp"> Computer vs. Computer</option>
            </select>
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
            <br/>
            <label>First player name: </label>
            <input type = "text" id = "firstPlayer" name = "firstPlayer"/>
            <label> Second player name:</label>
            <input type = "text" id = "secondPlayer" name = "secondPlayer"/>
            <label>Shuffle turn order</label>
            <input type = "checkbox" name = "shuffle" id = "shuffle"/>
            <input type = "submit" />
            
            
            
        </form>
    </div>
}

export default RenjuForm;