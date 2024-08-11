//変数の作成、初期関数
let  PlayerA = BigInt("0x0000000810000000");
let  PlayerB = BigInt("0x0000001008000000");
let  PrintA  = BigInt("0x0000000810000000");
let  PrintB  = BigInt("0x0000001008000000");
const L_MASK = BigInt("0x7f7f7f7f7f7f7f7f");
const R_MASK = BigInt("0xfefefefefefefefe");
const U_MASK = BigInt("0x00ffffffffffffff");
const D_MASK = BigInt("0xffffffffffffff00");
let boardElement;
let board = Array(64);
let turn = 0;
let Input = false,PreI = -1,retry = false;
let MAX_DEPTH = 6; // 探索の深さ
let next_DEPTH = 6;
let popuptime = 1500;
const slider = document.getElementById('popuptime');
const slider2 = document.getElementById('aideep');
const button = document.getElementById('retry-button');

window.onload = function main() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    const boardFragment = document.createDocumentFragment(); // Use a document fragment for batching DOM updates

    const clickHandler = (i, j) => () => click(1n << BigInt(63 - (i * 8 + j))); // Create a reusable click handler

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const index = 63 - (i * 8 + j);
            const mask = 1n << BigInt(index);
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', clickHandler(i, j));

            const cellContent = document.createElement('div');
            board[index] = cellContent; // Reuse index variable
            cellContent.classList.add('stone');
            cellContent.classList.add('empty');
            cell.appendChild(cellContent);
            boardFragment.appendChild(cell); // Append cells to the fragment
        }
    }

    boardElement.appendChild(boardFragment); // Add the fragment to the DOM in one operation

    run();
    slider.addEventListener('input', function () {
        popuptime = slider.value * 100;
    });
    slider2.addEventListener('input', function () {
        next_DEPTH = slider2.value;
    });
};

function click(i){
    if(Input == true)return;
    Input = true;
    PreI = i;
}

function print(e, f) {
    e = ('0000000000000000000000000000000000000000000000000000000000000000' + e.toString(2)).slice(-64);
    f = ('0000000000000000000000000000000000000000000000000000000000000000' + f.toString(2)).slice(-64);
    console.log(e.substr(0, 8), f.substr(0, 8));
    console.log(e.substr(8, 8), f.substr(8, 8));
    console.log(e.substr(16, 8), f.substr(16, 8));
    console.log(e.substr(24, 8), f.substr(24, 8));
    console.log(e.substr(32, 8), f.substr(32, 8));
    console.log(e.substr(40, 8), f.substr(40, 8));
    console.log(e.substr(48, 8), f.substr(48, 8));
    console.log(e.substr(56, 8), f.substr(56, 8));
}