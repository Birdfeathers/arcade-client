import React, { useState, useEffect } from "react";
import {updateMoveHistory} from '../apiCalls/index';
import { useParams } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import { BaseUrl as ENDPOINT } from "../constants";
import {getGame, getWinLines} from '../apiCalls/index';

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

function Line({direction})
{
    let classes = "top full";
    if(direction == "vertical") classes += " rotate90";
    if(direction == "positive") classes += " rotate135 bigger";
    if(direction == "negative") classes += " rotate45 bigger";

    return<div className = {classes}>
        <div className = "half borderBottom redBorder"></div>
        <div className = "half"></div>
    </div>
    
}

function X({future})
{
    let classes = "full rotate45";
    if(future) classes += " translucent"
    return<div className = {classes}>
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

function AddX({color, future}){
    let classes = "circle most border";
    if(future) classes += " translucent"
    return<div>
        {color === "black"?  <X future = {future}/>: <div className = {classes}></div>}
    </div>
}


function returnBorders(rowNum, colNum, rows)
{
    let classList = "";
    if(rowNum != rows -1) classList += " borderBottom";
    if(colNum != 0) classList += " borderLeft"
    return classList;
}



function isInWin(lineBoard, winLines, row, col)
{
    if(lineBoard.length == 0) return [];
    const cell = lineBoard[row][col];
    winLines = winLines.map(line => line.lineNum)
    const returnValue = [];
    if(winLines.includes(cell.horizontal)) returnValue.push("horizontal");
    if(winLines.includes(cell.vertical)) returnValue.push("vertical");
    if(winLines.includes(cell.positive)) returnValue.push("positive");
    if(winLines.includes(cell.negative)) returnValue.push("negative");
    return returnValue;
}


function Table({token,
                style, 
                moveHistory, 
                isTurn,  
                socket, 
                game, 
                winLines, 
                lineBoard, 
                isCurrent,
                future, 
                futureMoves,
                setFutureMoves,
                tempTurnNum, 
                setTurnPlayer, 
                setUsedHistory,
                futureTurnNum,
                setFutureTurnNum
            })
{
    const {gameId} = useParams();
 
    return<table cellSpacing = {0} cellPadding = {0}><tbody>
            {lineBoard.map((row, indx) => {
                return<tr key = {indx}>
                    {row.map((cell, indx2) =>{
                        let classes = "";
                        let circleClasses = "circle full top shine " + cell.color;
                        if(cell.future) circleClasses += " translucent";
                        if(style == "x") classes = returnBorders(indx, indx2, lineBoard.length);
                        const inWin = isInWin(lineBoard, winLines, indx, indx2);
                        if(style == "go" && inWin.length != 0) circleClasses += " winBorder"
                        return<td key = {indx2} className = {classes} onClick = {async () => {
                            if(cell.occupied) return;
                            if(future)
                            {
                                let fm = futureMoves.slice(0, futureTurnNum);
                                fm.push({row: indx, col: indx2, future: true});
                                setFutureMoves(fm);
                                setUsedHistory(moveHistory.slice(0, tempTurnNum -1).concat(fm));
                                setFutureTurnNum(fm.length);
                                let turn;
                                if((tempTurnNum + fm.length) % 2) turn = "Black"
                                else turn = "White"
                                setTurnPlayer({color: turn, username: turn});
                                
                            } else {
                                if(!isTurn|| !isCurrent) return;
                                cell.occupied = true;
                                if(moveHistory.length % 2) cell.color = "black";
                                else cell.color = "white";
                                let history = moveHistory;
                                history.push({row: indx, col: indx2});
                                const updated = await updateMoveHistory(token, history, game);
                                if(updated.error) {
                                    cell.occupied = false;
                                    cell.color = "none";
                                    alert(updated.message);
                                }
                                else{
                                    socket.emit('move', {game: gameId, history: history, winLines: updated.winLines, board: updated.board});
                                }
                            }
                        }}>
                            {style == "go"?<div className = "full"> 
                                <Cross rowNum = {indx} colNum = {indx2} rows = {lineBoard.length} cols = {row.length} />
                                {cell.occupied? <div className = {circleClasses}></div>:null}
                            </div>:<div className = "full">
                            {cell.occupied?<AddX color = {cell.color} future = {cell.future}/> :null}
                            {inWin.includes("horizontal")? <Line direction = "horizontal" />:null}
                            {inWin.includes("vertical")? <Line direction = "vertical" />:null}
                            {inWin.includes("positive")? <Line direction = "positive" />:null}
                            {inWin.includes("negative")? <Line direction = "negative" />:null}
                                </div>}
                        </td>
                    })}
                </tr>
            })}
        </tbody></table>
 
}

export {Table};