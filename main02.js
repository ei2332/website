//盤面の計算(bit演算)
function shift(board, dir) {
    switch (dir) {
        case 0: return (board << 1n) & R_MASK;            // 右
        case 1: return (board >> 1n) & L_MASK;            // 左
        case 2: return (board << 8n) & D_MASK;            // 下
        case 3: return (board >> 8n) & U_MASK;            // 上
        case 4: return (board << 7n) & (L_MASK & D_MASK); // 左下
        case 5: return (board >> 7n) & (R_MASK & U_MASK); // 右上
        case 6: return (board << 9n) & (R_MASK & D_MASK); // 右下
        case 7: return (board >> 9n) & (L_MASK & U_MASK); // 左上
        default: return 0n;
    }
}

function getLegal(P1, P2) {
    const empty = ~(P1 | P2);
    let legal = 0n;

    for (let i = 0; i < 8; i++) {
        let possible = P2 & shift(P1, i);
        let potential = possible;
        while (possible !== 0n) {
            possible = shift(possible, i) & P2;
            potential |= possible;
        }
        legal |= shift(potential, i) & empty;
    }
    return legal;
}

function flip(P1, P2, puts) {
    let flips = 0n;
    for (let i = 0; i < 8; i++) {
        let flipCandidate = 0n;
        let possible = shift(puts, i) & P2;

        while (possible) {
            flipCandidate |= possible;
            possible = shift(possible, i) & P2;
        }

        if (shift(flipCandidate, i) & P1) {
            flips |= flipCandidate;
        }
    }
    return flips;
}

function placeStone(P1, P2, puts) {
    const flips = flip(P1, P2, puts);
    P1 |= flips | puts;
    P2 &= ~flips;
    return [P1, P2];
}

function makeMove(e) {
    const puts = e;
    let legal = getLegal(PlayerA,PlayerB);
    if (legal & puts) {
        const [newPlayerA, newPlayerB] = placeStone(PlayerA, PlayerB, puts);
        PlayerA = newPlayerA;
        PlayerB = newPlayerB;
        return true;
    }
    return false;
}

function popcountBigInt(value) {
    
    let count = 0n;
    let num = value;

    while (num > 0n) {
        count += num & 1n; // 最下位ビットが 1 ならカウントする
        num >>= 1n; // 1 ビット右にシフト
    }

    return count;
}