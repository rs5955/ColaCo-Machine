const SODA_API = "http://localhost:3000/api/sodas";

class Soda{
    constructor()
}

function addSoda(soda){
    
}

function loadSodas(){
    fetch(SODA_API)
    .then(res=>{
        return res.json();
    })
    .then(data=>{
        console.log(data);
        
    });
    
    
    
}

function handleLoad(){
    //loads the sodas into the machine
    loadSodas();
    load
}

function main(){
    handleLoad();
    
}

document.addEventListener("DOMContentLoaded",main);