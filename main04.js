//AI手の計算
function evaluateBoard(P1, P2) {
    const weights = [
        120, -20, 20, 5, 5, 20, -20, 120,
        -20, -40, -5, -5, -5, -5, -40, -20,
        20, -5, 15, 3, 3, 15, -5, 20,
        5, -5, 3, 3, 3, 3, -5, 5,
        5, -5, 3, 3, 3, 3, -5, 5,
        20, -5, 15, 3, 3, 15, -5, 20,
        -20, -40, -5, -5, -5, -5, -40, -20,
        120, -20, 20, 5, 5, 20, -20, 120
    ];
    
    let score = 0;
    let x = 0;
    for (let i = 0; i < 64; i++) {
        if (P1 & (1n << BigInt(i))) score += weights[i];
        else if (P2 & (1n << BigInt(i))) score -= weights[i];
        else x++;
    }
    if(x <= 10){
        score = 0;
        for (let i = 0; i < 64; i++) {
            if (P1 & (1n << BigInt(i))) score += 1;
            else if (P2 & (1n << BigInt(i))) score -= 1;
        }
    }
    return score;
}

// αβ剪定を用いたミニマックス法
function minimax(P1, P2, depth, alpha, beta, isMaximizing) {
    if (depth === 0) return evaluateBoard(P1, P2);

    const legalMoves = getLegal(P1, P2);
    if (legalMoves === 0n) return evaluateBoard(P1, P2);

    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (let i = 0; i < 64; i++) {
        if (legalMoves & (1n << BigInt(i))) {
            const [newP1, newP2] = placeStone(P1, P2, 1n << BigInt(i));
            const score = minimax(newP2, newP1, depth - 1, alpha, beta, !isMaximizing);

            if (isMaximizing) {
                bestScore = Math.max(bestScore, score);
                alpha = Math.max(alpha, score);
            } else {
                bestScore = Math.min(bestScore, score);
                beta = Math.min(beta, score);
            }

            if (beta <= alpha) break; // αβ剪定
        }
    }

    return bestScore;
}

function aiMove() {
    const legalMoves = getLegal(PlayerB, PlayerA);
    let bestScore = -Infinity;
    let bestMove = 0;

    for (let i = 0; i < 64; i++) {
        if (legalMoves & (1n << BigInt(i))) {
            const [newPlayerA, newPlayerB] = placeStone(PlayerB, PlayerA, 1n << BigInt(i));
            const score = minimax(newPlayerB, newPlayerA, MAX_DEPTH - 1, -Infinity, Infinity, false);

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    const [newPlayerA, newPlayerB] = placeStone(PlayerB, PlayerA, 1n << BigInt(bestMove));
    PlayerB = newPlayerA;
    PlayerA = newPlayerB;

}