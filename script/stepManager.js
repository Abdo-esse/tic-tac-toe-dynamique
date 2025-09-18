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
                       document.getElementById('error1').textContent = 'Veuillez entrer le nom du joueur 1';
                       document.getElementById('error1').style.display = 'block';
                        return false;
                    }
                    gameState.player1.name = player1Name;
                    gameState.player1.symbol = document.querySelector('#player1-symbols .symbol-option.selected').dataset.symbol;
                    updatePlayer2Symbols();
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
            
            handleResize(board);
            board.style.gridTemplateColumns = `repeat(${gameState.gridSize}, 1fr)`;
            board.style.gridTemplateRows = `repeat(${gameState.gridSize}, 1fr)`;

            for (let i = 0; i < gameState.gridSize * gameState.gridSize; i++) {
                console.log(gameState.gridSize * gameState.gridSize);
                const cell = document.createElement('button');
                cell.className = 'cell';
                cell.dataset.index = i;
                cell.addEventListener('click', () => handleCellClick(i));
                board.appendChild(cell);
            }
        }

        function handleResize(board) {
            switch (gameState.gridSize) {
                case 3:
                    board.style.width = '300px';
                    board.style.height = '300px';
                    break;
                case 4:
                    board.style.width = '400px';
                    board.style.height = '400px';
                    break;
                default:
                    board.style.width = '500px';
                    board.style.height = '520px';
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
        }


        function updateGameDisplay() {
            document.getElementById('player1-display').textContent = gameState.player1.name;
            document.getElementById('player1-symbol-display').textContent = gameState.player1.symbol;
            document.getElementById('player2-display').textContent = gameState.player2.name;
            document.getElementById('player2-symbol-display').textContent = gameState.player2.symbol;

            document.getElementById('total-matches').textContent = gameState.matchCount;
            document.getElementById('current-match').textContent = gameState.currentMatch;
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

        window.addEventListener('load', () => {
            createBoard();
            updateGameDisplay();
        });
