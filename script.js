const statusDisplay = document.querySelector('.game-status');
const cells = document.querySelectorAll('.cell');
const restartButton = document.querySelector('.game-restart');

let gameActive = true;
let currentPlayer = "X";
let gameState = Array(9).fill("");

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    for (const condition of winningConditions) {
        const [a, b, c] = condition.map(index => gameState[index]);
        if (a !== '' && a === b && b === c) {
            statusDisplay.innerHTML = winningMessage();
            gameActive = false;
            return;
        }
    }

    const roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive)
        return;

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState.fill("");
    statusDisplay.innerHTML = currentPlayerTurn();
    cells.forEach(cell => cell.innerHTML = "");
    cells.forEach(cell => cell.removeAttribute('disabled'));
}

function handleGameOver() {
    cells.forEach(cell => cell.setAttribute('disabled', true));
    restartButton.style.display = "block";
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game-restart').addEventListener('click', handleRestartGame);
handleGameOver();

const checkGameOver = () => {
    if (!gameActive) {
        handleGameOver();
    }
};

checkGameOver();