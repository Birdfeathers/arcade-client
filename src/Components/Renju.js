import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import socketIOClient from "socket.io-client";
import { BaseUrl as ENDPOINT } from "../constants";
import { useParams } from 'react-router-dom';
import {getGame, getWinLines} from '../apiCalls/index';
import {Table} from './Table'


const Yes = (x) => x?"yes":"no";


function Renju({token, username, socket})
{
    const {gameId} = useParams();
    const [game, setGame] = useState(null);
    const [moveHistory, setMoveHistory] = useState([]);
    const [style, setStyle] = useState("go");
    const [isCurrent, setIsCurrent] = useState(true);
    const [turnNum, setTurnNum] = useState(0);
    const [tempTurnNum, setTempTurnNum] = useState(0);
    const [turnPlayer, setTurnPlayer] = useState("");
    const [winLines, setWinLines] = useState([]);
    const [lineBoard, setLineBoard] = useState([]);
    const [future, setFuture] = useState(false);
    const [futureMoves, setFutureMoves] = useState([]);
    const [usedHistory, setUsedHistory] = useState([]);
    const [futureTurnNum, setFutureTurnNum] = useState(0);
    const [otherMoved, setOtherMoved] = useState(false);


    useEffect(() => {
        if(socket)socket.on("game", move => {
            if(move.game != gameId) return;
            setMoveHistory(move.history);
        })
    }, [socket])

    useEffect(() => {
        const storedStyle = localStorage.getItem('style');
        if(storedStyle) setStyle(storedStyle);
    }, [])

    useEffect(() => {
        const fetchData = async () => {
          console.log('useEffect for setting game running');
          if(!token) return;
          const game = await getGame(gameId);
          if(game){ 
            setGame(game);
            if(game.movehistory) {
                const parsedHis = JSON.parse(game.movehistory);
                setMoveHistory(parsedHis);
                setUsedHistory(parsedHis);
            } 
          }
    }
        fetchData();
      }, [token]);

     useEffect(() => {
         if(!game) return;
        console.log('useEffect for setting turn Number running')
        setTurnNum(moveHistory.length + 1);
        if(isCurrent){
            setTempTurnNum(moveHistory.length + 1);
            setUsedHistory(moveHistory);
        }else{
            setOtherMoved(true);
        }
     }, [game, lineBoard.length, moveHistory])



     useEffect(async () => {
         if(!game) return;
         console.log('UseEffect for usedHistory running.')
        const wins = await getWinLines(usedHistory,game.rows, game.cols, game.towin);
        setWinLines(wins.winLines);
        setLineBoard(wins.board);
        if(usedHistory.length % 2 == 0) setTurnPlayer({username: game.playeroneusername, color: "black"});
        else setTurnPlayer({username: game.playertwousername, color: "white"});

     }, [usedHistory])



    return<div>
       {game? <h1>Renju Game {game.id}</h1>: null}
       {winLines.length == 0 ? <div>{!game || tempTurnNum -1 !== game.rows * game.cols ?<div><h3 className = "inline">Turn {tempTurnNum + futureMoves.length}, </h3>{turnPlayer.username == username? <h3 className = "inline">Your </h3>:<h3 className = "inline">{turnPlayer.username}'s</h3> }<h3 className = "inline">({turnPlayer.color}) move!</h3></div>:
       <h3>Draw.</h3>}</div>:
       <div>{(winLines[0].color == "black" && game.playeroneusername == username) || (winLines[0].color == "white" && game.playertwousername == username)? <h3>Congratulations {username}({winLines[0].color}), you win!!!</h3>:
       <h3>You Lose. Too Bad.</h3> }</div>}
       {!isCurrent && tempTurnNum === turnNum? <h3>(Current Board)</h3>: !isCurrent? <h3>
        {turnNum - tempTurnNum} move(s) before current Board.
       </h3>: null}
       {otherMoved? <p> The other player has moved since you entered past/future mode</p>:null}
       <label>Board style: </label>
       <select value = {style} onChange = {(event) =>{
           setStyle(event.target.value);
           localStorage.setItem('style', event.target.value);
           }}>
           <option value = "go"> Go Board </option>
           <option value = "x"> Tic-Tac-Toe </option>
       </select>
       <br />
       <label>View Past/Future Board States</label>
       <input type = "checkbox" checked = {!isCurrent} onChange = {
           async event => {
            setIsCurrent(!event.target.checked)
            setUsedHistory(moveHistory);
            setTempTurnNum(turnNum);
            setFuture(false);
            setFutureMoves([]);
            setOtherMoved(false);
       }} />
       {isCurrent? null: <div> 
                <label>past moves: </label>
                <button name = "backbutton" disabled = {tempTurnNum == 1 || future} onClick = {async () => {
                    setUsedHistory(moveHistory.slice(0, tempTurnNum - 2));
                    setTempTurnNum(tempTurnNum -1);
                    }}>&#x2190;</button>
                <button name = "forwardbutton" disabled = {tempTurnNum === turnNum || future} onClick = {async () => {
                    setUsedHistory(moveHistory.slice(0, tempTurnNum));
                    setTempTurnNum(tempTurnNum +1);
                    }}>&#x2192;</button>
                <br />
                <label>See theoretical future moves</label>
                <input type = "checkbox" checked = {future} onChange = { async(event) =>{
                    setFutureMoves([]);
                    setFuture(event.target.checked);
                    setUsedHistory(moveHistory.slice(0, tempTurnNum -1))
                    setFutureTurnNum(0);
                }}></input> 
                {future? <div>
                    <label>future moves: </label>
                    <button name = "futurebackbutton" disabled = {futureTurnNum == 0} onClick = { () => {
                        setUsedHistory(moveHistory.slice(0, tempTurnNum -1).concat(futureMoves.slice(0, futureTurnNum -1 )));
                        setFutureTurnNum(futureTurnNum - 1)
                    }}>&#x2190;</button>
                    <button name = "futureforawardbutton" disabled = {futureTurnNum >= futureMoves.length} onClick = { () => {
                        setUsedHistory(moveHistory.slice(0, tempTurnNum -1).concat(futureMoves.slice(0, futureTurnNum + 1)));
                        setFutureTurnNum(futureTurnNum + 1)
                    }}>&#x2192;</button>
                
                </div>:null}
               </div>}
       {lineBoard? <Table token = {token} 
                                style = {style} 
                                moveHistory = {moveHistory} 
                                isTurn = {username === turnPlayer.username}  
                                setTempTurnNum = {setTempTurnNum} 
                                setTurnNum = {setTurnNum}
                                socket = {socket} 
                                game = {game} 
                                winLines ={winLines} 
                                lineBoard = {lineBoard} setLineBoard = {setLineBoard} 
                                isCurrent = {isCurrent} 
                                future = {future} 
                                futureMoves = {futureMoves}
                                setFutureMoves = {setFutureMoves}
                                tempTurnNum = {tempTurnNum}
                                setTurnPlayer = {setTurnPlayer} 
                                setUsedHistory = {setUsedHistory}
                                futureTurnNum = {futureTurnNum}
                                setFutureTurnNum = {setFutureTurnNum}
                                />:null}
       { game? <div className = "border">
        <p>Rows: {game.rows} | Columns: {game.cols} | {game.towin} needed to win</p>
        <p>No ThreeThree: {Yes(game.nothreethree)} | No FourFour: {Yes(game.nofourfour)} | No Overline: {Yes(game.nooverline)} | Warn of illegal Moves: {Yes(game.givewarning)}</p>
        </div>: null}
    </div>
}

export default Renju;