const gameBoard = (function () {
  const rows = 3;
  const columns = 3;
  const board = [];

  (function createBoard() {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
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

  const getBoard = () => board;

  const printBoard = () => {
    const processedBoard = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.table(processedBoard);
  };

  return { addMarkToBoard, getBoard, printBoard };
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

  const printTurn = () => {
    gameBoard.printBoard();
    console.log(`${getActivePlayer().playerName}'s turn! ↓`);
  };

  const playTurn = (coords) => {
    gameBoard.addMarkToBoard(coords, getActivePlayer());
    switchActivePlayer();
    printTurn();
  };

  return { getActivePlayer, switchActivePlayer, printTurn, playTurn };
})();

gameController.printTurn();
gameController.playTurn("a3");
gameController.playTurn("a1");
gameController.playTurn("a2");
gameController.playTurn("a2");
