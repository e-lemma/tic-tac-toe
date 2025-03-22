const gameBoard = (function () {
  const boardSize = 3;
  const board = [];

  function createBoard() {
    for (let i = 0; i < boardSize; i++) {
      board[i] = [];
      for (let j = 0; j < boardSize; j++) {
        board[i].push(square());
      }
    }
  }
  createBoard();

  const addMarkToBoard = (coordinates, player) => {
    const [row, col] = coordinates;

    if (board[row][col].getValue() !== 0) {
      console.warn("occupied square picked. nothing happened");
      return;
    }

    board[row][col].markSquare(player.getPlayerNumber());
  };

  const getBoard = () => board;

  const resetBoard = () => {
    board.length = 0;
    console.log(board);
    createBoard();
  };

  const getBoardWithValues = () =>
    board.map((row) => row.map((cell) => cell.getValue()));

  const printBoard = () => {
    const processedBoard = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.table(processedBoard);
  };

  return {
    boardSize,
    addMarkToBoard,
    getBoard,
    getBoardWithValues,
    printBoard,
    resetBoard,
  };
})();

function createPlayer(initialName, playerNumber) {
  let playerName = initialName;
  const getPlayerNumber = () => playerNumber;
  const setPlayerName = (name) => {
    playerName = name;
  };
  const getPlayerName = () => playerName;

  return { getPlayerNumber, setPlayerName, getPlayerName };
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
    const board = gameBoard.getBoardWithValues();

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
    console.log(`${getActivePlayer().getPlayerName()}'s turn! ↓`);
  };

  const printWinMessage = () =>
    console.log(`${activePlayer.getPlayerName()} Wins!`);

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
    checkForWinner,
    players,
  };
})();

const screenController = (function () {
  const titleText = "Tic-Tac-Toe";
  const resetButtonText = "Reset Game";
  const startButtonColor = "rgb(94, 188, 94)";
  const startButtonText = "Start Game";
  const resetButtonColor = "rgb(199, 102, 91)";

  const dynamicTextDiv = document.querySelector("#dynamic-text");
  const gameBoardDiv = document.querySelector(".game-board");

  function renderSquares() {
    gameBoardDiv.innerHTML = ""; // Clear old buttons

    const board = gameBoard.getBoard();
    board.forEach((row, rowIndex) => {
      row.forEach((_square, columnIndex) => {
        const squareButton = document.createElement("button");
        squareButton.classList.add("square");
        squareButton.dataset.row = rowIndex;
        squareButton.dataset.column = columnIndex;
        gameBoardDiv.appendChild(squareButton);

        squareButton.addEventListener("click", () => {
          const row = Number(squareButton.dataset.row);
          const col = Number(squareButton.dataset.column);

          const currentValue = gameBoard.getBoardWithValues()[row][col];
          if (currentValue !== 0) return; // prevent double marking

          const activePlayerNum = gameController
            .getActivePlayer()
            .getPlayerNumber();
          squareButton.textContent = activePlayerNum === 1 ? "○" : "X";

          gameController.playTurn([row, col]);

          const winner = gameController.checkForWinner();
          if (winner === activePlayerNum) {
            displayWinMessage();
          } else if (winner === "draw") {
            displayDrawMessage();
          } else {
            displayTurn();
          }
        });
      });
    });
  }

  const squareButtons = document.querySelectorAll(".square");
  const startResetButton = document.querySelector(".start-reset");

  // setup form
  const form = document.querySelector("form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    gameController.players[0].setPlayerName(formData.get("playerOneName"));
    gameController.players[1].setPlayerName(formData.get("playerTwoName"));

    form.reset();

    if (startResetButton.textContent === startButtonText) {
      startResetButton.click();
    }
  });

  const resetDynamicText = () => {
    dynamicTextDiv.classList.remove("dynamicText");
    dynamicTextDiv.classList.add("title");
    dynamicTextDiv.textContent = titleText;
  };

  const updateDynamicText = (newText) => {
    dynamicTextDiv.textContent = newText;
  };

  const displayTurn = () => {
    updateDynamicText(
      `${gameController.getActivePlayer().getPlayerName()}'s turn!`
    );
  };

  const displayWinMessage = () =>
    updateDynamicText(
      `${gameController.getActivePlayer().getPlayerName()} Wins!`
    );

  const displayDrawMessage = () => updateDynamicText(`It's a draw!`);

  (setupStartResetButton = () => {
    const startResetButton = document.querySelector(".start-reset");

    startResetButton.addEventListener("click", (event) => {
      event.preventDefault();

      if (startResetButton.textContent == startButtonText) {
        startResetButton.textContent = resetButtonText;
        startResetButton.style.backgroundColor = resetButtonColor;
        startGame();
      } else {
        startResetButton.textContent = startButtonText;
        startResetButton.style.backgroundColor = startButtonColor;
        resetGame();
      }
    });
  })();

  const startGame = () => {
    gameBoardDiv.style.backgroundColor = "white";
    renderSquares(); // render and bind fresh squares
    displayTurn();
  };

  const resetGame = () => {
    gameBoardDiv.style.backgroundColor = "salmon";
    gameBoard.resetBoard(); // clear board state
    gameBoardDiv.innerHTML = ""; // clear buttons from DOM
    resetDynamicText();
  };

  return { updateDynamicText, resetDynamicText };
})();
