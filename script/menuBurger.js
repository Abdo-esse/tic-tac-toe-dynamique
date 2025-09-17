
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