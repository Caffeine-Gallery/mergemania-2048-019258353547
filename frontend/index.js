import { backend } from 'declarations/backend';

const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('bestScore');
const newGameButton = document.getElementById('new-game');

let board = [];
let score = 0;
let bestScore = 0;

function initializeGame() {
    board = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    addNewTile();
    addNewTile();
    updateBoard();
    updateScore();
}

function addNewTile() {
    const emptyTiles = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                emptyTiles.push({ row: i, col: j });
            }
        }
    }
    if (emptyTiles.length > 0) {
        const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const tile = document.createElement('div');
            tile.className = `tile tile-${board[i][j]}`;
            tile.textContent = board[i][j] || '';
            gameBoard.appendChild(tile);
        }
    }
}

function updateScore() {
    scoreElement.textContent = score;
    if (score > bestScore) {
        bestScore = score;
        bestScoreElement.textContent = bestScore;
        backend.updateBestScore(bestScore);
    }
}

function move(direction) {
    console.log(`Moving ${direction}`);
    let moved = false;
    const newBoard = JSON.parse(JSON.stringify(board));

    function pushLeft(row) {
        const filtered = row.filter(cell => cell !== 0);
        for (let i = 0; i < filtered.length - 1; i++) {
            if (filtered[i] === filtered[i + 1]) {
                filtered[i] *= 2;
                score += filtered[i];
                filtered[i + 1] = 0;
                moved = true;
            }
        }
        return filtered.filter(cell => cell !== 0).concat(Array(4 - filtered.length).fill(0));
    }

    if (direction === 'left') {
        for (let i = 0; i < 4; i++) {
            newBoard[i] = pushLeft(newBoard[i]);
        }
    } else if (direction === 'right') {
        for (let i = 0; i < 4; i++) {
            newBoard[i] = pushLeft(newBoard[i].reverse()).reverse();
        }
    } else if (direction === 'up') {
        for (let j = 0; j < 4; j++) {
            const column = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
            const newColumn = pushLeft(column);
            for (let i = 0; i < 4; i++) {
                newBoard[i][j] = newColumn[i];
            }
        }
    } else if (direction === 'down') {
        for (let j = 0; j < 4; j++) {
            const column = [newBoard[3][j], newBoard[2][j], newBoard[1][j], newBoard[0][j]];
            const newColumn = pushLeft(column);
            for (let i = 0; i < 4; i++) {
                newBoard[3 - i][j] = newColumn[i];
            }
        }
    }

    if (moved) {
        board = newBoard;
        addNewTile();
        updateBoard();
        updateScore();
        checkGameOver();
    } else {
        console.log('No move made');
    }
}

function checkGameOver() {
    let hasEmptyCell = false;
    let canMerge = false;

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 2048) {
                alert('Congratulations! You reached 2048! You can continue playing for a higher score.');
            }
            if (board[i][j] === 0) {
                hasEmptyCell = true;
            }
            if (i < 3 && board[i][j] === board[i + 1][j]) {
                canMerge = true;
            }
            if (j < 3 && board[i][j] === board[i][j + 1]) {
                canMerge = true;
            }
        }
    }

    if (!hasEmptyCell && !canMerge) {
        alert('Game over! No more moves available.');
    }
}

function handleKeyPress(event) {
    console.log('Key pressed:', event.key);
    if (event.key === 'ArrowLeft') {
        move('left');
    } else if (event.key === 'ArrowRight') {
        move('right');
    } else if (event.key === 'ArrowUp') {
        move('up');
    } else if (event.key === 'ArrowDown') {
        move('down');
    }
}

document.addEventListener('keydown', handleKeyPress);

newGameButton.addEventListener('click', initializeGame);

async function fetchBestScore() {
    bestScore = await backend.getBestScore();
    bestScoreElement.textContent = bestScore;
}

fetchBestScore();
initializeGame();
