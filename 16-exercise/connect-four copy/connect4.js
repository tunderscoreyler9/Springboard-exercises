/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({ length: WIDTH }));
  }
};

// ***********************************************************

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board');

  // TODO: add comment for this code
  // create a <tr> element that will be the 'top' (where players insert their connect coin into the board-game)
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  // TODO: when a player clicks the 'top' area, call the handleClick function
  top.addEventListener("click", handleClick);

  // TODO: create the coin (a '<td>' element) that falls into the slot after the player has dropped their coin
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  // TODO: Make sure the coin element (<td>) appends to the HTML board.
  htmlBoard.append(top);

  // TODO: add comment for this code
  // Create the HTML table rows by creating <tr> elements. 
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    // Create the HTML cells (each element in each column) by using <td> elements
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      // Give each cell an organised ID attribute based on its position in the gride system, in order to be able to access it and call upon it later.
      cell.setAttribute("id", `${y}-${x}`);
      // Append the "cell" to the HTMLBoard
      row.append(cell);
    }
    // Finally, append each row to htmlBoard.
    htmlBoard.append(row);
  }
};

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: Fix this function so that it finds the lowest empty spot in the game board and returns the y coordinate (or null if the column is filled).
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);

  // Now, add a spot where the coin will be dropped.
  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);

}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board (meaning, the player #)
  // this will assign each currPlayer to each dropped coin
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie!');
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  // This outer for loop checks the rows
  for (let y = 0; y < HEIGHT; y++) {
    // this inner for loop checks the inner columns
    for (let x = 0; x < WIDTH; x++) {
      // Here, we increment (by 1) in each direction (horiz, vert, etc.) to check if _win() func returns true. If so, then we will return 'true' at the very end. 
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();