// let playerName = prompt("Please enter first player name");
// let computerName = prompt("Please enter second player name");
let playerName = 'Player 1';
let computerName = 'Player 2';
// alert(playerName + ' and ' + computerName + " welcome to the game!\n You need to win in order to unlock new levels within the main escape room")

let n;
let m;

let player = Math.floor(Math.random() * 2) + 1;
// let DataArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let DataArray = [];
let GameStop = false;
let winningCombinations = [];

let TurnCounter = 1;
const buttonSize = 100;
function createGameField(n, m, N) {
    let gameField = document.getElementById("GameField");
    gameField.innerHTML = "";
    for (let j = 0; j < N; j++) {
        let tempDiv = document.createElement("div");
        for (let i = 0; i < n * m; i++) {
            let button = document.createElement("button");
            button.innerHTML = `<img id="cell_${i}" src="empty.png" alt="empty" width="${buttonSize-5}" height="${buttonSize-5}">`;
            button.addEventListener("click", function () {
                function_click(i); // Call the function with the value of i
            });
            gameField.appendChild(button);
        }
        gameField.style.display = 'grid';
        gameField.style.gridTemplateColumns = `repeat(${m}, ${buttonSize}px)`;
        gameField.style.gridTemplateRows = `repeat(${n}, ${buttonSize}px)`;
    }
}

function createWinningCombinationTable(rows = 0, columns = 0) {
    const newArray = [];
    const returnArray = [];
    let ind = 0;
    for (let i = 0; i < rows; i++) {
        newArray[i] = [];
        for (let j = 0; j < columns; j++) {
            newArray[i][j] = ind++;
        }
    }
    let index = 0;
    //rows
    for (let i = 0; i < rows; i++) {
        returnArray[index++] = newArray[i];
    }
    //columns
    for (let j = 0; j < columns; j++) {
        let tempArray = [];
        for (let i = 0; i < rows; i++) {
            tempArray[i] = newArray[i][j];
        }
        returnArray.push(tempArray);
    }

    //diagonals
    // from top left to bottom right
    let shiftTopLeftBottomRight = rows + 1;
    let tempArray1 = [0];
    for (let i = 1; i < rows; i++) {
        tempArray1[i] = tempArray1[i - 1] + shiftTopLeftBottomRight;
    }
    returnArray.push(tempArray1);
    // from top right to bottom left
    let shiftTopRightBottomLeft = rows - 1;
    let tempArray2 = [rows - 1];
    for (let i = 1; i < rows; i++) {
        tempArray2[i] = tempArray2[i - 1] + shiftTopRightBottomLeft;
    }
    returnArray.push(tempArray2);

    return returnArray;
}

function createDataArray(rows, columns) {
    const newArray = [];
    for (let i = 0; i < rows * columns; i++) {
        newArray[i] = 0;
    }
    return newArray;
}

function RestartGame() {
    let n = parseInt(document.getElementById("myInputField1").value);
    let m = n;
    let N = parseInt(document.getElementById("myInputField2").value)
    player = Math.floor(Math.random() * 2) + 1;
    ChangeTurnField(player);
    DataArray = createDataArray(n, m);
    GameStop = false;
    createGameField(n, m, N);
    TurnCounter = 1;
    winningCombinations = createWinningCombinationTable(n, m);
}

function function_click(cell) {
    if (!GameStop) {
        let idName = "cell_" + cell;
        for (let i = 0; i < DataArray.length; i++) {
            if (cell === i) {
                if (DataArray[i] === 0) {
                    //field could be changed
                    if (player === 1) {
                        TurnCounter++;
                        DataArray[i] = 1;
                        document.getElementById(idName).src = "1.png";
                        player = 2;
                        ChangeTurnField(player);
                        checkWinningConditions();
                        break;
                    } else {
                        TurnCounter++;
                        DataArray[i] = 2;
                        document.getElementById(idName).src = "2.png";
                        player = 1;
                        ChangeTurnField(player);
                        checkWinningConditions();
                        break;
                    }
                } else {
                    alert("Current field cannot be changed!");
                }
            }
        }
    } else {
        alert("Game is over. Please restart game.")
    }
}

function checkWinningConditions() {

    for (let i = 0; i < winningCombinations.length; i++) {
        let tempValue = 0;
        let tempValue2 = 0;
        for (let j = 0; j < winningCombinations[i].length; j++) {
            if (DataArray[winningCombinations[i][j]] === 0) {
                break;
            } else {
                if (DataArray[winningCombinations[i][j]] === 1) {
                    tempValue += DataArray[winningCombinations[i][j]];
                } else {
                    tempValue2 += DataArray[winningCombinations[i][j]];
                }
            }
        }

        if (tempValue % winningCombinations[i].length === 0) {
            if (tempValue / winningCombinations[i].length === 1) {
                //player 1 win
                alert(playerName + " wins!");
                GameStop = true;
                break;
            }
        }
        if (tempValue2 % winningCombinations[i].length === 0) {
            if (tempValue2 / winningCombinations[i].length === 2) {
                //player 2 win
                alert(computerName + " wins!");
                GameStop = true;
                break;
            }
        }
    }


    let countZero = 0;
    for (let i = 0; i < DataArray.length; i++) {
        if (DataArray[i] === 0) {
            countZero++;
        }
    }
    if (countZero === 0 && GameStop === false) {
        alert("Tie! Please restart game!");
    }
}

function ChangeTurnField(parameter) {
    let playerSwitch = '';
    let playerBGColor = "white";
    if (parameter === 1) {
        // change turn field to player 1
        playerSwitch = playerName + " turn 'x'";
        playerBGColor = "lightblue";
    } else {
        // change turn field to player 2
        playerSwitch = computerName + " turn 'o'";
        playerBGColor = "lightgreen";
    }
    document.getElementById("turnId").textContent = playerSwitch;
    document.getElementById("turnId").style.backgroundColor = playerBGColor;

    document.getElementById("turnCounter").textContent = "Turn #" + TurnCounter;
}