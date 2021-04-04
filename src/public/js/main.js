const SODA_API = "api/sodas";
const UPDATE_API = "api/soda/update";

let sodaSelection = undefined; //hold soda obj
let isBusy = false; //flag to disable soda selection if machine is currently dispensing

function test(){
    console.log("HERE");
}

function updateStatusBar(content){
    console.log(content); //an array
    const statusBar = document.querySelector("#statusBar");
    
    //clear statusBar
    while (statusBar.firstChild) {
        statusBar.removeChild(statusBar.firstChild);
    }
    
    content.map(line=>{
        const newNode = document.createTextNode(line);
        statusBar.appendChild(newNode);
        const lineBreak = document.createElement("br");
        statusBar.appendChild(lineBreak);
        
    });
}

function addSoda(soda){
    const toAdd = document.createElement("div");
    toAdd.classList.add("soda");
    toAdd.textContent = soda.name;
    toAdd.addEventListener("click",()=>{
        if(!isBusy){
            updateStatusBar(["Selection: "+soda.name,"Cost: $"+soda.cost]);
            sodaSelection = soda;
        }else{
            console.log("IM BUSY");
        }
    });
    document.querySelector("#sodaList").appendChild(toAdd);
    console.log(soda);
}

//load all sodas from database into the machine
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
    //TODO: implement soda json download
}

//this fn will decrement the soda currQty from the database
function deductSodaQty(soda){
    //TODO: api/soda/update

    fetch(UPDATE_API, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: new URLSearchParams(soda),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

//add functionality to the get btn
function setGetButton(){
    const getBtn = document.querySelector("#getButton");
    getBtn.addEventListener('click', async ()=>{
        if(!sodaSelection){
            updateStatusBar(["Please Select a Soda"]);  
        }else{
            updateStatusBar(["Dispensing soda..."]);
            isBusy = true;
            await sleep(2000);
            //do stuff
            deductSodaQty(sodaSelection);
            getSoda(sodaSelection);
            
            updateStatusBar(["Thank You!"]);
            //stuff done
            await sleep(2000);
            updateStatusBar(["SELECT A DRINK"]);
            isBusy = false;
        }
    });
}

function handleLoad(){
    loadSodas();
    setGetButton();
}

function main(){
    handleLoad();
}

document.addEventListener("DOMContentLoaded",main);