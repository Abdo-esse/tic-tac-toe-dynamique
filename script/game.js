import { gameState, saveGameState } from './storage.js';
import { updateGameDisplay, createBoard } from './ui.js';

export function initializeGame() {
    gameState.board = Array(gameState.gridSize * gameState.gridSize).fill('');
    gameState.currentPlayer = 1;
    gameState.currentMatch = 1;
    gameState.scores = { player1: 0, player2: 0 };
    gameState.gameActive = true;

    updateGameDisplay();
    createBoard();
    saveGameState();
}

export function handleCellClick(index) {
    if (!gameState.gameActive || gameState.board[index] !== '') return;

    const currentPlayerData = gameState.currentPlayer === 1 ? gameState.player1 : gameState.player2;
    gameState.board[index] = currentPlayerData.symbol;

    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = currentPlayerData.symbol;
    cell.classList.add('taken');

    if (gameState.board.every(cell => cell !== '')) {
        handleDraw();
    } else {
        switchPlayer();
    }
    saveGameState();
}

function handleDraw() {
    gameState.gameActive = false;
    saveGameState();
}

function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
    document.getElementById('player1-status').classList.toggle('active');
    document.getElementById('player1-status').classList.toggle('inactive');
    document.getElementById('player2-status').classList.toggle('active');
    document.getElementById('player2-status').classList.toggle('inactive');
    saveGameState();
}
