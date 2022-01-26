import React, { useState, useEffect } from "react";

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



function Table({style, board, setMoveHistory, moveHistory, setTempTurnNum, setTurnNum})
{
    
    return<table cellSpacing = {0} cellPadding = {0}><tbody>
            {board.map((row, indx) => {
                return<tr key = {indx}>
                    {row.map((cell, indx2) =>{
                        let classes = "";
                        if(style == "x") classes = returnBorders(indx, indx2, board.length);
                        return<td key = {indx2} className = {classes} onClick = {() => {
                            if(cell.occupied) return;
                            let history = moveHistory;
                            history.push({row: indx, col: indx2})
                            console.log(moveHistory);
                            setMoveHistory(history);
                            setTempTurnNum(history.length + 1);
                            setTurnNum(history.length + 1)
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