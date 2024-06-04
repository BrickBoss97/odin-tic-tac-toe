const gameBoard = function () {
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
};

function gameController(
	playerOneName = "Player One",
	playerTwoName = "Player Two"
) {
	const board = gameBoard();

	const players = [
		{
			name: playerOneName,
			token: "X",
		},
		{
			name: playerTwoName,
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

	let activePlayer = players[0];

	const switchActivePlayer = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	const getActivePlayer = () => activePlayer;

	const printNewRound = () => {
		console.log(board.getBoard());
		console.log(`${getActivePlayer().name}'s turn.`);
	};

	const checkForWinner = (currentPlayer) => {
		const gameHasWinner = winningConditions().some((condition) =>
			condition.every((itemType) => itemType === currentPlayer.token)
		);
		const gameIsTied = winningConditions().every((condition) =>
			condition.every((itemType) => itemType !== "")
		);

		if (gameHasWinner) {
			console.log(`${getActivePlayer().name} has won`);
			return true;
		} else if (!gameHasWinner && gameIsTied) {
			console.log("Tie Game");
			return true;
		}
		return;
	};

	const playRound = (row, column) => {
		if (board.getCell(row, column) != "") {
			console.log("This cell has already been selected");
			return;
		}
		board.getBoard()[row][column] = getActivePlayer().token;
		if (checkForWinner(getActivePlayer())) {
			board.clearBoard();
			return;
		}
		switchActivePlayer();
		printNewRound();
	};

	return {
		playRound,
		getActivePlayer,
	};
}

const game = gameController();
