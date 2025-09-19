        // Variables globales du jeu
        let gameState = {
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

        // Navigation entre étapes
        function showStep(stepNumber) {
            document.querySelectorAll('.step').forEach(step => {
                step.classList.remove('active');
            });
            document.getElementById(`step-${stepNumber}`).classList.add('active');
            gameState.currentStep = stepNumber;
        }

        function nextStep(currentStepNumber) {
            if (validateStep(currentStepNumber)) {
                if (currentStepNumber === 3) {
                    initializeGame();
                }
                showStep(currentStepNumber + 1);
            }
        }

        function validateStep(stepNumber) {
            switch(stepNumber) {
                case 1:
                    const player1Name = document.getElementById('player1-name').value.trim();
                    if (!player1Name) {
                        alert('Veuillez entrer le nom du joueur 1');
                        return false;
                    }
                    gameState.player1.name = player1Name;
                    gameState.player1.symbol = document.querySelector('#player1-symbols .symbol-option.selected').dataset.symbol;
                    updatePlayer2Symbols();
                    return true;

                case 2:
                    const player2Name = document.getElementById('player2-name').value.trim();
                    if (!player2Name) {
                        alert('Veuillez entrer le nom du joueur 2');
                        return false;
                    }
                    if (player2Name === gameState.player1.name) {
                        alert('Les noms des joueurs doivent être différents');
                        return false;
                    }
                    gameState.player2.name = player2Name;
                    gameState.player2.symbol = document.querySelector('#player2-symbols .symbol-option.selected').dataset.symbol;
                    return true;

                case 3:
                    gameState.gridSize = parseInt(document.getElementById('grid-size').value);
                    gameState.winCondition = parseInt(document.getElementById('win-condition').value);
                    gameState.matchCount = parseInt(document.getElementById('match-count').value);
                    
                    if (gameState.winCondition > gameState.gridSize) {
                        alert('Le nombre d\'alignements ne peut pas être supérieur à la taille de la grille');
                        return false;
                    }
                    return true;

                default:
                    return true;
            }
        }

        function updatePlayer2Symbols() {
            const player1Symbol = gameState.player1.symbol;
            const player2Selector = document.getElementById('player2-symbols');
            
            // Réactiver tous les symboles
            player2Selector.querySelectorAll('.symbol-option').forEach(option => {
                option.style.display = 'flex';
            });

            // Masquer le symbole du joueur 1
            const player1Option = player2Selector.querySelector(`[data-symbol="${player1Symbol}"]`);
            if (player1Option) {
                player1Option.style.display = 'none';
                if (player1Option.classList.contains('selected')) {
                    player1Option.classList.remove('selected');
                    // Sélectionner le premier symbole disponible
                    const firstAvailable = player2Selector.querySelector('.symbol-option:not([style*="none"])');
                    if (firstAvailable) {
                        firstAvailable.classList.add('selected');
                    }
                }
            }
        }

        // Initialisation du jeu
        function initializeGame() {
            gameState.board = Array(gameState.gridSize * gameState.gridSize).fill('');
            gameState.currentPlayer = 1;
            gameState.currentMatch = 1;
            gameState.scores = { player1: 0, player2: 0 };
            gameState.gameActive = true;

            updateGameDisplay();
            createBoard();
        }

        function createBoard() {
            const board = document.getElementById('board');
            board.innerHTML = '';
            board.className = `grid-${gameState.gridSize}x${gameState.gridSize}`;
            
            // Ajuster la taille du board selon la grille
            const boardSize = Math.min(300, window.innerWidth * 0.8);
            board.style.width = boardSize + 'px';
            board.style.height = boardSize + 'px';

            for (let i = 0; i < gameState.gridSize * gameState.gridSize; i++) {
                const cell = document.createElement('button');
                cell.className = 'cell';
                cell.dataset.index = i;
                cell.addEventListener('click', () => handleCellClick(i));
                board.appendChild(cell);
            }
        }

        function handleCellClick(index) {
            if (!gameState.gameActive || gameState.board[index] !== '') {
                return;
            }

            const currentPlayerData = gameState.currentPlayer === 1 ? gameState.player1 : gameState.player2;
            gameState.board[index] = currentPlayerData.symbol;

            const cell = document.querySelector(`[data-index="${index}"]`);
            cell.textContent = currentPlayerData.symbol;
            cell.classList.add('taken');

            if (checkWinner()) {
                handleWin();
            } else if (gameState.board.every(cell => cell !== '')) {
                handleDraw();
            } else {
                switchPlayer();
            }
        }

        function checkWinner() {
            const size = gameState.gridSize;
            const win = gameState.winCondition;
            const board = gameState.board;
            const currentSymbol = gameState.currentPlayer === 1 ? gameState.player1.symbol : gameState.player2.symbol;

            // Vérifier lignes, colonnes et diagonales
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    if (board[row * size + col] === currentSymbol) {
                        // Vérifier horizontale
                        if (col <= size - win) {
                            let count = 0;
                            for (let i = 0; i < win; i++) {
                                if (board[row * size + col + i] === currentSymbol) count++;
                            }
                            if (count === win) return { type: 'horizontal', start: row * size + col, direction: 1 };
                        }

                        // Vérifier verticale
                        if (row <= size - win) {
                            let count = 0;
                            for (let i = 0; i < win; i++) {
                                if (board[(row + i) * size + col] === currentSymbol) count++;
                            }
                            if (count === win) return { type: 'vertical', start: row * size + col, direction:1 };
                        }

                        // Vérifier diagonale descendante
                        if (row <= size - win && col <= size - win) {
                            let count = 0;
                            for (let i = 0; i < win; i++) {
                                if (board[(row + i) * size + col + i] === currentSymbol) count++;
                            }
                            if (count === win) return { type: 'diagonal-down', start: row * size + col, direction: 1 };
                        }

                        // Vérifier diagonale ascendante
                        if (row >= win - 1 && col <= size - win) {
                            let count = 0;
                            for (let i = 0; i < win; i++) {
                                if (board[(row - i) * size + col + i] === currentSymbol) count++;
                            }
                            if (count === win) return { type: 'diagonal-up', start: row * size + col, direction: 1 };
                        }
                    }
                }
            }

            return null;
        }

        function handleWin() {
            const winnerData = gameState.currentPlayer === 1 ? gameState.player1 : gameState.player2;
            gameState.scores[`player${gameState.currentPlayer}`] += 1;
            document.getElementById(`score${gameState.currentPlayer}`).textContent = gameState.scores[`player${gameState.currentPlayer}`];
            
            document.getElementById('game-message').textContent = `${winnerData.name} a gagné !`;
            gameState.gameActive = false;
        }

        function handleDraw() {
            document.getElementById('game-message').textContent = "Match nul !";
            gameState.gameActive = false;
        }

        function switchPlayer() {
            gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
            const currentPlayerData = gameState.currentPlayer === 1 ? gameState.player1 : gameState.player2;

            // Mettre à jour l'affichage
            document.getElementById('player1-status').classList.toggle('active');
            document.getElementById('player1-status').classList.toggle('inactive');
            document.getElementById('player2-status').classList.toggle('active');
            document.getElementById('player2-status').classList.toggle('inactive');
        }

        function updateGameDisplay() {
            // Mettre à jour les noms et symboles des joueurs
            document.getElementById('player1-display').textContent = gameState.player1.name;
            document.getElementById('player1-symbol-display').textContent = gameState.player1.symbol;
            document.getElementById('player2-display').textContent = gameState.player2.name;
            document.getElementById('player2-symbol-display').textContent = gameState.player2.symbol;

            // Mettre à jour le nombre de parties
            document.getElementById('total-matches').textContent = gameState.matchCount;
            document.getElementById('current-match').textContent = gameState.currentMatch;
        }

        // Gestion menu burger
        const burgerBtn = document.getElementById('burger-btn');
        const burgerPanel = document.getElementById('burger-panel');

        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('active');
            burgerPanel.classList.toggle('active');
        });

        document.getElementById('restart-match').addEventListener('click', () => {
            initializeGame();
            burgerBtn.classList.remove('active');
            burgerPanel.classList.remove('active');
        });

        document.getElementById('restart-game').addEventListener('click', () => {
            showStep(0);
            burgerBtn.classList.remove('active');
            burgerPanel.classList.remove('active');
        });

        document.getElementById('back-to-settings').addEventListener('click', () => {
            showStep(3);
            burgerBtn.classList.remove('active');
            burgerPanel.classList.remove('active');
        });

        // Gestion des symboles sélectionnables
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

        // Bouton Step 0
        document.getElementById('start-btn').addEventListener('click', () => nextStep(0));
        document.getElementById('next-1').addEventListener('click', () => nextStep(1));
        document.getElementById('next-2').addEventListener('click', () => nextStep(2));
        document.getElementById('start-game').addEventListener('click', () => nextStep(3));

        // Initialiser le board par défaut
        window.addEventListener('load', () => {
            createBoard();
            updateGameDisplay();
        });
