const SODA_API = "http://localhost:3000/api/sodas";

//START CLASSES

class Soda{
    constructor(name,desc,cnt,maxQty){
        this.name = name;
        this.desc = desc;
        this.cnt = cnt;
        this.maxQty = maxQty;
    }
}

//END CLASSES

function addSoda(soda){
    const toAdd = document.createElement("div");
    toAdd.classList.add("soda");
    
    
}

function loadSodas(){
    fetch(SODA_API)
    .then(res=>{
        return res.json();
    })
    .then(sodas=>{
        console.log(sodas);
        sodas.map(s=>{
            
        });
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