import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import socketIOClient from "socket.io-client";
import { BaseUrl as ENDPOINT } from "../constants";
import { useParams } from 'react-router-dom';
import {getGame, getWinLines} from '../apiCalls/index';
import {Table} from './Table'


function createBlankArray(rows, cols){
    let arr = [];
    for(let i = 0; i < rows; i++)
    {
        let r = [];
        for(let j = 0; j < cols; j++)
        {
            r.push({occupied:false, type: "none"})
        }
        arr.push(r);
    }
    return arr;
}

function createFilledArray(rows, cols, history)
{
    let arr1 = createBlankArray(rows, cols);
    history.forEach((move, indx) => {
        let turn;
        if(indx % 2 == 0) turn = "black";
        else turn = "white";
        arr1[move.row][move.col] = {occupied:true, type: turn, moveNum: indx + 1};
    });
    return arr1;
}

function Renju({token, username})
{
    const {gameId} = useParams();
    const [game, setGame] = useState(null);
    const [moveHistory, setMoveHistory] = useState([]);
    const [style, setStyle] = useState("go");
    const [board, setBoard] = useState("");
    const [isCurrent, setIsCurrent] = useState(true);
    const [turnNum, setTurnNum] = useState(0);
    const [tempTurnNum, setTempTurnNum] = useState(0);
    const [turnPlayer, setTurnPlayer] = useState("");
    const [socket, setSocket] = useState(null);
    const [winLines, setWinLines] = useState([]);
    const [lineBoard, setLineBoard] = useState([]);

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT,{ transports : ['websocket'] });
        socket.on("game" + gameId, move => {
            setMoveHistory(move.history);
            setTempTurnNum(move.history.length + 1);
            setTurnNum(move.history.length + 1);
            setWinLines(move.winLines);
            setLineBoard(move.board);
        })
        setSocket(socket);
        return () => socket.disconnect();
    }, [setSocket])

    useEffect(() => {
        const fetchData = async () => {
          console.log('useEffect for setting game running');
          if(!token) return;
          console.log(gameId)
          const game = await getGame(gameId);
          console.log("game", game)
          if(game){ 
            setGame(game);
            if(game.movehistory) {
                const parsedHis = JSON.parse(game.movehistory);
                console.log(parsedHis)
                setMoveHistory(parsedHis)
                const wins = await getWinLines(parsedHis,game.rows, game.cols, game.towin);
                console.log(wins);
                setWinLines(wins.winLines);
                setLineBoard(wins.board);
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
     }, [game, moveHistory, board.length])

     useEffect(() => {
         if(!game) return;
         console.log('useEffect for setting board running');
        setBoard(createFilledArray(game.rows, game.cols, moveHistory.slice(0, tempTurnNum -1)));
        if(tempTurnNum % 2 == 1) setTurnPlayer({username: game.playeroneusername, color: "black"});
        else setTurnPlayer({username: game.playertwousername, color: "white"});
         
     },[tempTurnNum, moveHistory])
    

    return<div>
       <h1>Renju</h1>
       {winLines.length == 0 ? <div>{!game || tempTurnNum -1 !== game.rows * game.cols ?<h3>Turn {tempTurnNum} {turnPlayer.color}'s({turnPlayer.username}'s) move</h3>:
       <h3>Draw.</h3>}</div>:
       <div>{(winLines[0].color == "black" && game.playeroneusername == username) || (winLines[0].color == "white" && game.playertwousername == username)? <h3>Congratulations {username}, you win!!!</h3>:
       <h3>You Lose. Too Bad.</h3> }</div>}
       {!isCurrent && tempTurnNum === turnNum? <h3>(Current Board)</h3>: !isCurrent? <h3>
        {turnNum - tempTurnNum} moves away from current Board.
       </h3>: null}
       <label>Board style: </label>
       <select value = {style} onChange = {(event) =>{setStyle(event.target.value)}}>
           <option value = "go"> Go Board </option>
           <option value = "x"> Tic-Tac-Toe </option>
       </select>
       <br />
       <label>View Past Board States</label>
       <input type = "checkbox" checked = {!isCurrent} onChange = {
           async event => {setIsCurrent(!event.target.checked)
            const wins = await getWinLines(moveHistory,game.rows, game.cols, game.towin);
            setWinLines(wins.winLines);
            setLineBoard(wins.board);
           setTempTurnNum(turnNum);
       }} />
       {isCurrent? null: <div> 
                <button name = "backbutton" disabled = {tempTurnNum == 1} onClick = {async () => {
                    const wins = await getWinLines(moveHistory.slice(0, tempTurnNum -2),game.rows, game.cols, game.towin);
                    setWinLines(wins.winLines);
                    setLineBoard(wins.board);
                    setTempTurnNum(tempTurnNum -1);
                    }}>&#x2190;</button>
                <button name = "forwardbutton" disabled = {tempTurnNum === turnNum} onClick = {async () => {
                    const wins = await getWinLines(moveHistory.slice(0, tempTurnNum),game.rows, game.cols, game.towin);
                    setWinLines(wins.winLines);
                    setLineBoard(wins.board);
                    setTempTurnNum(tempTurnNum +1);
                    }}>&#x2192;</button>
               </div>}
       {board? <Table token = {token} style = {style} board = {board} moveHistory = {moveHistory} isTurn = {username === turnPlayer.username} username = {username} setMoveHistory = {setMoveHistory}  setTempTurnNum = {setTempTurnNum} setTurnNum = {setTurnNum} socket = {socket} game = {game} setWinLines = {setWinLines} winLines ={winLines} lineBoard = {lineBoard} setLineBoard = {setLineBoard}/>:null}
    </div>
}

export default Renju;