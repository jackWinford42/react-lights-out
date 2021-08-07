import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard(nrows, ncols));

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard(nrows, ncols) {
    let initialBoard = [];
    // TODO: create array-of-arrays of true/false values
    for(let i = 0; i < nrows; i++) {
      initialBoard.push([])
      for (let j = 0; j < ncols; j++) {
        const randomNumber = Math.random();
        if (randomNumber > chanceLightStartsOn) initialBoard[i].push('.');  
        else initialBoard[i].push('O');
      }
    }
    return initialBoard;
  }

  function hasWon() {
    // TODO: check the board in state to determine whether the player has won.
    let won = true;
    for(let i = 0; i < nrows; i++) {
      for (let j = 0; j < ncols; j++) {
        if (tableBoard[i].props.children[j].props["isLit"]) won = false;
      }
    }
    return won
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x]=(boardCopy[y][x]==='O') ? '.' : 'O'
        }
      };
      let copyBoard = oldBoard.map(row => [...row]);

      flipCell(y, x, copyBoard);
      flipCell(y, x + 1, copyBoard);
      flipCell(y, x - 1, copyBoard);
      flipCell(y + 1, x, copyBoard);
      flipCell(y - 1, x, copyBoard);

      return copyBoard;
    });
  }

  // if the game is won, just show a winning msg & render nothing else

  let tableBoard = []

  // make table board
  for (let i = 0; i < board.length; i++) {
    let tableRow = [];
    for (let j = 0; j < board[0].length; j++) {
      const coordinate = `${i}-${j}`;
      tableRow.push(<Cell 
                      key={coordinate}
                      flipCellsAroundMe={() => flipCellsAround(coordinate)} 
                      isLit={(board[i][j]==='O') ? true : false}
                    />)
    }
    tableBoard.push(<tr key={i}>{tableRow}</tr>)
  }

  if (hasWon()) return (<h2>Congratulations! You Won the Game!</h2>);
  return (
    <div className="Board">
      <table>
        <tbody>
          {tableBoard}
        </tbody>
      </table>
    </div>
  );
}

export default Board;