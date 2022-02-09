import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import {getAllUsers, newGame} from '../apiCalls/index';
import { useNavigate } from "react-router-dom";

function RenjuForm({token})
{
    const [players, setPlayers] = useState([]);
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);
    const [toWin, setToWin] = useState(3);
    const [against, setAgainst] = useState(1);
    const [order, setOrder] = useState('shuffle');
    const [overline, setOverline] = useState(false);
    const [threeThree, setThreeThree] = useState(false);
    const [fourFour, setFourFour] = useState(false);
    const [isRenju, setIsRenju] = useState(false);
    const [giveWarning, setGiveWarning] = useState(false);
    let navigate = useNavigate();
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
    for(let i = 3; i < 20; i++)
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
                const game = await newGame(token, rows, cols, toWin, against, goesFirst, Number(overline), Number(threeThree), Number(fourFour), Number(giveWarning));
                if(game.error) alert(game.message);
                console.log(game);
                navigate(`../renju/${game.id}`);
            }

       }}>
           <label>Renju Restrictions?: </label>
           <input type = "checkbox" checked = {isRenju} onChange = {(event) => {
               setIsRenju(event.target.checked);
               setToWin(5);
               setRows(15);
               setCols(15);
               setOverline(event.target.checked);
               setThreeThree(event.target.checked);
               setFourFour(event.target.checked);
               setGiveWarning(event.target.checked);
               }}></input>
            <label> Number of Rows : </label>
            <select name = "numRows" id = "numRows" value = {rows} onChange = {(e)=> {setRows(e.target.value)}}>
                {arr1.map((num, indx)=> <option value = {num} key = {indx}>{num}</option>)}
            </select>
            <label> Number of Columns : </label>
            <select name = "numColumns" id = "numColumns" value = {cols} onChange = {(e)=> {setCols(e.target.value)}}>
               {arr1.map((num, indx)=> <option value = {num} key = {indx}>{num}</option>)}
            </select>
            <label> Number in a row needed to win:</label>
            <select name = "winLength" id = "winLength" value = {toWin} disabled = {isRenju} onChange = {(e)=> {setToWin(e.target.value)}}>
                {arr1.map((num, indx)=> <option value = {num} key = {indx}>{num}</option>)}
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
            {isRenju? <div>
                <label>No Black Overline</label>
                <input type = "checkbox" checked = {overline} disabled = {true} onChange = {(event) => {setOverline(event.target.checked)}} />
                <label>No Black Three Threes</label>
                <input type = "checkbox" checked = {threeThree} onChange = {(event) => {setThreeThree(event.target.checked)}} /> 
                <label>No Black Four Fours</label>
                <input type = "checkbox" checked = {fourFour} onChange = {(event) => {setFourFour(event.target.checked)}} /> 
                <label>Warn about illlegal moves</label>
                <input type = "checkbox" checked = {giveWarning} onChange = {(event) => {setGiveWarning(event.target.checked)}} />
            </div>:null}
         
            <input type = "submit" />
            
            
            
        </form>
    </div>
}

export default RenjuForm;