// --------------------
// MONEY SYSTEM
// --------------------

let balance = parseInt(localStorage.getItem("balance")) || 1200
let streak = parseInt(localStorage.getItem("streak")) || 0
let lastClaim = parseInt(localStorage.getItem("lastClaim")) || 0

const balanceDisplay = document.getElementById("balance")

function updateBalance(){
balanceDisplay.textContent = balance
localStorage.setItem("balance",balance)
}

updateBalance()

// --------------------
// DAILY REWARD
// --------------------

document.getElementById("dailyBtn").onclick = () => {

let now = Date.now()

if(now - lastClaim < 43200000){
alert("Daily already claimed")
return
}

let daysMissed = Math.floor((now - lastClaim) / 86400000)

if(daysMissed > 1) streak = 0

streak++

let reward = 1200 + (streak-1)*600

balance += reward

lastClaim = now

localStorage.setItem("streak",streak)
localStorage.setItem("lastClaim",lastClaim)

updateBalance()

alert("You received $" + reward)
}

// --------------------
// GAME SWITCH
// --------------------

function showGame(id){

document.querySelectorAll(".game").forEach(g=>{
g.classList.add("hidden")
})

document.getElementById(id).classList.remove("hidden")

}

// --------------------
// COIN GAME
// --------------------

function playCoin(choice){

let bet = parseInt(document.getElementById("coinBet").value)

if(!bet || bet < 1 || bet > 1000000){
alert("Invalid bet")
return
}

if(bet > balance){
alert("Not enough money")
return
}

const coin = document.getElementById("coinAnim")
coin.classList.add("flip")

setTimeout(()=>{

coin.classList.remove("flip")

let result = Math.random() < 0.5 ? "heads":"tails"

if(result === choice){

balance += bet
document.getElementById("coinResult").textContent = "You won!"

}else{

balance -= bet
document.getElementById("coinResult").textContent = "You lost!"

}

updateBalance()

},1000)

}

// --------------------
// SLOTS
// --------------------

const symbols = ["🍒","🍋","⭐","💎","7️⃣"]

function spinSlots(){

let bet = parseInt(document.getElementById("slotBet").value)

if(!bet || bet < 1 || bet > 1000000){
alert("Invalid bet")
return
}

if(bet > balance){
alert("Not enough money")
return
}

let s1 = symbols[Math.floor(Math.random()*symbols.length)]
let s2 = symbols[Math.floor(Math.random()*symbols.length)]
let s3 = symbols[Math.floor(Math.random()*symbols.length)]

document.getElementById("slot1").textContent = s1
document.getElementById("slot2").textContent = s2
document.getElementById("slot3").textContent = s3

if(s1 === s2 && s2 === s3){

balance += bet*2
document.getElementById("slotResult").textContent = "Jackpot! 3x"

}

else if(s1===s2 || s2===s3 || s1===s3){

balance += bet
document.getElementById("slotResult").textContent = "2 Match! 2x"

}

else{

balance -= bet
document.getElementById("slotResult").textContent = "You lost"

}

updateBalance()

}

// --------------------
// MINES
// --------------------

let mines=[]
let mineBet=0
let multiplier=1
let safeClicks=0
let gameActive=false

function startMines(){

mineBet = parseInt(document.getElementById("mineBet").value)

if(!mineBet || mineBet < 1 || mineBet > balance){
alert("Invalid bet")
return
}

balance -= mineBet
updateBalance()

multiplier=1
safeClicks=0
gameActive=true

mines=[]

while(mines.length < 3){

let m = Math.floor(Math.random()*25)

if(!mines.includes(m)) mines.push(m)

}

createGrid()

}

function createGrid(){

const grid = document.getElementById("grid")
grid.innerHTML=""

for(let i=0;i<25;i++){

let tile = document.createElement("div")
tile.className="tile"

tile.onclick=()=>clickTile(tile,i)

grid.appendChild(tile)

}

}

function clickTile(tile,index){

if(!gameActive) return

if(mines.includes(index)){

tile.textContent="💣"
tile.classList.add("mine")

gameActive=false

document.getElementById("mineResult").textContent="Boom! You lost."

return

}

tile.textContent="💎"
tile.classList.add("safe")

safeClicks++

multiplier*=1.08

document.getElementById("mineMultiplier").textContent =
"Multiplier: "+multiplier.toFixed(2)+"x"

}

function cashOut(){

if(!gameActive) return

let winnings = Math.floor(mineBet * multiplier)

balance += winnings

updateBalance()

document.getElementById("mineResult").textContent =
"Cashed out $" + winnings

gameActive=false

}
