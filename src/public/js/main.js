const SODA_API = "api/sodas";
const UPDATE_API = "api/soda/update";

let prevMachineState;
let state = 0; //0 = user panel, 1 = admin panel

let sodaSelection; //hold soda obj
let isBusy = false; //flag to disable soda selection if machine is currently dispensing

//helper fn to clear all nodes of a selector
function clearChildren(selector){
    const toClear = document.querySelector(selector);
    
    //clear all children
    while (toClear.firstChild) {
        toClear.removeChild(toClear.firstChild);
    }
}

function updateStatusBar(content){
    console.log(...content); //an array
    clearChildren("#statusBar")
    
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
            updateStatusBar(["Selection: "+soda.name,"'"+soda.desc+"'","Cost: $"+soda.cost,"Quantity available: "+soda.currQty]);
            sodaSelection = soda;
        }else{
            console.log("IM BUSY");
        }
    });
    document.querySelector("#sodaList").appendChild(toAdd);
    console.log("Added: ",soda);
}

//load all sodas from database into the machine
function loadSodas(){
    //erase previous listings to renew data
    clearChildren("#sodaList");
    
    fetch(SODA_API)
    .then(res=>{
        return res.json();
    })
    .then(sodas=>{
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
    //TODO: implement soda json download to local fs
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
        loadSodas();
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
        if(!isBusy){
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
                sodaSelection = undefined;
            }
        }
    });
}

function handleLoad(){
    loadSodas();
    setGetButton();
    swapMode();
}

function swapMode(){
    if(!state){
        console.log("STATE = 0");
    }else{
        console.log("STATE = 1");
    }
}

function main(){
    handleLoad();
}

document.addEventListener("DOMContentLoaded",main);