import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateStatus, deleteGame, getGame} from '../apiCalls/index';

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

function GameCard({token, username, game, mode, socket})
{
    let navigate = useNavigate();
    const [deleted, setDeleted] = useState(false);
    const [currentMode, setCurrentMode] = useState(mode)
    const [currentGame, setCurrentGame] = useState(game);
    useEffect(() => {
        if(socket){
            socket.on("delete" + currentGame.id, () => {
            setDeleted(true);
            })

            socket.on('activated', id => {
                if(id != currentGame.id) return;
                setCurrentMode('active')
            })

            socket.on('game' + currentGame.id, async () => {
                let game = await getGame(currentGame.id);
                setCurrentGame(game);
                setCurrentMode(game.status);
            })
        }
    }, [socket])
    let winner;
            if(currentGame.winner == "black") winner = currentGame.playeroneusername;
            else if(currentGame.winner == "white")winner = currentGame.playertwousername;
            else winner = "tie";
            let turn = 1;
            let turnPlayer = currentGame.playeroneusername
            if(currentGame.movehistory){
                turn = JSON.parse(currentGame.movehistory).length + 1;
                if(turn % 2) turnPlayer = currentGame.playeroneusername;
                else turnPlayer = currentGame.playertwousername;
            }
            let currentDate = new Date();
            let startDate = new Date(currentGame.timecreated);
            let turnDate = new Date(currentGame.lastupdate);
            let lastPlayed = currentDate - turnDate;

        return(<div>{!deleted ? <div className = "border gamecard" onClick = {(event) => {
            if(currentMode == "pending") return;
            navigate(`../renju/${currentGame.id}`);
        }}> 
            <h4>Game Number {currentGame.id}</h4>
            {currentMode == "complete"? <p>winner: {winner}</p>:
            <div>
                {currentMode == "active"?<div>{turnPlayer == username? <p className = "redText">Your turn</p>: <p>{turnPlayer}'s turn</p>}</div>:
                <div>
                    <p>Game pending: </p>
                    {(currentGame.ownerusername != username || currentGame.playeroneusername == currentGame.playertwousername)?<div>
                        <button onClick = {() =>{
                            updateStatus(token, currentGame.id, "active");
                            socket.emit('activated', currentGame.id);
                            navigate(`../renju/${currentGame.id}`);
                        }}>Accept</button>
                        <button onClick = {async () => {
                            deleteGame(token, currentGame.id);
                            socket.emit('delete', currentGame.id);
                        }}>Decline</button>
                    </div>:<div>
                        <button onClick = {() => {
                            deleteGame(token, currentGame.id);
                            socket.emit('delete', currentGame.id);
                        }}>Withdraw Game</button>
                        </div>}
                </div>}
            </div>}
            <p>Last Updated {convertMilliseconds(lastPlayed)} ago</p>
            <p>Started by: {currentGame.ownerusername}  at {convertTime(startDate)} on {convertDate(startDate)}</p>
            <p> First Player: {currentGame.playeroneusername} | Second Player: {currentGame.playertwousername}</p>
            <p>Rows: {currentGame.rows} | Columns: {currentGame.cols} | {currentGame.towin} needed to win</p>
            <p>No ThreeThree: {Yes(currentGame.nothreethree)} | No FourFour: {Yes(currentGame.nofourfour)} | No Overline: {Yes(currentGame.nooverline)} | Warn of illegal Moves: {Yes(currentGame.givewarning)}</p>
        </div>: null}</div>)
}

export default GameCard;