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

function putSoda(params){
    //put fetch request
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
//this fn will decrement the soda maxQty from the database
function deductSodaQty(soda){
    //TODO: api/soda/update
    putSoda({
        action: "DECREMENT",
        id: soda._id,
    });
//    const params = {
//        action: "DECREMENT",
//        id: soda._id,
//        
//    }
//    fetch(UPDATE_API, {
//      method: 'POST', // or 'PUT'
//      headers: {
//        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//      },
//      body: new URLSearchParams(params),
//    })
//    .then(response => response.json())
//    .then(data => {
//        loadSodas();
//        console.log('Success:', data);
//    })
//    .catch((error) => {
//        console.error('Error:', error);
//    });
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
//helper fn for the admin main panel
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
        panelArea.appendChild(document.createTextNode('================================='));
        panelArea.appendChild(document.createElement('br'));
        //if there are sodas with qty<10
        const limitedSodas = currSodas.filter(s=>{return s.maxQty<10});
        
        if(limitedSodas.length){
            panelArea.appendChild(document.createTextNode("RUNNING LOW (qty < 10)"));
            panelArea.appendChild(document.createElement('br'));
            limitedSodas.map(s=>{
                panelArea.appendChild(document.createTextNode('- '+s.name));
                panelArea.appendChild(document.createElement('br'));
                panelArea.appendChild(document.createTextNode(' only '+s.maxQty+" remaining"));
                panelArea.appendChild(document.createElement('br'));
                
            });
            panelArea.appendChild(document.createTextNode('================================='));
                panelArea.appendChild(document.createElement('br'));
            
        }
        panelArea.appendChild(document.createTextNode('SODA LIST'));
        panelArea.appendChild(document.createElement('br'));
        panelArea.appendChild(document.createElement('br'));
        
        currSodas.map(s=>{
           addSodaStatus(s); 
        });
        
        
    });
}
function handleAddFormBtn(evt){
    evt.preventDefault();
}
//adds a new soda to the DB
function addNewHandler(){
    clearChildren("#adminMain");
    const panelArea = document.querySelector("#adminMain");
    panelArea.appendChild(document.createTextNode('ADD NEW SODA'));
    panelArea.innerHTML += `<br><form method="POST" action="/api/soda/update">
						<p><label for="name">Product Name:</label> <input id="name" type="text" name="name" required></p>
						<p><label for="desc">Description:</label> <input id="desc" type="text" name="desc" required></p>
						<p><label for="cost">Cost:</label> <input id="cost" type="number" min='0' name="cost" required></p>
						<p><label for="maxQty">Max Qty:</label> <input type="number" id="maxQty" min='0' name="maxQty" required></p>
						<p><input id="addFormBtn" type="submit" value="Add"></p>
					</form>`;
    const addFormBtn = document.querySelector("#addFormBtn");
    addFormBtn.addEventListener('click',(evt)=>{
        evt.preventDefault();
        const name = document.querySelector('#name').value;
        const desc = document.querySelector('#desc').value;
        const cost = document.querySelector('#cost').value;
        const maxQty = document.querySelector('#maxQty').value;
        
        const curr = MACHINE_STATE['loadedSodas'];
        const existing = curr.filter(s=>{return s.name===name});
        
        if (name&&desc&&cost&&maxQty&&(existing.length===0)){
            console.log("sending req");
            //all inputs filled
            const params = {
                action: "ADD",
                name: name,
                desc: desc,
                cost: cost,
                maxQty: maxQty,
            }
            putSoda(params);
            clearChildren('#adminMain');
            panelArea.appendChild(document.createTextNode('SODA ADDED!'));
//            fetch(UPDATE_API, {
//              method: 'POST', // or 'PUT'
//              headers: {
//                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//              },
//              body: new URLSearchParams(params),
//            })
//            .then(response => response.json())
//            .then(data => {
//                loadSodas();
//                console.log('Success:', data);
//            })
//            .catch((error) => {
//                console.error('Error:', error);
//            });
//            
        }else{
            if(existing.length>0){
                console.log("product already exists");
            }else{
                console.log("missing inputs");
            }
        }
    });
}

