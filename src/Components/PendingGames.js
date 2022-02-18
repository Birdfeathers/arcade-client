import React, { useState, useEffect } from "react";
import {getGamesByUser} from '../apiCalls/index';
import GameCard from "./GameCard";

function sortGames(games)
{
    const sortedGames = games.sort((a, b) => {
    const aDate = new Date(a.lastupdate);
    const bDate = new Date(b.lastupdate);
    return bDate - aDate;
    })
    return sortedGames;
}

function PendingGames({token, username})
{
    const [myGames, setMyGames] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          console.log('useEffect running');
          if(!token) return;
          const games = await getGamesByUser(token);
          if(games){
          setMyGames(sortGames(games.filter(game => {return game.status == "pending";})));
        }}
        fetchData();
    }, [token]);
    return<div>
        <h1>PendingGames</h1>
        <h3>Games started by you: </h3>
        {myGames.filter(game => game.ownerusername == username).map(game => {
            return <GameCard key = {game.id} token = {token} username = {username} game = {game} mode = "pending"/>
        })}
        <h3>Games you were invited to: </h3>
        {myGames.filter(game => game.ownerusername != username).map(game => {
            return <GameCard key = {game.id} token = {token} username = {username} game = {game} mode = "pending"/>
        })}
    </div>

}

export default PendingGames;