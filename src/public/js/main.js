const SODA_API = "http://localhost:3000/api/sodas";
let sodaSelection = undefined;
let isBusy = false; //flag to disable soda selection if machine is currently dispensing

function test(){
    console.log("HERE");
}

function updateStatusBar(content){
    console.log(content);
    const statusBar = document.querySelector("#statusBar");
    statusBar.textContent = content;
}

function addSoda(soda){
    const toAdd = document.createElement("div");
    toAdd.classList.add("soda");
    toAdd.textContent = soda.name;
    toAdd.addEventListener("click",()=>{
        if(!isBusy){
            updateStatusBar(soda.name);
            sodaSelection = soda;
        }else{
            console.log("IM BUSY");
        }
    });
    document.querySelector("#sodaList").appendChild(toAdd);
    console.log(soda);
}

function loadSodas(){
    fetch(SODA_API)
    .then(res=>{
        return res.json();
    })
    .then(sodas=>{
        console.log(sodas);
        sodas.map(s=>{
            addSoda(s);
        });
    });
}

//helper fn to add some delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//this fn is only called when soda selection !== undefined or null
function getSoda(soda){
    //implement soda json download
}

function setGetButton(){
    const getBtn = document.querySelector("#getButton");
    getBtn.addEventListener('click', async ()=>{
        if(!sodaSelection){
            updateStatusBar("Please Select a Soda");  
        }else{
            updateStatusBar("Dispensing soda...");
            isBusy = true;
            await sleep(1000);
            
            getSoda(sodaSelection);
            updateStatusBar("Thank You!");
            
            await sleep(2000);
            updateStatusBar("SELECT A DRINK");
            isBusy = false;
        }
    });
}

function handleLoad(){
    //loads the sodas into the machine
    loadSodas();
    setGetButton();
}

function main(){
    handleLoad();
}

document.addEventListener("DOMContentLoaded",main);