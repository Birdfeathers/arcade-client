import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";
import { useParams } from 'react-router-dom';
import {getGame} from '../apiCalls/index';

function Cross({rowNum, colNum, rows, cols})
{         let topLeft = "fourth", bottomLeft = "fourth", topRight = "fourth", bottomRight = "fourth";
         if(rowNum != 0) topRight += " borderLeft";
         if(colNum != 0) topLeft += " borderBottom";
         if(rowNum != rows-1) bottomRight += " borderLeft";
         if(colNum != cols -1) topRight += " borderBottom";
          return<div className = "tan">
          <div className = "half">
            <div className = {topLeft}></div>
            <div className = {topRight}></div>
        </div>
        <div className = "half">
            <div className = {bottomLeft}></div>
            <div className = {bottomRight}></div>
        </div>
        </div>

}

function Edges({rowNum, colNum, rows, cols})
{
    let classList = "";
    if(rowNum != rows -1) classList += " borderBottom";
    if(colNum != 0) classList += " borderLeft"
    return <td className = {classList} />
}

function Cell({style, rowNum, colNum, rows, cols})
{
    return <td>{style === "go"? <Cross rowNum = {rowNum} colNum = {colNum} rows = {rows} cols = {cols}/>:
    <Edges rowNum = {rowNum} colNum = {colNum} rows = {rows} cols = {cols}></Edges>}</td>
}
function Row({cols, rows, style, rowNum})
{
    let row = [];
    for(let i = 0; i< cols; i++)
    {
        row.push(<Cell style = {style} key = {i} rowNum = {rowNum} colNum = {i} rows = {rows} cols = {cols}/>)
    }
    return <tr>{row}</tr>
}

function Table({rows, cols, style})
{
    let table = [];
    for(let i = 0; i< rows; i++)
    {
        table.push(<Row rows = {rows} cols = {cols} style = {style} rowNum = {i} key = {i}/>)
    }
    return <table cellSpacing = {0} cellPadding = {0}><tbody>{table}</tbody></table>
}

function Renju({token})
{
    const {gameId} = useParams();
    const [game, setGame] = useState({});
    const [moveHistory, setMoveHistory] = useState([]);
    const [style, setStyle] = useState("go");

    useEffect(() => {
        const fetchData = async () => {
          console.log('useEffect running');
          if(!token) return;
          console.log(gameId)
          const game = await getGame(gameId);
          console.log(game)
          if(game){ 
            setGame(game);
            if(!game.moveHistory) setMoveHistory([]);
            else setMoveHistory(JSON.parse(game.movehistory))
          }
    }
        fetchData();
      }, [token]);
    

    return<div>
       <h1>Renju</h1>
       <label>Board style: </label>
       <select value = {style} onChange = {(event) =>{setStyle(event.target.value)}}>
           <option value = "go"> Go Board </option>
           <option value = "x"> Tic-Tac-Toe </option>
       </select>
       <Table rows = {game.rows} cols = {game.cols} style = {style} />
    </div>
}

export default Renju;