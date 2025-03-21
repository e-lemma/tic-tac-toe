const gameBoard = (function () {
  const boardSize = 3;
  const board = [];

  (function createBoard() {
    for (let i = 0; i < boardSize; i++) {
      board[i] = [];
      for (let j = 0; j < boardSize; j++) {
        board[i].push(square());
      }
    }
  })();

  const coordMap = {
    a1: [2, 0],
    a2: [1, 0],
    a3: [0, 0],
    b1: [2, 1],
    b2: [1, 1],
    b3: [0, 1],
    c1: [2, 2],
    c2: [1, 2],
    c3: [0, 2],
  };

  const addMarkToBoard = (coordinates, player) => {
    const [row, col] = coordMap[coordinates];

    if (board[row][col].getValue() !== 0) {
      console.warn("occupied square picked. nothing happened");
      return;
    }

    board[row][col].markSquare(player.getPlayerNumber());
  };

  const getBoard = () => board.map((row) => row.map((cell) => cell.getValue()));

  const printBoard = () => {
    const processedBoard = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.table(processedBoard);
  };

  return { boardSize, addMarkToBoard, getBoard, printBoard };
})();

function createPlayer(playerName, playerNumber) {
  const getPlayerNumber = () => playerNumber;
  return { playerName, getPlayerNumber };
}

function square() {
  let value = 0;

  const markSquare = (playerNumber) => {
    value = playerNumber;
  };

  const getValue = () => value;

  return { markSquare, getValue };
}

const gameController = (function (
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const players = [
    createPlayer(playerOneName, 1),
    createPlayer(playerTwoName, 2),
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const checkForWinner = () => {
    const size = gameBoard.boardSize;
    const board = gameBoard.getBoard();

    // Check rows
    for (let row = 0; row < size; row++) {
      if (
        board[row][0] &&
        board[row][0] === board[row][1] &&
        board[row][0] === board[row][2]
      ) {
        return board[row][0];
      }
    }

    // Check columns
    for (let col = 0; col < size; col++) {
      if (
        board[0][col] &&
        board[0][col] === board[1][col] &&
        board[0][col] === board[2][col]
      ) {
        return board[0][col];
      }
    }

    // Check diagonals
    if (
      board[0][0] &&
      board[0][0] === board[1][1] &&
      board[0][0] === board[2][2]
    ) {
      return board[0][0];
    }

    if (
      board[0][2] &&
      board[0][2] === board[1][1] &&
      board[0][2] === board[2][0]
    ) {
      return board[0][2];
    }

    let isDraw = true;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!board[row][col]) {
          isDraw = false;
          break;
        }
      }
    }
    if (isDraw) {
      return "draw";
    }
    return;
  };

  const printTurn = () => {
    gameBoard.printBoard();
    console.log(`${getActivePlayer().playerName}'s turn! ↓`);
  };

  const printWinMessage = () => console.log(`${activePlayer.playerName} Wins!`);

  const playTurn = (coords) => {
    gameBoard.addMarkToBoard(coords, getActivePlayer());
    if (checkForWinner() === activePlayer.getPlayerNumber()) {
      gameBoard.printBoard();

      printWinMessage();
      return;
    }
    switchActivePlayer();
    printTurn();
  };

  return {
    getActivePlayer,
    switchActivePlayer,
    printTurn,
    playTurn,
    printWinMessage,
  };
})();

const screenController = (function () {
  const startResetButton = document.querySelector(".start-reset");
  const dynamicText = document.querySelector("#dynamic-text");
  const gameBoard = document.querySelector(".game-board");

  const updateScreen = () => {};
  const clickHandlerBoard = () => {};
})();
