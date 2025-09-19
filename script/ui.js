import { gameState, saveGameState } from './storage.js';
import { handleCellClick } from './game.js';
export function updateGameDisplay() {
    document.getElementById('player1-display').textContent = gameState.player1.name;
    document.getElementById('player1-symbol-display').textContent = gameState.player1.symbol;
    document.getElementById('player2-display').textContent = gameState.player2.name;
    document.getElementById('player2-symbol-display').textContent = gameState.player2.symbol;

    document.getElementById('total-matches').textContent = gameState.matchCount;
    document.getElementById('current-match').textContent = gameState.currentMatch;
    saveGameState();
}

export function createBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    board.className = `grid-${gameState.gridSize}x${gameState.gridSize}`;
    
    handleResize(board);
    board.style.gridTemplateColumns = `repeat(${gameState.gridSize}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${gameState.gridSize}, 1fr)`;

    for (let i = 0; i < gameState.gridSize * gameState.gridSize; i++) {
        const cell = document.createElement('button');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.textContent = gameState.board[i];
        cell.addEventListener('click', () => handleCellClick(i));
        board.appendChild(cell);
    }
}

function handleResize(board) {
    switch (gameState.gridSize) {
        case 3: board.style.width = '300px'; board.style.height = '300px'; break;
        case 4: board.style.width = '400px'; board.style.height = '400px'; break;
        default: board.style.width = '500px'; board.style.height = '520px';
    }
}
