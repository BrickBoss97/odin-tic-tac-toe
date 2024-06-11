function formActions() {
	const dialog = document.querySelector("dialog");
	const newPlayerBtn = document.querySelector(".new-players");
	const newGameBtn = document.querySelector(".submit");

	dialog.addEventListener("cancel", (event) => {
		event.preventDefault();
	});

	function openForm() {
		dialog.showModal();
	}

	function closeForm() {
		dialog.close();
	}

	newPlayerBtn.addEventListener("click", openForm);
	newGameBtn.addEventListener("click", (event) => {
		event.preventDefault();
		screenController();
		closeForm();
	});

	const getFormData = () => dialog;

	openForm();

	return {
		openForm,
		getFormData,
	};
}

function gameBoard() {
	let board = [
		["", "", ""],
		["", "", ""],
		["", "", ""],
	];

	const getBoard = () => board;

	let getCell = (row, column) => board[row][column];

	const clearBoard = () =>
		(board = getBoard().map((row) => row.map((cell) => (cell = ""))));

	return {
		getBoard,
		getCell,
		clearBoard,
	};
}

function gameController() {
	const board = gameBoard();

	const players = [
		{
			name: document.querySelector(".player-one").value,
			token: "X",
		},
		{
			name: document.querySelector(".player-two").value,
			token: "O",
		},
	];

	const winningConditions = () => {
		return [
			(firstRow = [
				board.getCell(0, 0),
				board.getCell(0, 1),
				board.getCell(0, 2),
			]),
			(secondRow = [
				board.getCell(1, 0),
				board.getCell(1, 1),
				board.getCell(1, 2),
			]),
			(thirdRow = [
				board.getCell(2, 0),
				board.getCell(2, 1),
				board.getCell(2, 2),
			]),
			(firstColumn = [
				board.getCell(0, 0),
				board.getCell(1, 0),
				board.getCell(2, 0),
			]),
			(secondColumn = [
				board.getCell(0, 1),
				board.getCell(1, 1),
				board.getCell(2, 1),
			]),
			(thirdColumn = [
				board.getCell(0, 2),
				board.getCell(1, 2),
				board.getCell(2, 2),
			]),
			(topDiagonal = [
				board.getCell(0, 0),
				board.getCell(1, 1),
				board.getCell(2, 2),
			]),
			(bottomDiagonal = [
				board.getCell(2, 0),
				board.getCell(1, 1),
				board.getCell(0, 2),
			]),
		];
	};

	let activePlayer = Math.random() < 0.5 ? players[0] : players[1];

	const switchActivePlayer = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	const getActivePlayer = () => activePlayer;

	const checkForWinner = (currentPlayer) => {
		const gameHasWinner = winningConditions().some((condition) =>
			condition.every((itemType) => itemType === currentPlayer.token)
		);
		const gameIsTied = winningConditions().every((condition) =>
			condition.every((itemType) => itemType !== "")
		);

		if (gameHasWinner) {
			return `${getActivePlayer().name} has won!`;
		} else if (!gameHasWinner && gameIsTied) {
			return "Tie Game";
		}
		return;
	};

	const playRound = (row, column) => {
		if (board.getCell(row, column) != "") {
			return;
		}
		board.getBoard()[row][column] = getActivePlayer().token;
		if (checkForWinner(getActivePlayer())) {
			return;
		}
		switchActivePlayer();
	};

	return {
		playRound,
		getActivePlayer,
		checkForWinner,
		getBoard: board.getBoard,
		getCell: board.getCell,
		clearBoard: board.clearBoard,
	};
}

function screenController() {
	const game = gameController();
	const playerTurnDiv = document.querySelector(".player-turn");
	const boardDiv = document.querySelector(".board-container");
	const gameDiv = document.querySelector(".game-container");

	const updateScreen = () => {
		boardDiv.textContent = "";

		const board = game.getBoard();
		const activePlayer = game.getActivePlayer();

		if (game.checkForWinner(activePlayer)) {
			playerTurnDiv.textContent = game.checkForWinner(activePlayer);
		} else {
			playerTurnDiv.textContent = `It's ${activePlayer.name}'s turn.`;
		}

		board.forEach((row, rowIndex) => {
			row.forEach((cell, columnIndex) => {
				const cellButton = document.createElement("button");
				cellButton.classList.add("game-cell");
				cellButton.dataset.row = rowIndex;
				cellButton.dataset.column = columnIndex;
				cellButton.textContent = game.getCell(rowIndex, columnIndex);
				boardDiv.appendChild(cellButton);
			});
		});
	};

	function resetGame(e) {
		if (!e.target.classList.contains("reset")) return;

		game.clearBoard();
		screenController();
	}

	function clickHandlerBoard(e) {
		const selectedRow = e.target.dataset.row;
		const selectedColumn = e.target.dataset.column;

		if (
			!selectedColumn ||
			!selectedRow ||
			game.checkForWinner(game.getActivePlayer())
		)
			return;

		game.playRound(selectedRow, selectedColumn);
		updateScreen();
	}

	boardDiv.addEventListener("click", clickHandlerBoard);
	gameDiv.addEventListener("click", resetGame);

	updateScreen();
}

formActions();
