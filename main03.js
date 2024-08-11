//ポップアップの表示、盤面の表示
function f(i,e){
    if(( 1n << i ) & ( ~ ( PrintA | PrintB ) )){
        board[i].classList.remove('empty');
        board[i].classList.add(e);
    }else{
        //空白でないところを変更する場合アニメーションをする
        setTimeout(() => {
            board[i].classList.add('flipping');
            setTimeout(()=> {
                board[i].classList.remove('white','black');
                board[i].classList.add(e);
            },300);
            setTimeout(() => {
                board[i].classList.remove('flipping');
            },1000);
        },10);
    }
}

function updateInfo(turn, blackCount, whiteCount) {
    document.getElementById('current-turn').textContent = turn;
    document.getElementById('black-count').textContent = blackCount;
    document.getElementById('white-count').textContent = whiteCount;
}

function showPopup(message) {
    const popup = document.getElementById('popup');
    const messageElement = document.getElementById('popup-message');
    messageElement.innerText = message;
    popup.classList.remove('hidden');

    //ポップアップを自動で閉じる
    setTimeout(closePopup, popuptime);
}

function closePopup() {
    const popup = document.getElementById('popup');
    popup.classList.add('hidden');
}

function draw(){
    for(let i = 0n;i < 64n;i++){
        if((PlayerA & 1n<<i) & ~(PrintA & 1n<<i)){
            f(i,'black');
        }else if((PlayerB & 1n<<i) & ~(PrintB & 1n<<i)){
            f(i,'white');
        }
    }
    PrintA = PlayerA;
    PrintB = PlayerB;
}

function flash(){
    for(let i = 0n;i < 64n;i++){
        board[i].classList.remove('white','black');
        board[i].classList.add('empty');
    }
    PrintA = 0n;
    PrintB = 0n;
}