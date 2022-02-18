import React, { useState, useEffect } from "react";
import {login, updatePassword, getGamesByUser} from '../apiCalls/index';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GameCard from "./GameCard";

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



function sortGames(games)
{
    const sortedGames = games.sort((a, b) => {
    const aDate = new Date(a.lastupdate);
    const bDate = new Date(b.lastupdate);
    return bDate - aDate;
    })
    return sortedGames;
}


function MyGames({token, username})
{
    const [games, setGames] = useState([]);
    const [mode, setMode] = useState("active");
    useEffect(() => {
        const fetchData = async () => {
          console.log('useEffect running');
          if(!token) return;
          const games = await getGamesByUser(token);
          if(games){
        //   const sortedGames = games.sort((a, b) => {
        //     const aDate = new Date(a.lastupdate);
        //     const bDate = new Date(b.lastupdate);
        //     return bDate - aDate;
        //   })
          setGames(sortGames(games));
        }
    }
        fetchData();
      }, [token]);
      return<>
        <h3>Games:</h3>
        <select value = {mode} onChange = {(event) => {setMode(event.target.value)}}>
            <option value = "active">Active</option>
            <option value = "complete">Complete</option>
            <option value = "pending">Pending</option>
        </select>
        { games.filter(game => {return game.status == mode;}).map((game) => {
        //     let winner;
        //     if(game.winner == "black") winner = game.playeroneusername;
        //     else if(game.winner == "white")winner = game.playertwousername;
        //     else winner = "tie";
        //     let turn = 1;
        //     let turnPlayer = game.playeroneusername
        //     if(game.movehistory){
        //         turn = JSON.parse(game.movehistory).length + 1;
        //         if(turn % 2) turnPlayer = game.playeroneusername;
        //         else turnPlayer = game.playertwousername;
        //     }
        //     let currentDate = new Date();
        //     let startDate = new Date(game.timecreated);
        //     let turnDate = new Date(game.lastupdate);
        //     let lastPlayed = currentDate - turnDate;

        // return<div key = {game.id} className = "border" onClick = {(event) => {
        //     if(game.status == "pending") return;
        //     navigate(`../renju/${game.id}`);
        // }}> 
        //     <h4>Game Number {game.id}</h4>
        //     {mode == "complete"? <p>winner: {winner}</p>:
        //     <div>
        //         {mode == "active"?<div>{turnPlayer == username? <p className = "redText">Your turn</p>: <p>{turnPlayer}'s turn</p>}</div>:
        //         <div>
        //             <p>Game pending: </p>
        //             {(game.ownerusername != username || game.playeroneusername == game.playertwousername)?<div>
        //                 <button onClick = {() =>{
        //                     updateStatus(token, game.id, "active");
        //                     navigate(`../renju/${game.id}`);
        //                 }}>Accept</button>
        //                 <button onClick = {async () => {
        //                     let gamesCopy = [...games];
        //                     gamesCopy.splice(games.indexOf(game), 1);
        //                     setGames(gamesCopy);
        //                     deleteGame(token, game.id);
        //                 }}>Decline</button>
        //             </div>:<div>
        //                 <p>Waiting for opponent to accept.</p>
        //                 <button onClick = {() => {
        //                     let gamesCopy = [...games];
        //                     gamesCopy.splice(games.indexOf(game), 1);
        //                     setGames(gamesCopy);
        //                     deleteGame(token, game.id);
        //                 }}>Withdraw Game</button>
        //                 </div>}
        //         </div>}
        //     </div>}
        //     <p>Last Updated {convertMilliseconds(lastPlayed)} ago</p>
        //     <p>Started by: {game.ownerusername}  at {convertTime(startDate)} on {convertDate(startDate)}</p>
        //     <p> First Player: {game.playeroneusername} | Second Player: {game.playertwousername}</p>
        //     <p>Rows: {game.rows} | Columns: {game.cols} | {game.towin} needed to win</p>
        //     <p>No ThreeThree: {Yes(game.nothreethree)} | No FourFour: {Yes(game.nofourfour)} | No Overline: {Yes(game.nooverline)} | Warn of illegal Moves: {Yes(game.givewarning)}</p>
        // </div>
        return <GameCard key = {game.id} token = {token} username = {username} game = {game} mode = {mode}/>

    })}

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