//helper fn to lead into form section
function addExistingHelper(sodaName,curr){
    const sodaObj = curr.filter(s=>{return s.name===sodaName})[0];
    console.log(sodaObj);
    if(sodaObj){ 
        clearChildren("#adminMain");
        const panelArea = document.querySelector("#adminMain");
        panelArea.appendChild(document.createTextNode('UPDATE '+sodaObj.name));
        panelArea.appendChild(document.createElement('br'));
        panelArea.appendChild(document.createTextNode('==========================='));
        panelArea.appendChild(document.createElement('br'));
        
        panelArea.innerHTML += `<form>
            Name: `+sodaObj.name+`    
            <p><label for="desc">Description:</label> <input id="desc" type="text" name="desc" required></p>
            <p><label for="cost">Cost:</label> <input id="cost" type="number" min='0' name="cost" required></p>
            <p><label for="maxQty">Max Qty:</label> <input type="number" id="maxQty" min='0' name="maxQty" required></p>
            <p><input id="submitUpdateBtn" type="submit" value="Update"></p>
        </form>`;
        
        const desc = document.querySelector('#desc');
        const cost = document.querySelector('#cost');
        const maxQty = document.querySelector('#maxQty');

        desc.value = sodaObj.desc;
        cost.value = sodaObj.cost;
        maxQty.value = sodaObj.maxQty;
        
        document.querySelector('#submitUpdateBtn').addEventListener('click',()=>{
            if(desc.value && cost.value && maxQty.value){
                console.log("sending req");
                //all inputs filled
                const params = {
                    action: "UPDATE",
                    id: sodaObj._id,
                    name: sodaObj.name,
                    desc: desc.value,
                    cost: cost.value,
                    maxQty: maxQty.value,
                }
                putSoda(params);
//                fetch(UPDATE_API, {
//                  method: 'POST', // or 'PUT'
//                  headers: {
//                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//                  },
//                  body: new URLSearchParams(params),
//                })
//                .then(response => response.json())
//                .then(data => {
//                    loadSodas();
//                    console.log('Success:', data);
//                })
//                .catch((error) => {
//                    console.error('Error:', error);
//                });
            }
        });
    }
}

//adds a certain qty of an existing soda to DB
function addExistingHandler(){
    clearChildren("#adminMain");
    const panelArea = document.querySelector("#adminMain");
    panelArea.appendChild(document.createTextNode('ADD EXISTING SODA'));
    panelArea.appendChild(document.createElement('br'));
    panelArea.appendChild(document.createTextNode('==========================='));
    panelArea.appendChild(document.createElement('br'));
    
    const curr = MACHINE_STATE['loadedSodas'];
    let selectOptions = '';
    curr.map(s=>{
       selectOptions+='<option value='+s.name+'>'+s.name+'</option>'; 
    });
    
    panelArea.innerHTML += `<form method="POST" action="/api/soda/update">
        Select SODA to Update:<br><br>
        <select id="sodaName" name="sodaName">
            <option value=''>--</option>`+selectOptions+`
        </select>
        <input id="existingSelectBtn" type="submit" value="Edit Soda">
    </form>`;
    
    const existingSelectBtn = document.querySelector('#existingSelectBtn');
    existingSelectBtn.addEventListener('click',(evt)=>{
        evt.preventDefault();
        const sodaOption = document.querySelector('#sodaName').value;
        addExistingHelper(sodaOption,curr);
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
        clearChildren("#adminMain");
        
        //Add buttons
        const addNewBtn = document.createElement("button");
        addNewBtn.textContent = 'Add New Soda';
        addNewBtn.setAttribute('class','updateBtn');
        addNewBtn.addEventListener('click',addNewHandler);
        panelArea.appendChild(addNewBtn);
        
        panelArea.appendChild(document.createElement('br'));
        panelArea.appendChild(document.createElement('br'));
        
        const updateSodaBtn = document.createElement("button");
        updateSodaBtn.textContent = 'Add Existing Soda';
        updateSodaBtn.setAttribute('class','updateBtn');
        updateSodaBtn.addEventListener('click',addExistingHandler);
        panelArea.appendChild(updateSodaBtn);
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