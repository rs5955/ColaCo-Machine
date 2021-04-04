const SODA_API = "api/sodas";
const UPDATE_API = "api/soda/update";

const MACHINE_STATE = {
    loadedSodas: [], //list of sodas 
    inAdminState: undefined, //0 = user panel, 1 = admin panel
    sodaSelection: undefined, //hold soda obj
    isBusy: undefined, //flag to disable soda selection if machine is currently dispensing
};

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
        if(!MACHINE_STATE['isBusy']){
            updateStatusBar(["Selection: "+soda.name,"'"+soda.desc+"'","Cost: $"+soda.cost,"Quantity available: "+soda.maxQty]);
            MACHINE_STATE['sodaSelection'] = soda;
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
        MACHINE_STATE['loadedSodas'] = [];
        sodas.map(s=>{
            MACHINE_STATE['loadedSodas'].push(s);
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
    //TODO: implement soda json download to local fs (can do this last)
    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    // Start file download.
    download("soda.json",JSON.stringify(soda));
    console.log("soda downloaded!");
}

//this fn will decrement the soda maxQty from the database
function deductSodaQty(soda){
    //TODO: api/soda/update
    const params = {
        action: "DECREMENT",
        id: soda._id,
        
    }
    fetch(UPDATE_API, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: new URLSearchParams(params),
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
        if(!MACHINE_STATE['isBusy']){
            if(!MACHINE_STATE['sodaSelection']){
                updateStatusBar(["Please Select a Soda"]);  
            }else{
                sodaList = document.querySelector("#sodaList");
                sodaList.style.backgroundColor = "#188781";
                updateStatusBar(["Dispensing soda..."]);
                MACHINE_STATE['isBusy'] = true;
                await sleep(2000);
                //do stuff
                
                deductSodaQty(MACHINE_STATE['sodaSelection']);
                getSoda(MACHINE_STATE['sodaSelection']);

                updateStatusBar(["Thank You!"]);
                //stuff done
                sodaList.style.backgroundColor = "#20b2aa"
                await sleep(2000);
                updateStatusBar(["SELECT A DRINK"]);
                MACHINE_STATE['isBusy'] = false;
                MACHINE_STATE['sodaSelection'] = undefined;
            }
        }
    });
}

//add functionality to the admin btn
function setSwapBtn(){
    const swapBtn = document.querySelector("#swapBtn");
    swapBtn.addEventListener('click',()=>{
        swapMode(); 
        console.log(MACHINE_STATE['loadedSodas']); //TEMP
    });
}

function setStatusBtn(){
    const statusBtn = document.querySelector("#adminStatusBtn");
    statusBtn.addEventListener('click',()=>{
        
    });
}

function setUpdateBtn(){
    const updateBtn = document.querySelector("#adminUpdateBtn");
    updateBtn.addEventListener('click',()=>{
        
    });
}

function setAdminMachine(){
    console.log("setting admin machine");
    setStatusBtn();
    setUpdateBtn();
    
}

function handleLoad(){
    //init state
    document.querySelector("#userPanel").style.display = "none";
//    document.querySelector("#adminPanel").style.display = 'none';
    MACHINE_STATE['inAdminState'] = false;
    MACHINE_STATE['isBusy'] = false;
    
    //load machines
    loadSodas();
    setGetButton();
    
    setAdminMachine();
    setSwapBtn();
}

function swapMode(){
    const userPanel = document.querySelector("#userPanel");
    const adminPanel = document.querySelector("#adminPanel");
    const swapBtn = document.querySelector("#swapBtn");
    
    if(!MACHINE_STATE['inAdminState']){
        console.log("inAdminState?: ",MACHINE_STATE['inAdminState']); //USER PANEL
        
        //swap to admin panel
        userPanel.style.display = "none";
        adminPanel.style.display = "block";
        swapBtn.textContent = "USER";
        MACHINE_STATE['inAdminState'] = true;
        
    }else{
        console.log("inAdminState?: ",MACHINE_STATE['inAdminState']); //ADMIN PANEL
        
        //swap to user panel
        adminPanel.style.display = "none";
        userPanel.style.display = "block";
        swapBtn.textContent = "ADMIN";
        MACHINE_STATE['inAdminState'] = false;
    }
}

function main(){
    handleLoad();
}

document.addEventListener("DOMContentLoaded",main);