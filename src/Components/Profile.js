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


function MyGames({token, username, socket})
{
    const [games, setGames] = useState([]);
    const [mode, setMode] = useState("active");
    useEffect(() => {
        const fetchData = async () => {
          console.log('useEffect running');
          if(!token) return;
          const games1 = await getGamesByUser(token);
          if(games1){
          setGames(sortGames(games1));
        }
    }
        fetchData();
      }, [token]);

      useEffect(() => {
        if(socket){
        socket.on("created", async () => {
        if(!token) return;
          const games1 = await getGamesByUser(token);
          if(games1){
            setGames(sortGames(games1));
          }
        })

        socket.on('activated', async () => {
            console.log("in socket");
        if(!token) return;
          const games1 = await getGamesByUser(token);
          if(games1){
            setGames(sortGames(games1));
          }
        })

        socket.on("game", async () => {
          if(!token) return;
            const games1 = await getGamesByUser(token);
            if(games1){
              setGames(sortGames(games1));
            }
          })
    }

    }, [socket])

      return<>
        <h3>Games:</h3>
        <select value = {mode} onChange = {(event) => {setMode(event.target.value)}}>
            <option value = "active">Active</option>
            <option value = "complete">Complete</option>
            <option value = "pending">Pending</option>
        </select>
        { games.filter(game => {return game.status == mode;}).map((game) => {
        return <GameCard key = {game.id} token = {token} username = {username} game = {game} mode = {mode} socket  = {socket}/>
    })}

      </>
}

function Profile({username, token, socket})
{
    const [passwordOpen, setPasswordOpen] = useState(false);
    return <div>
        <h1>Profile</h1>
        <button onClick = {() => {
            setPasswordOpen(!passwordOpen);
        }}> Change password</button>
        {passwordOpen? <ChangeUserPassword token = {token} username = {username} setPasswordOpen = {setPasswordOpen}/>: null}
        {token? <Link to = '/renjuform'><button>Create New Tic-Tac-Toe/Renju Game</button></Link>: null}
        <MyGames token = {token} username = {username} socket = {socket}/>

    </div>
}



export default Profile;