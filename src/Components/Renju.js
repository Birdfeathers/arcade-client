import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";
import { useParams } from 'react-router-dom';
import {getGame} from '../apiCalls/index';
import {Table} from './Table'

// function Cross({rowNum, colNum, rows, cols})
// {         let topLeft = "fourth", bottomLeft = "fourth", topRight = "fourth", bottomRight = "fourth";
//          if(rowNum != 0) topRight += " borderLeft";
//          if(colNum != 0) topLeft += " borderBottom";
//          if(rowNum != rows-1) bottomRight += " borderLeft";
//          if(colNum != cols -1) topRight += " borderBottom";
//           return<div className = "tan">
//           <div className = "half">
//             <div className = {topLeft}></div>
//             <div className = {topRight}></div>
//         </div>
//         <div className = "half">
//             <div className = {bottomLeft}></div>
//             <div className = {bottomRight}></div>
//         </div>
//         </div>

// }

// function X()
// {
//     return<div className = "full rotate45">
//                 <div className = "half">
//                     <div className = "fourth borderBottom"></div>
//                     <div className = "fourth borderLeft borderBottom"></div>
//                 </div>
//                 <div className = "half">
//                     <div className = "fourth"></div>
//                     <div className = "fourth borderLeft"></div>
//                 </div>
//             </div>
// }

// function AddX({type}){
//     return<div>
//         {type === "black"?  <X />: <div className = "circle most border"></div>}
//     </div>
// }

// function Edges({rowNum, colNum, rows, check})
// {
//     let classList = "";
//     if(rowNum != rows -1) classList += " borderBottom";
//     if(colNum != 0) classList += " borderLeft"
//     return <td className = {classList} > 
//         {check.occupied?<AddX type = {check.type}/> :null}
//     </td>
// }

// function Cell({style, rowNum, colNum, rows, cols, board, setMoveHistory, moveHistory, setRState, setRun})
// {
//     let check = board[rowNum][colNum];
//     return <>
//         {style === "go"? <td onClick = {() => {
//             console.log("clicked")
//             //setRun(false);
//             let history = moveHistory;
//             history.push({row: rowNum, col: colNum});
//             setMoveHistory(history);
//             setRState(Math.random());
//         }}>
//             <Cross rowNum = {rowNum} colNum = {colNum} rows = {rows} cols = {cols}/>
//             {check.occupied? <div className = {"circle full top shine " + check.type}></div>:null}
//             </td>
//         :
//     <Edges rowNum = {rowNum} colNum = {colNum} rows = {rows} check = {check}></Edges>}</>
// }
// function Row({cols, rows, style, rowNum, board, setMoveHistory, moveHistory, setTstate, setRun})
// {
//     let row = [];
//     const [rState, setRState] = useState("");
//     useEffect(() => {setTstate(Math.random())}, [rState])
//     for(let i = 0; i< cols; i++)
//     {
//         row.push(<Cell style = {style} key = {i} rowNum = {rowNum} colNum = {i} rows = {rows} cols = {cols} board = {board} setMoveHistory = {setMoveHistory} moveHistory = {moveHistory} setRState = {setRState} setRun = {setRun}/>)
//     }
//     return <tr>{row}</tr>
// }

// function Table({rows, cols, style, board, setMoveHistory, moveHistory, setAState, setRun})
// {
//     const [tState, setTstate] = useState("");
//     useEffect(() => {setAState(Math.random())}, [tState])
//     let table = [];
//     for(let i = 0; i< rows; i++)
//     {
//         table.push(<Row rows = {rows} cols = {cols} style = {style} rowNum = {i} board = {board} key = {i} setMoveHistory = {setMoveHistory} moveHistory = {moveHistory} setTstate = {setTstate} setRun = {setRun}/>)
//     }
//     return <table cellSpacing = {0} cellPadding = {0}><tbody>{table}</tbody></table>
// }

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
        arr1[move.row][move.col] = {occupied:true, type: turn}
    });
    return arr1;
}

function Renju({token})
{
    const {gameId} = useParams();
    const [game, setGame] = useState(null);
    const [moveHistory, setMoveHistory] = useState([]);
    const [style, setStyle] = useState("go");
    const [board, setBoard] = useState("");
    const [run, setRun] = useState(0);
    const [isCurrent, setIsCurrent] = useState(true);
    const [turnNum, setTurnNum] = useState(0);
    const [tempTurnNum, setTempTurnNum] = useState(0);
    const [turnPlayer, setTurnPlayer] = useState("");
    const [aState, setAState] = useState(1);

    useEffect(() => {console.log("aState", aState)}, [aState])
  
    useEffect(() => {
        const fetchData = async () => {
          console.log('useEffect for setting game running');
          if(!token) return;
          console.log(gameId)
          const game = await getGame(gameId);
          console.log(game)
          if(game){ 
            setGame(game);
            if(game.movehistory) {
                console.log(JSON.parse(game.movehistory))
                setMoveHistory(JSON.parse(game.movehistory))
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
        setRun(true);
        console.log("hishere", moveHistory)
         
     },[tempTurnNum, moveHistory])
    

    return<div>
       <h1>Renju</h1>
       <h3>Turn {tempTurnNum} {turnPlayer.color}'s({turnPlayer.username}'s) move</h3>
       {!isCurrent && tempTurnNum === turnNum? <h3>(Current Board)</h3>: !isCurrent? <h3>
        {turnNum - tempTurnNum} moves away from current Board.
       </h3>: null}
       <label>Board style: </label>
       <select value = {style} onChange = {(event) =>{setStyle(event.target.value)}}>
           <option value = "go"> Go Board </option>
           <option value = "x"> Tic-Tac-Toe </option>
       </select>
       <br />
       <label>View Past/ Future Board States</label>
       <input type = "checkbox" checked = {!isCurrent} onChange = {
           event => {setIsCurrent(!event.target.checked)
           setTempTurnNum(turnNum);
       }} />
       {isCurrent? null: <div> 
                <button name = "backbutton" disabled = {tempTurnNum == 1} onClick = {() => {setTempTurnNum(tempTurnNum -1)}}>&#x2190;</button>
                <button name = "forwardbutton" disabled = {tempTurnNum === turnNum} onClick = {() => {setTempTurnNum(tempTurnNum +1)}}>&#x2192;</button>
               </div>}
       {board && aState? <Table style = {style} board = {board} setMoveHistory = {setMoveHistory} moveHistory = {moveHistory} setTempTurnNum = {setTempTurnNum} setTurnNum = {setTurnNum}/>:null}
    </div>
}

export default Renju;