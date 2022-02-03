import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import socketIOClient from "socket.io-client";
import { BaseUrl as ENDPOINT } from "../constants";
import { useParams } from 'react-router-dom';
import {getGame, getWinLines} from '../apiCalls/index';
import {Table} from './Table'





function Renju({token, username})
{
    const {gameId} = useParams();
    const [game, setGame] = useState(null);
    const [moveHistory, setMoveHistory] = useState([]);
    const [style, setStyle] = useState("go");
    const [isCurrent, setIsCurrent] = useState(true);
    const [turnNum, setTurnNum] = useState(0);
    const [tempTurnNum, setTempTurnNum] = useState(0);
    const [turnPlayer, setTurnPlayer] = useState("");
    const [socket, setSocket] = useState(null);
    const [winLines, setWinLines] = useState([]);
    const [lineBoard, setLineBoard] = useState([]);
    const [future, setFuture] = useState(false);
    const [futureMoves, setFutureMoves] = useState([]);
    const [usedHistory, setUsedHistory] = useState([]);
    const [futureTurnNum, setFutureTurnNum] = useState(0);

    useEffect(() => {
        console.log('useEffect for setting socket running');
        const socket = socketIOClient(ENDPOINT,{ transports : ['websocket'] });
        socket.on("game" + gameId, move => {
            setMoveHistory(move.history);
            setUsedHistory(move.history);
            setTempTurnNum(move.history.length + 1);
            setTurnNum(move.history.length + 1);
        })
        setSocket(socket);
        return () => socket.disconnect();
    }, [setSocket])

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
        setTempTurnNum(moveHistory.length + 1);
        if(moveHistory.length % 2 == 0) setTurnPlayer({username: game.playeroneusername, color: "black"});
        else setTurnPlayer({username: game.playertwousername, color: "white"});
     }, [game, moveHistory, lineBoard.length])

     useEffect(async () => {
         if(!game) return;
        const wins = await getWinLines(usedHistory,game.rows, game.cols, game.towin);
        setWinLines(wins.winLines);
        setLineBoard(wins.board);

     }, [game, usedHistory, moveHistory])



    return<div>
       <h1>Renju</h1>
       {winLines.length == 0 ? <div>{!game || tempTurnNum -1 !== game.rows * game.cols ?<h3>Turn {tempTurnNum + futureMoves.length} {turnPlayer.color}'s({turnPlayer.username}'s) move</h3>:
       <h3>Draw.</h3>}</div>:
       <div>{(winLines[0].color == "black" && game.playeroneusername == username) || (winLines[0].color == "white" && game.playertwousername == username)? <h3>Congratulations {username}, you win!!!</h3>:
       <h3>You Lose. Too Bad.</h3> }</div>}
       {!isCurrent && tempTurnNum === turnNum? <h3>(Current Board)</h3>: !isCurrent? <h3>
        {turnNum - tempTurnNum} move(s) before current Board.
       </h3>: null}
       <label>Board style: </label>
       <select value = {style} onChange = {(event) =>{setStyle(event.target.value)}}>
           <option value = "go"> Go Board </option>
           <option value = "x"> Tic-Tac-Toe </option>
       </select>
       <br />
       <label>View Past/Future Board States</label>
       <input type = "checkbox" checked = {!isCurrent} onChange = {
           async event => {setIsCurrent(!event.target.checked)
            setUsedHistory(moveHistory);
            setTempTurnNum(turnNum);
            setFuture(false);
            setFutureMoves([]);
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
    </div>
}

export default Renju;