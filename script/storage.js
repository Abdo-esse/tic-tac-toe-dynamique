export let gameState = {
    currentStep: 0,
    player1: { name: 'Joueur 1', symbol: 'X' },
    player2: { name: 'Joueur 2', symbol: 'O' },
    gridSize: 3,
    winCondition: 3,
    matchCount: 1,
    currentMatch: 1,
    scores: { player1: 0, player2: 0 },
    currentPlayer: 1,
    board: [],
    gameActive: false
};

export function saveGameState() {
    localStorage.setItem("ticTacToeGame", JSON.stringify(gameState));
}

export function loadGameState() {
    const savedState = localStorage.getItem("ticTacToeGame");
    if (savedState) {
        gameState = JSON.parse(savedState);
    }
}
