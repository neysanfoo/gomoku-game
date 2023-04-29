const offlineButton = document.getElementById('offline');
const onlineButton = document.getElementById('online');
const computerButton = document.getElementById('computer');

const backButton = document.querySelector(".back-to-home");

backButton.addEventListener("click", () => {
    gameBoard.innerHTML = "";
    gameRoom.classList.add("hidden");
    gameModeSelection.classList.remove("hidden");
});


let board;
const gameRoom = document.querySelector('.game-room');
const gameBoard = document.querySelector('.game-board');
const gameModeSelection = document.querySelector('.game-mode-selection');

// Event listeners for game mode selection
offlineButton.addEventListener('click', () => {
    startOfflineGame();
});

onlineButton.addEventListener('click', () => {
    startOnlineGame();
});

computerButton.addEventListener('click', () => {
    startComputerGame();
});

function startOfflineGame() {
    board = new Board(15);
    gameModeSelection.classList.add('hidden');
    gameRoom.classList.remove('hidden');
    gameBoard.appendChild(board.boardEl);
    board.addEventListeners();
}


function startOnlineGame() {
    console.log("online");
    // Initialize the online game logic here
}

function startComputerGame() {
    board = new ComputerBoard(15);
    gameModeSelection.classList.add('hidden');
    gameRoom.classList.remove('hidden');
    gameBoard.appendChild(board.boardEl);
    board.addEventListeners();
}

