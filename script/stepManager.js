import { gameState, saveGameState, loadGameState } from './storage.js';
import { initializeGame, handleCellClick } from './game.js';
import { updateGameDisplay, createBoard } from './ui.js';

export function showStep(stepNumber) {
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById(`step-${stepNumber}`).classList.add('active');
    gameState.currentStep = stepNumber;
    saveGameState();
}

export function nextStep(currentStepNumber) {
    if (validateStep(currentStepNumber)) {
        if (currentStepNumber === 3) initializeGame();
        showStep(currentStepNumber + 1);
    }
}

 function validateStep(stepNumber) {
    switch(stepNumber) {
        case 1:
            const player1Name = document.getElementById('player1-name').value.trim();
            if (!player1Name) {
                document.getElementById('error1').textContent = 'Veuillez entrer le nom du joueur 1';
                document.getElementById('error1').style.display = 'block';
                return false;
            }
            gameState.player1.name = player1Name;
            gameState.player1.symbol = document.querySelector('#player1-symbols .symbol-option.selected').dataset.symbol;
            updatePlayer2Symbols();
            saveGameState();
            return true;

        case 2:
            const player2Name = document.getElementById('player2-name').value.trim();
            if (!player2Name) {
                document.getElementById('error2').textContent = 'Veuillez entrer le nom du joueur 2';
                document.getElementById('error2').style.display = 'block';
                return false;
            }
            if (player2Name === gameState.player1.name) {
                document.getElementById('error2').textContent = 'Les noms des joueurs doivent être différents';
                document.getElementById('error2').style.display = 'block';
                return false;
            }
            gameState.player2.name = player2Name;
            gameState.player2.symbol = document.querySelector('#player2-symbols .symbol-option.selected').dataset.symbol;
            saveGameState();
            return true;

        case 3:
            gameState.gridSize = parseInt(document.getElementById('grid-size').value);
            gameState.winCondition = parseInt(document.getElementById('win-condition').value);
            gameState.matchCount = parseInt(document.getElementById('match-count').value);
            
            if (gameState.winCondition > gameState.gridSize) {
                alert('Le nombre d\'alignements ne peut pas être supérieur à la taille de la grille');
                return false;
            }
            saveGameState();
            return true;

        default:
            return true;
    }
    
}
 function updatePlayer2Symbols() {
    const player1Symbol = gameState.player1.symbol;
    const player2Selector = document.getElementById('player2-symbols');
    
    player2Selector.querySelectorAll('.symbol-option').forEach(option => {
        option.style.display = 'flex';
    });

    const player1Option = player2Selector.querySelector(`[data-symbol="${player1Symbol}"]`);
    if (player1Option) {
        player1Option.style.display = 'none';
        if (player1Option.classList.contains('selected')) {
            player1Option.classList.remove('selected');
            const firstAvailable = player2Selector.querySelector('.symbol-option:not([style*="none"])');
            if (firstAvailable) {
                firstAvailable.classList.add('selected');
            }
        }
    }
}



document.querySelectorAll('#player1-symbols .symbol-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('#player1-symbols .symbol-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
    });
});
document.querySelectorAll('#player2-symbols .symbol-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('#player2-symbols .symbol-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
    });
});


document.getElementById('start-btn').addEventListener('click', () => nextStep(0));
document.getElementById('next-1').addEventListener('click', () => nextStep(1));
document.getElementById('next-2').addEventListener('click', () => nextStep(2));
document.getElementById('start-game').addEventListener('click', () => nextStep(3));



window.addEventListener('DOMContentLoaded', () => {
    loadGameState();    
    createBoard();   
    updateGameDisplay();  
    showStep(gameState.currentStep); 
});