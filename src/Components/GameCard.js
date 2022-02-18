import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateStatus, deleteGame} from '../apiCalls/index';

function convertMilliseconds(mill)
{
    const totalSeconds = Math.floor(mill /1000);
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

function GameCard({token, username, game, mode})
{
    let navigate = useNavigate();
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
            if(game.status == "pending") return;
            navigate(`../renju/${game.id}`);
        }}> 
            <h4>Game Number {game.id}</h4>
            {mode == "complete"? <p>winner: {winner}</p>:
            <div>
                {mode == "active"?<div>{turnPlayer == username? <p className = "redText">Your turn</p>: <p>{turnPlayer}'s turn</p>}</div>:
                <div>
                    <p>Game pending: </p>
                    {(game.ownerusername != username || game.playeroneusername == game.playertwousername)?<div>
                        <button onClick = {() =>{
                            updateStatus(token, game.id, "active");
                            navigate(`../renju/${game.id}`);
                        }}>Accept</button>
                        <button onClick = {async () => {
                            deleteGame(token, game.id);
                        }}>Decline</button>
                    </div>:<div>
                        <p>Waiting for opponent to accept.</p>
                        <button onClick = {() => {
                            deleteGame(token, game.id);
                        }}>Withdraw Game</button>
                        </div>}
                </div>}
            </div>}
            <p>Last Updated {convertMilliseconds(lastPlayed)} ago</p>
            <p>Started by: {game.ownerusername}  at {convertTime(startDate)} on {convertDate(startDate)}</p>
            <p> First Player: {game.playeroneusername} | Second Player: {game.playertwousername}</p>
            <p>Rows: {game.rows} | Columns: {game.cols} | {game.towin} needed to win</p>
            <p>No ThreeThree: {Yes(game.nothreethree)} | No FourFour: {Yes(game.nofourfour)} | No Overline: {Yes(game.nooverline)} | Warn of illegal Moves: {Yes(game.givewarning)}</p>
        </div>
}

export default GameCard;