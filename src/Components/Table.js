import React, { useState, useEffect } from "react";
import {updateMoveHistory} from '../apiCalls/index';
import { useParams } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import { BaseUrl as ENDPOINT } from "../constants";

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

function X()
{
    return<div className = "full rotate45">
                <div className = "half">
                    <div className = "fourth borderBottom"></div>
                    <div className = "fourth borderLeft borderBottom"></div>
                </div>
                <div className = "half">
                    <div className = "fourth"></div>
                    <div className = "fourth borderLeft"></div>
                </div>
            </div>
}

function AddX({type}){
    return<div>
        {type === "black"?  <X />: <div className = "circle most border"></div>}
    </div>
}


function returnBorders(rowNum, colNum, rows)
{
    let classList = "";
    if(rowNum != rows -1) classList += " borderBottom";
    if(colNum != 0) classList += " borderLeft"
    return classList;
}



function Table({token, style, board, moveHistory, isTurn})
{
    const {gameId} = useParams();
    const socket = socketIOClient(ENDPOINT);
   
    
    return<table cellSpacing = {0} cellPadding = {0}><tbody>
            {board.map((row, indx) => {
                return<tr key = {indx}>
                    {row.map((cell, indx2) =>{
                        let classes = "";
                        if(style == "x") classes = returnBorders(indx, indx2, board.length);
                        return<td key = {indx2} className = {classes} onClick = {async () => {
                            if(cell.occupied || !isTurn) return;
                            let history = moveHistory;
                            history.push({row: indx, col: indx2});
                            console.log(moveHistory);
                            const updated = await updateMoveHistory(token, gameId, JSON.stringify(history));
                            if(updated.error) alert(updated.message);
                            else{
                                socket.emit('move', {game: gameId, history: history});
                            }
                        }}>
                            {style == "go"?<div className = "full"> 
                                <Cross rowNum = {indx} colNum = {indx2} rows = {board.length} cols = {row.length} />
                                {cell.occupied? <div className = {"circle full top shine " + cell.type}></div>:null}
                            </div>:<div className = "full">
                            {cell.occupied?<AddX type = {cell.type}/> :null}
                                </div>}
                        </td>
                    })}
                </tr>
            })}
        </tbody></table>
 
}

export {Table};