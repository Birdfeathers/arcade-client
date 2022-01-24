import React, { useState, useEffect } from "react";
import {login, updatePassword, getGamesByUser, getUserById} from '../apiCalls/index';
import { useNavigate } from "react-router-dom";

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
            alert('Password successfully changed.')
            setPasswordOpen(false);
        }
        }}>
        <input type = "text" placeholder = "old password" value = {oldPassword} onChange = {(event) => {
            setOldPassword(event.target.value);
        }}/>
        <input type = "text" placeholder = "new password" value = {newPassword} onChange = {(event) => {
            setNewPassword(event.target.value);
        }}/>
        <input type = "submit"/>
    </form>
}

function MyGames({token})
{
    const [activeGames, setActiveGames] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          console.log('useEffect running');
          if(!token) return;
          const games = await getGamesByUser(token);
          console.log(games);
          if(games) {
            const newGames = await Promise.all(games.filter(game => !game.winner).map(await async function(game) {
                game.owner = await getUserById(game.owner);
                game.playerOne = await getUserById(game.playerOne);
                game.playerTwo = await getUserById(game.playerTwo);
                return game;
            }))
            console.log("newGames", newGames);
            setActiveGames(newGames);
        
        }}
        fetchData();
      }, [token]);
      return<>
        <h3>My Games:</h3>
        { activeGames.map((game) => {
        return<div key = {game.id}> 
            <h5>Game</h5>
            <p>Started by: {game.owner.username} | First Player: {game.playerOne.username} | Second Player: {game.playerTwo.username}</p>
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
        <MyGames token = {token}/>

    </div>
}

export default Profile;