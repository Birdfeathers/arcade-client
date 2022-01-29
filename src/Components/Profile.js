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

function MyGames({token})
{
    let navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [mode, setMode] = useState("active");
    useEffect(() => {
        const fetchData = async () => {
          console.log('useEffect running');
          if(!token) return;
          const games = await getGamesByUser(token);
          if(games) setGames(games);
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
            else winner = game.playertwousername;
            let turn = 1;
            let turnPlayer = game.playeroneusername
            if(game.movehistory){
                turn = JSON.parse(game.movehistory).length + 1;
                if(turn % 2) turnPlayer = game.playeroneusername;
                else turnPlayer = game.playertwousername;
            }
        return<div key = {game.id} className = "border" onClick = {(event) => {
            navigate(`../renju/${game.id}`);
        }}> 
            <h4>Game</h4>
            {mode == "complete"? <p>winner: {winner}</p>:<p>{turnPlayer}'s turn</p>}
            <p>Started by: {game.ownerusername} | First Player: {game.playeroneusername} | Second Player: {game.playertwousername}</p>
            <p>Rows: {game.rows} Columns: {game.cols} | {game.towin} needed to win</p>
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
        <MyGames token = {token} />

    </div>
}

export default Profile;