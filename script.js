// ----------------
// BALANCE SYSTEM
// ----------------

let balance = parseInt(localStorage.getItem("balance")) || 1200
let streak = parseInt(localStorage.getItem("streak")) || 0
let lastClaim = parseInt(localStorage.getItem("lastClaim")) || 0

const balanceDisplay = document.getElementById("balance")

function updateBalance(){
balanceDisplay.textContent = balance
localStorage.setItem("balance",balance)
}

updateBalance()


// ----------------
// DAILY REWARD
// ----------------

const dailyBtn = document.getElementById("dailyBtn")

dailyBtn.onclick = () => {

let now = Date.now()

if(now - lastClaim < 43200000){
alert("Daily reward already claimed. Try again later.")
return
}

let daysMissed = Math.floor((now-lastClaim)/86400000)

if(daysMissed > 1) streak = 0

streak++

let reward = 1200 + ((streak-1)*600)

balance += reward

lastClaim = now

localStorage.setItem("streak",streak)
localStorage.setItem("lastClaim",lastClaim)

updateBalance()

alert("Daily Reward: $" + reward + " | Streak: " + streak)

}


// ----------------
// ADMIN TOGGLE
// ----------------

let adminOpen = false

document.getElementById("title").ondblclick = () => {

adminOpen = !adminOpen

if(adminOpen){

document.getElementById("menu").classList.add("hidden")
document.getElementById("adminLogin").classList.remove("hidden")

}else{

document.getElementById("menu").classList.remove("hidden")
document.getElementById("adminLogin").classList.add("hidden")
document.getElementById("adminPanel").classList.add("hidden")

}

}


// ----------------
// ADMIN LOGIN
// ----------------

function loginAdmin(){

let pin = document.getElementById("adminPin").value

if(pin === "2107"){

document.getElementById("adminLogin").classList.add("hidden")
document.getElementById("adminPanel").classList.remove("hidden")

}else{

alert("Wrong PIN")

}

}


// ----------------
// ADMIN ACTIONS
// ----------------

let minesCount = 3

function adminAction(type){

let amount = parseInt(document.getElementById("adminAmount").value)

if(!amount) return alert("Enter amount")

if(type === 1){
balance += amount
}

if(type === 2){
balance = amount
}

if(type === 3){
balance -= amount
}

if(type === 4){

if(amount < 3 || amount > 24){
alert("Mines must be 3-24")
return
}

minesCount = amount
alert("Mines set to " + minesCount)

}

updateBalance()

}


// ----------------
// GAME SWITCH
// ----------------

function showGame(id){

document.querySelectorAll(".game").forEach(g=>{
g.classList.add("hidden")
})

document.getElementById(id).classList.remove("hidden")

}


// ----------------
// COIN GAME
// ----------------

function playCoin(choice){

let bet = parseInt(document.getElementById("coinBet").value)

if(!bet || bet < 1) return alert("Invalid bet")
if(bet > balance) return alert("Not enough money")

let coin = document.getElementById("coinAnim")

coin.classList.add("flip")

setTimeout(()=>{

coin.classList.remove("flip")

let result = Math.random() < 0.5 ? "heads" : "tails"

if(result === "heads"){
coin.className="coin heads"
coin.textContent="H"
}else{
coin.className="coin tails"
coin.textContent="T"
}

if(choice === result){

balance += bet
document.getElementById("coinResult").textContent="You Won $" + bet

}else{

balance -= bet
document.getElementById("coinResult").textContent="You Lost $" + bet

}

updateBalance()

},1000)

}


// ----------------
// SLOTS GAME (FIXED)
// ----------------

const symbols = ["🍒","🍋","⭐","💎","7️⃣"]

function spinSlots(){

let bet = parseInt(document.getElementById("slotBet").value)

if(!bet || bet < 1) return alert("Invalid bet")
if(bet > balance) return alert("Not enough money")

const slot1 = document.getElementById("slot1")
const slot2 = document.getElementById("slot2")
const slot3 = document.getElementById("slot3")
const result = document.getElementById("slotResult")

let spins = 0

const spinInterval = setInterval(()=>{

slot1.textContent = symbols[Math.floor(Math.random()*symbols.length)]
slot2.textContent = symbols[Math.floor(Math.random()*symbols.length)]
slot3.textContent = symbols[Math.floor(Math.random()*symbols.length)]

spins++

if(spins > 15){

clearInterval(spinInterval)

let s1 = slot1.textContent
let s2 = slot2.textContent
let s3 = slot3.textContent

if(s1 === s2 && s2 === s3){

let win = bet * 3
balance += win
result.textContent = "3 MATCH! You won $" + win

}

else if(s1===s2 || s2===s3 || s1===s3){

let win = bet * 2
balance += win
result.textContent = "2 MATCH! You won $" + win

}

else{

balance -= bet
result.textContent = "No match. Lost $" + bet

}

updateBalance()

}

},100)

}


// ----------------
// MINES GAME
// ----------------

let mines=[]
let mineBet=0
let multiplier=1
let gameActive=false

function startMines(){

mineBet = parseInt(document.getElementById("mineBet").value)

if(!mineBet || mineBet < 1) return alert("Invalid bet")
if(mineBet > balance) return alert("Not enough money")

balance -= mineBet
updateBalance()

multiplier = 1
gameActive = true

mines = []

while(mines.length < minesCount){

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

document.getElementById("mineResult").textContent="Boom! You lost."

gameActive=false
return

}

tile.textContent="💎"
tile.classList.add("safe")

multiplier *= (1.08 + (minesCount-3)*0.08)

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
