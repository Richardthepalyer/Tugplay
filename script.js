// MONEY SYSTEM
let balance = parseInt(localStorage.getItem("balance")) || 1200
let balanceDisplay = document.getElementById("balance")

function updateBalance(){
balanceDisplay.textContent = balance
localStorage.setItem("balance",balance)
}

updateBalance()

// ADMIN DOUBLE CLICK
document.getElementById("title").ondblclick = () => {

document.getElementById("menu").classList.add("hidden")
document.getElementById("adminLogin").classList.remove("hidden")

}

// ADMIN LOGIN
function loginAdmin(){

let pin = document.getElementById("adminPin").value

if(pin === "2107"){

document.getElementById("adminLogin").classList.add("hidden")
document.getElementById("adminPanel").classList.remove("hidden")

}else{

alert("Wrong PIN")

}

}

// ADMIN ACTIONS
let minesCount = 3

function adminAction(type){

let amount = parseInt(document.getElementById("adminAmount").value)

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

if(amount >=3 && amount <=24){

minesCount = amount
alert("Mines set to "+amount)

}

}

updateBalance()

}

// GAME SWITCH
function showGame(id){

document.querySelectorAll(".game").forEach(g=>{
g.classList.add("hidden")
})

document.getElementById(id).classList.remove("hidden")

}

// COIN
function playCoin(choice){

let bet = parseInt(document.getElementById("coinBet").value)
if(bet > balance) return alert("Not enough")

let coin = document.getElementById("coinAnim")

coin.classList.add("flip")

setTimeout(()=>{

coin.classList.remove("flip")

let result = Math.random() < .5 ? "heads":"tails"

if(result==="heads"){
coin.className="coin heads"
coin.textContent="H"
}else{
coin.className="coin tails"
coin.textContent="T"
}

if(choice===result){

balance += bet
document.getElementById("coinResult").textContent="You Won"

}else{

balance -= bet
document.getElementById("coinResult").textContent="You Lost"

}

updateBalance()

},1000)

}

// SLOTS
const symbols=["🍒","🍋","⭐","💎","7️⃣"]

function spinSlots(){

let bet=parseInt(document.getElementById("slotBet").value)

if(bet>balance) return alert("Not enough")

let reels=[slot1,slot2,slot3]

let spin=setInterval(()=>{

reels.forEach(r=>{
r.textContent=symbols[Math.floor(Math.random()*symbols.length)]
})

},100)

setTimeout(()=>{

clearInterval(spin)

let s1=slot1.textContent
let s2=slot2.textContent
let s3=slot3.textContent

if(s1===s2 && s2===s3){

balance += bet*2
slotResult.textContent="3 MATCH! 3x"

}

else if(s1===s2 || s2===s3 || s1===s3){

balance += bet
slotResult.textContent="2 MATCH! 2x"

}

else{

balance -= bet
slotResult.textContent="Lost"

}

updateBalance()

},1500)

}

// MINES
let mines=[]
let mineBet=0
let multiplier=1
let gameActive=false

function startMines(){

mineBet=parseInt(document.getElementById("mineBet").value)

if(mineBet>balance) return alert("Not enough")

balance-=mineBet
updateBalance()

multiplier=1
gameActive=true

mines=[]

while(mines.length < minesCount){

let m=Math.floor(Math.random()*25)

if(!mines.includes(m)) mines.push(m)

}

createGrid()

}

function createGrid(){

let grid=document.getElementById("grid")
grid.innerHTML=""

for(let i=0;i<25;i++){

let tile=document.createElement("div")
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

mineResult.textContent="Boom!"

return

}

tile.textContent="💎"
tile.classList.add("safe")

multiplier *= (1.08 + (minesCount-3)*0.08)

mineMultiplier.textContent="Multiplier: "+multiplier.toFixed(2)+"x"

}

function cashOut(){

if(!gameActive) return

let win=Math.floor(mineBet*multiplier)

balance+=win

updateBalance()

mineResult.textContent="Cashed $"+win

gameActive=false

}
