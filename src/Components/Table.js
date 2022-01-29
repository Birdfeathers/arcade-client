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

function Line({type})
{
    let classes = "top full";
    if(type == "vertical") classes += " rotate90";
    if(type == "positive") classes += " rotate135 bigger";
    if(type == "negative") classes += " rotate45 bigger";

    return<div className = {classes}>
        <div className = "half borderBottom redBorder"></div>
        <div className = "half"></div>
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


function Table({token, style, board, moveHistory, isTurn, setMoveHistory, setTempTurnNum, setTurnNum, socket, game, setWinLines, winLines, lineBoard, setLineBoard})
{
    const {gameId} = useParams();
    console.log(lineBoard);
 
    return<table cellSpacing = {0} cellPadding = {0}><tbody>
            {board.map((row, indx) => {
                return<tr key = {indx}>
                    {row.map((cell, indx2) =>{
                        let classes = "";
                        let circleClasses = "circle full top shine " + cell.type;
                        if(style == "x") classes = returnBorders(indx, indx2, board.length);
                        const inWin = isInWin(lineBoard, winLines, indx, indx2);
                        if(style == "go" && inWin.length != 0) circleClasses += " winBorder"
                        return<td key = {indx2} className = {classes} onClick = {async () => {
                            if(cell.occupied || !isTurn) return;
                            let history = moveHistory;
                            history.push({row: indx, col: indx2});
                            console.log("moveHistory", moveHistory, "board", board);
                            const updated = await updateMoveHistory(token, gameId, history, game);
                            if(updated.error) alert(updated.message);
                            else{
                                console.log(updated);
                                socket.emit('move', {game: gameId, history: history});
                                setMoveHistory(history);
                                setTurnNum(history.length + 1);
                                setTempTurnNum(history.length + 1);
                                setWinLines(updated.winLines);
                                setLineBoard(updated.board);
                            }
                        }}>
                            {style == "go"?<div className = "full"> 
                                <Cross rowNum = {indx} colNum = {indx2} rows = {board.length} cols = {row.length} />
                                {cell.occupied? <div className = {circleClasses}></div>:null}
                            </div>:<div className = "full">
                            {cell.occupied?<AddX type = {cell.type}/> :null}
                            {inWin.includes("horizontal")? <Line type = "horizontal" />:null}
                            {inWin.includes("vertical")? <Line type = "vertical" />:null}
                            {inWin.includes("positive")? <Line type = "positive" />:null}
                            {inWin.includes("negative")? <Line type = "negative" />:null}
                                </div>}
                        </td>
                    })}
                </tr>
            })}
        </tbody></table>
 
}

export {Table};