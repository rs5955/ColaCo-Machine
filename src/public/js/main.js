const SODA_API = "api/sodas";
const UPDATE_API = "api/soda/update";

//object to hold state of machine and any global variables
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

//update the text inside the status bar
function updateStatusBar(content){
    console.log(...content); //an array
    clearChildren("#statusBar")
    const statusBar = document.querySelector("#statusBar");
    
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

//ADMIN BUTTON FUNCTIONALITY
//update the text inside the admin panel
//function updateAdminMain(content){
//    console.log(...content); //an array
//    clearChildren("#adminMain")
//    const adminMain = document.querySelector("#adminMain");
//    
//    content.map(line=>{
//        if (typeof line === 'string' || line instanceof String){
//            const newNode = document.createTextNode(line);
//            adminMain.appendChild(newNode);
//        }else{
//            /* 
//            
//            eg.
//            {
//                element: p,
//                text: zzz, //optional
//            }
//            */
//            const newNode = document.createElement(line['element']);
//            console.log(line['element']===undefined);
//            if(line['element']!==undefined){
//                newNode.appendChild(document.createTextNode(line['text']));
//            }else{
//                console.log("TEST");
//            }
//            adminMain.appendChild(newNode);   
//        }
//        
//    });
//}
//this fn is for the admin main panel only
function addSodaStatus(soda){
    const panelArea = document.querySelector("#panelArea");
    const toAdd = document.createElement("p");
    toAdd.appendChild(document.createTextNode("Name: "+soda.name));
    toAdd.appendChild(document.createElement('br'));
    toAdd.appendChild(document.createTextNode("Description: "+soda.desc));
    toAdd.appendChild(document.createElement('br'));
    toAdd.appendChild(document.createTextNode("Cost: "+soda.cost));
    toAdd.appendChild(document.createElement('br'));
    toAdd.appendChild(document.createTextNode("Qty: "+soda.maxQty));
    toAdd.appendChild(document.createElement('br'));
    toAdd.appendChild(document.createElement('br'));
    panelArea.appendChild(toAdd);
}

function setStatusBtn(){
    const statusBtn = document.querySelector("#adminStatusBtn");
    const adminMain = document.querySelector("#adminMain");
//    const panelArea = document.querySelector("#adminMain");

    statusBtn.addEventListener('click',()=>{
        const currSodas = MACHINE_STATE['loadedSodas'];
        console.log("clicked");
        
        
        clearChildren("#adminMain");
        const panelArea = document.createElement('div');
        panelArea.setAttribute('id','panelArea');
        panelArea.style.textAlign = 'left';
        panelArea.style.padding = '10px';
        
        adminMain.appendChild(panelArea);
        panelArea.appendChild(document.createTextNode('STATUS: ONLINE'));
        panelArea.appendChild(document.createElement('br'));
        panelArea.appendChild(document.createElement('br'));
//        addSodaStatus(currSodas[0]);
        currSodas.map(s=>{
           addSodaStatus(s); 
        });
        
        
    });
}

function setUpdateBtn(){
    const updateBtn = document.querySelector("#adminUpdateBtn");
    const panelArea = document.querySelector("#adminMain");
    
    updateBtn.addEventListener('click',()=>{
        //TODO: implement two options:
        //A) Update existing soda
        //B) Add new soda
        
        //.....
    });
}

function setAdminMachine(){
    console.log("setting admin machine");
    setStatusBtn();
    setUpdateBtn();
    
}
//END ADMIN BUTTON FUNCTIONALITY

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
        clearChildren('#adminMain');
        MACHINE_STATE['inAdminState'] = false;
    }
}

function main(){
    handleLoad();
    //do anything required
}

document.addEventListener("DOMContentLoaded",main);