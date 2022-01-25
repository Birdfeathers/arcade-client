import React, { useState, useEffect } from "react";
import {login, updatePassword, getGamesByUser} from '../apiCalls/index';
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
            if(change.error) alert(change.message);
            else alert('Password successfully changed.')
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
    let navigate = useNavigate();
    const [games, setGames] = useState([]);
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
        <h3>Active Games:</h3>
        { games.filter(game => !game.winner).map((game) => {
        return<div key = {game.id} className = "border" onClick = {(event) => {
            navigate(`../renju/${game.id}`);
        }}> 
            <h5>Game</h5>
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
        <MyGames token = {token} />

    </div>
}

export default Profile;