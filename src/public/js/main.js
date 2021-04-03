const SODA_API = "http://localhost:3000/api/sodas";


function test(){
    console.log("HERE");
}

function addSoda(soda){
    const toAdd = document.createElement("div");
    toAdd.classList.add("soda");
    toAdd.textContent = "Hey";
    toAdd.addEventListener("click",()=>{
        console.log("here");
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

function loadUserInput(){
    console.log("Here");
    
}

function handleLoad(){
    //loads the sodas into the machine
    loadSodas();
    loadUserInput();
}

function main(){
    handleLoad();
    
}

document.addEventListener("DOMContentLoaded",main);