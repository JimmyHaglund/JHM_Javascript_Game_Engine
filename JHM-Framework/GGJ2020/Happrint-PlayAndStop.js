let onPlay = new Action();
let onReset = new Action();
function playGame(){
    onPlay.invoke();
}
function resetGame(){
    onReset.invoke();
}

onPlay.add(() => console.log("Play"));
onReset.add(() => console.log("Reset"));