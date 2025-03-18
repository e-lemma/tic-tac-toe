const gameBoard = (function () {
  let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

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

  const addPiece = (coordinates, player) => {
    const [row, col] = coordMap[coordinates];

    if (player === 1) {
      board[row][col] = "o";
    } else if (player === 2) {
      board[row][col] = "x";
    } else throw new Error("Invalid player number");
  };

  const getBoard = () => {
    return board;
  };

  return { addPiece, getBoard };
})();

function createPlayer(playerName, playerNumber) {
  const playerNumber = playerNumber;
  const getPlayerNumber = () => playerNumber;
  return { playerName, getPlayerNumber };
}
