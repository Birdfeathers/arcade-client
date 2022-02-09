import React, { useState, useEffect } from "react";
import {login, updatePassword, getGamesByUser, updateMoveHistory} from '../apiCalls/index';
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function ChangeUserPassword({username, token, setPasswordOpen})
{
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    return<form onSubmit = { async (event) => {
        event.preventDefault();
        const result = await login(username, oldPassword);
        if(result.error) alert('Old password is incorrect.');
        else{
            const change = await updatePassword(newPassword, token );
            console.log(change);
            if(change.error) alert(change.message);
            else alert('Password successfully changed.')
            setPasswordOpen(false);
        }
        }}>
        <input type = "password" placeholder = "old password" value = {oldPassword} onChange = {(event) => {
            setOldPassword(event.target.value);
        }}/>
        <input type = "password" placeholder = "new password" value = {newPassword} onChange = {(event) => {
            setNewPassword(event.target.value);
        }}/>
        <input type = "submit"/>
    </form>
}

function convertMilliseconds(mill)
{
    const totalSeconds = mill /1000;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const totalHours = Math.floor(totalMinutes/60);
    const remainingMinutes = totalMinutes % 60;
    const totalDays = Math.floor(totalHours / 24);
    const remainingHours = totalHours %24;
    let string = "";
    if(totalDays > 0) string += `${totalDays} day(s), `;
    if(totalHours > 0) string += `${remainingHours} hour(s)`;
    if(totalHours > 0 && totalDays == 0) string += ', ';
    if(totalMinutes > 0 && totalDays == 0) string += `${remainingMinutes} minute(s)`;
    if(totalMinutes == 0) string += `${remainingSeconds} second(s)`;
    return string;
}

function convertTime(date)
{
    const hours = date.getHours() % 12;
    const type = date.getHours() < 12? "am":"pm";
    const minutes = date.getMinutes();
    const insert = minutes < 10 ? "0":"";
    return `${hours}:${insert}${minutes}${type}`;
}

function convertDate(date)
{
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

const Yes = (x) => x?"yes":"no";


function MyGames({token, username})
{
    let navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [mode, setMode] = useState("active");
    useEffect(() => {
        const fetchData = async () => {
          console.log('useEffect running');
          if(!token) return;
          const games = await getGamesByUser(token);
          const sortedGames = games.sort((a, b) => {
            const aDate = new Date(a.lastupdate);
            const bDate = new Date(b.lastupdate);
            return bDate - aDate;
          })
          if(games) setGames(sortedGames);
    }
        fetchData();
      }, [token]);
      return<>
        <h3>Games:</h3>
        <select value = {mode} onChange = {(event) => {setMode(event.target.value)}}>
            <option value = "active">Active</option>
            <option value = "complete">Complete</option>
        </select>
        { games.filter(game => {if(mode == "active") return !game.winner; else return game.winner;}).map((game) => {
            let winner;
            if(game.winner == "black") winner = game.playeroneusername;
            else if(game.winner == "white")winner = game.playertwousername;
            else winner = "tie";
            let turn = 1;
            let turnPlayer = game.playeroneusername
            if(game.movehistory){
                turn = JSON.parse(game.movehistory).length + 1;
                if(turn % 2) turnPlayer = game.playeroneusername;
                else turnPlayer = game.playertwousername;
            }
            let currentDate = new Date();
            let startDate = new Date(game.timecreated);
            let turnDate = new Date(game.lastupdate);
            let lastPlayed = currentDate - turnDate;

        return<div key = {game.id} className = "border" onClick = {(event) => {
            navigate(`../renju/${game.id}`);
        }}> 
            <h4>Game Number {game.id}</h4>
            {mode == "complete"? <p>winner: {winner}</p>:
            <div>{turnPlayer == username? <p className = "redText">Your turn</p>: <p>{turnPlayer}'s turn</p>}</div>}
            <p>Last Played {convertMilliseconds(lastPlayed)} ago</p>
            <p>Started by: {game.ownerusername}  at {convertTime(startDate)} on {convertDate(startDate)}</p>
            <p> First Player: {game.playeroneusername} | Second Player: {game.playertwousername}</p>
            <p>Rows: {game.rows} | Columns: {game.cols} | {game.towin} needed to win</p>
            <p>No ThreeThree: {Yes(game.nothreethree)} | No FourFour: {Yes(game.nofourfour)} | No Overline: {Yes(game.nooverline)} | Warn of illegal Moves: {Yes(game.givewarning)}</p>
        </div>})}

      </>
}

function Profile({username, token})
{
    const [passwordOpen, setPasswordOpen] = useState(false);
    return <div>
        <h1>Profile</h1>
        <button onClick = {() => {
            setPasswordOpen(!passwordOpen);
        }}> Change password</button>
        {passwordOpen? <ChangeUserPassword token = {token} username = {username} setPasswordOpen = {setPasswordOpen}/>: null}
        {token? <Link to = '/renjuform'><button>Create New Tic-Tac-Toe/Renju Game</button></Link>: null}
        <MyGames token = {token} username = {username}/>

    </div>
}



export default Profile;