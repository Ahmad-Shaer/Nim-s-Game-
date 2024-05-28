let ListenerObject = { numOfMatches: 0 }

let difficulty = "easy";

function createMatch() {
    const childInstance = document.createElement("img");
    childInstance.setAttribute("class", "match");
    childInstance.setAttribute("src", "src/match.png");
    return childInstance;
}

let Listener = new Proxy(ListenerObject, {
    set: function (object, id, newValue) {
        let matches_box = document.getElementById("matches-box");
        matches_box.innerHTML = ''; // Clear The Matches Box
        for (let i = 0; i < newValue; i++) {
            matches_box.appendChild(createMatch());
        }
        ListenerObject["numOfMatches"] = newValue;
        return true;
    }
})

function handleMatchesCount(event) {
    let selectedValue = parseInt(event.target.value);
    Listener.numOfMatches = selectedValue;
    notify("You have set the number of matches to " + selectedValue);
    document.getElementById("match-count").innerText = selectedValue.toString();
}

function subtractMatches(numberOfMatches) {
    Listener.numOfMatches -= numberOfMatches;
    let totalMatches = ListenerObject.numOfMatches;
    document.getElementById("match-count").innerText = totalMatches;
    notify("You Have Removed " + numberOfMatches);
    setTimeout(function () {
        notify(totalMatches + " Matches Left.");
    }, 150);
    const sub2btn = document.getElementById('sub2');
    const sub3btn = document.getElementById('sub3');
    const sub1btn = document.getElementById('sub1');

    if (totalMatches === 3) {
        sub3btn.disabled = true;
    } else if (totalMatches === 2) {
        sub2btn.disabled = true;
        sub3btn.disabled = true;
    }
    if (totalMatches === 1) {
        document.getElementById("match-count").innerText = "CONGRATS YOU HAVE WON!";
        sub2btn.disabled = true;
        sub1btn.disabled = true;
        sub3btn.disabled = true;
        document.getElementById("reset-btn").style.display = "block";
    } else {
        setTimeout(function () {
            notify("Computer Turn.");
        }, 600);
        const sub1state = sub1btn.disabled;
        const sub2state = sub1btn.disabled;
        const sub3state = sub1btn.disabled;

        sub1btn.disabled = true;
        sub2btn.disabled = true;
        sub3btn.disabled = true;
        setTimeout(function () {
            switchToAiTurn();
            sub1btn.disabled = sub1state;
            sub2btn.disabled = sub2state;
            sub3btn.disabled = sub3state;
        }, 2000)
    }
}



function deleteNotification(notification) {
    notification.classList.remove("showNotification");
    notification.classList.add("hideNotification");
    setTimeout(function () {
        notification.remove();
    }, 4000);
}

function notify(notificationMsg) {
    let notificationBox = document.getElementById("notification-box");
    let notification = document.createElement("span");
    notification.classList.add("showNotification")
    notification.innerText = notificationMsg;
    notificationBox.append(notification);
    setTimeout(deleteNotification, 1600, notification);
}

function resetGame() {
    Listener.numOfMatches = 21;
    document.getElementById("match-count").innerText = Listener.numOfMatches;
    document.getElementById("reset-btn").style.display = 'none';
    const sub2btn = document.getElementById('sub2');
    const sub3btn = document.getElementById('sub3');
    const sub1btn = document.getElementById('sub1');
    sub2btn.disabled = false;
    sub1btn.disabled = false;
    sub3btn.disabled = false;
}

const totalRadios = document.getElementsByName('total');
for (let i = 0; i < totalRadios.length; i++) {
    totalRadios[i].addEventListener('change', function () {
        initializeTotal();
    });
}

function handleGameMode(event) {
    if (!event.target) return;
    let selectedValue = event.target.value;
    difficulty = selectedValue;
    notify("You have set the game mode to " + selectedValue);
}

function initializeNumberOfMatches() {
    ListenerObject.numOfMatches = 9
    let radioGroup = document.getElementsByName("matches-number");
    for (let i = 0; i < radioGroup.length; i++) {
        if (radioGroup[i].checked) {
            Listener.numOfMatches = parseInt(radioGroup[i].value);
            break;
        }
    }
    document.getElementById("match-count").innerText = ListenerObject.numOfMatches;
    document.getElementById("count-form").addEventListener("click", handleMatchesCount);
    document.getElementById("difficulty").addEventListener("click", handleGameMode);
}


// Minimax algorithm with alpha-beta pruning
function minimax(matches, depth, isMaximizing, alpha, beta) {
    if (depth === 0 || matches === 0) {
        return 0;
    }

    if (isMaximizing) {
        let maxEval = -Infinity;
        let bestMove = 0; // Track the best move

        for (let i = 1; i <= 3; i++) {
            if (matches >= i) {
                const eval = minimax(matches - i, depth - 1, false, alpha, beta);

                if (eval > maxEval) {
                    maxEval = eval;
                    bestMove = i;
                }

                alpha = Math.max(alpha, maxEval);
                if (beta <= alpha) {
                    break;
                }
            }
        }

        return bestMove;
    } else {
        let minEval = Infinity;

        for (let i = 1; i <= 3; i++) {
            if (matches >= i) {
                const eval = minimax(matches - i, depth - 1, true, alpha, beta);

                if (eval < minEval) {
                    minEval = eval;
                }

                beta = Math.min(beta, minEval);
                if (beta <= alpha) {
                    break;
                }
            }
        }

        return minEval;
    }
}

function switchToAiTurn() {
    let depth;
    switch (difficulty) {
        case "easy":
            depth = 2;
            break;
        case "medium":
            depth = 10;
            break;
        case "hard":
            depth = 20;
            break;
        default:
            depth = 3;
    }

    const bestMove = minimax(ListenerObject.numOfMatches, depth, true, -Infinity, Infinity);
    subtractAiMatches(bestMove);
}

function subtractAiMatches(numberOfMatches) {
    if (numberOfMatches >= 1 && numberOfMatches <= 3 && ListenerObject.numOfMatches - numberOfMatches > 0) {
        Listener.numOfMatches -= numberOfMatches;
        document.getElementById("match-count").innerText = ListenerObject.numOfMatches;
        notify("Computer Removed " + numberOfMatches + " Matches");
        setTimeout(function () {
            notify("Your turn!");
        }, 150);
    } else {

        console.error("Invalid AI move!");

    }
}

initializeNumberOfMatches();
