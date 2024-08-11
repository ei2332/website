//ターン管理
async function run(){
    button.style.display = 'none';
    PlayerA = BigInt("0x0000000810000000");
    PlayerB = BigInt("0x0000001008000000");
    // PlayerA = BigInt("0x0fffffff00000000");
    // PlayerB = BigInt("0x00000000fffffff0");
    PrintA  = BigInt("0x0000000810000000");
    PrintB  = BigInt("0x0000001008000000");
    console.log(PlayerA);
    updateInfo('現在のターン: 黒',2,2);
    flash();
    draw();
    showPopup("黒のターン\n(プレイヤーのターン)");
    await new Promise((resolve) =>{setTimeout(() => {resolve()}, popuptime+100);});
    while(true){
        //プレイヤーの入力
        Input = false;
        await new Promise((resolve) => { 
            function awaitInput(){
                if(Input == true){
                    if(makeMove(PreI)){
                        resolve();
                    }else{
                        Input = false;
                        setTimeout(awaitInput,33);
                    }
                }else{
                    setTimeout(awaitInput,33);
                }
            }
            awaitInput();
        });

        //パス・終了判定、処理
        if(!(getLegal(PlayerA,PlayerB)|getLegal(PlayerB,PlayerA)))break;
        if(!getLegal(PlayerB,PlayerA)){
            draw();
            await new Promise((resolve) =>{setTimeout(() => {resolve()}, 1000);});
            showPopup("Pass");
            continue;
        }
        turn = 1;
        draw();
        await new Promise((resolve) =>{setTimeout(() => {resolve()}, 1000);});
        showPopup("白のターン\n(AIのターン)");
        updateInfo('現在のターン: 白',popcountBigInt(PlayerA),popcountBigInt(PlayerB));
        await new Promise((resolve) =>{setTimeout(() => {resolve()}, popuptime+100);});

        //AI手の計算
        await new Promise((resolve) =>{
            MAX_DEPTH = next_DEPTH;
            aiMove();
            resolve();
        });

        //パス・終了判定、処理
        while(!getLegal(PlayerA,PlayerB)){
            if(!getLegal(PlayerB,PlayerA))break;
            draw();
            await new Promise((resolve) =>{setTimeout(() => {resolve()}, 1000);});
            showPopup("Pass!");
            await new Promise((resolve) =>{setTimeout(() => {resolve()}, popuptime+100);});
            MAX_DEPTH = next_DEPTH;
            await new Promise((resolve) =>{aiMove();resolve();});
            continue;
        }
        if(!(getLegal(PlayerA,PlayerB)|getLegal(PlayerB,PlayerA)))break;
        turn = 0;
        draw();
        await new Promise((resolve) =>{setTimeout(() => {resolve()}, 1000);});
        showPopup("黒のターン\n(プレイヤーのターン)");
        updateInfo('現在のターン: 黒',popcountBigInt(PlayerA),popcountBigInt(PlayerB));
        await new Promise((resolve) =>{setTimeout(() => {resolve()}, popuptime + 100);});
    }
    //勝敗判定、表示
    draw();
    let b = popcountBigInt(PlayerA);
    let w = popcountBigInt(PlayerB);
    if(b > w){
        showPopup("プレイヤーの勝利!\n黒 : "+b+" 白 : "+w);
        updateInfo('プレイヤーの勝利',popcountBigInt(PlayerA),popcountBigInt(PlayerB));
    }else if(w > b){
        showPopup("AIの勝利!\n黒 : "+b+" 白 : "+w);
        updateInfo('AIの勝利',popcountBigInt(PlayerA),popcountBigInt(PlayerB));
    }else{
        showPopup("引き分け!");
        updateInfo("引き分け!",32,32);
    }
    retry = false;
    button.style.display = 'block';
    await new Promise((resolve) =>{
        function recharange(){
            if(retry){
                resolve();
            }else{
                setTimeout(recharange,33);
            }
        }
        recharange();
    });
    setTimeout(run,0);
    return;
}
