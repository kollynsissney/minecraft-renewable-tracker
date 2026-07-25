import { initializeApp } from 
"https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";


import {
    getDatabase,
    ref,
    set,
    onValue
} from 
"https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";



const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain: "minecraft-renewable-tracker.firebaseapp.com",

    databaseURL: "https://minecraft-renewable-tracker-default-rtdb.firebaseio.com/",

    projectId: "minecraft-renewable-tracker",

    storageBucket: "minecraft-renewable-tracker.firebasestorage.app",

    messagingSenderId: "1047531306156",

    appId: "YOUR_APP_ID"

};



const app = initializeApp(firebaseConfig);

const database = getDatabase(app);




const items = {


Farming: [
    "Wheat", "Wheat Seeds", "Carrot", "Potato", "Beetroot", "Beetroot Seeds",
    "Melon", "Melon Seeds", "Pumpkin", "Pumpkin Seeds", "Sugar Cane",
    "Cactus", "Bamboo", "Cocoa Beans", "Nether Wart", "Sweet Berries",
    "Glow Berries", "Chorus Fruit", "Chorus Flower", "Kelp", "Sea Pickle",
    "Red Mushroom", "Brown Mushroom", "Saplings",
    "Azalea", "Flowering Azalea", "Moss Block", "Moss Carpet",
    "Vines", "Twisting Vines", "Weeping Vines", "Nether Sprouts",
    "Big Dripleaf", "Small Dripleaf", "Torchflower", "Torchflower Seeds",
    "Pitcher Plant", "Pitcher Pod", "Grass Block",
    "Tall Grass", "Fern", "Flowers", "Wither Rose", "Sugar",
  ],
 
  "Animal drops": [
    "Iron", "Egg", "Feather", "Chicken", "Cooked Chicken",
    "Milk", "Beef", "Cooked Beef", "Leather",
    "Wool", "Mutton", "Porkchop",
    "Rabbit Hide", "Rabbit Meat", "Rabbit's Foot",
    "Honey Bottle", "Honeycomb",
    "Suspicious Stew", "Mushroom Stew",
    "Sniffer Egg", "Armadillo Scute", "Cod", "Salmon", "Pufferfish", "Tropical Fish", "Frog Lights"
  ],
 
  "Mob drops": [
    "String", "Spider Eye", "Gunpowder", "Bone", "Bone Meal",
    "Rotten Flesh", "Ender Pearl", "Blaze Rod", "Slimeball",
    "Magma Cream", "Ink Sac", "Glow Ink Sac", "Phantom Membrane",
    "Shulker Shell", "Totem of Undying", "Emerald", "Prismarine Shard",
    "Prismarine Crystals", "Nautilus Shell", "Trident",
    "Wither Skeleton Skull", "Mob Heads", "Ghast Tear",
    "Glowstone Dust", "Music Discs",
  ],
 

  "Nautrally Generating Blocks": [
    "Cobblestone", "Stone", "Obsidian", "Ice",
    "Packed Ice", "Blue Ice", "Snow Layers", "Powder Snow",
    "Mycelium", "Grass Block", "Sculk", "Sculk Vein",
    "Sculk Sensor", "Sculk Shrieker", "Resin", "Gravity Blocks"
  ],
 
  "Boss Drops": [
    "Nether Star", "Dragon Breath",
  ],
};




let trackerData = {};

const tracker = document.getElementById("tracker");




function loadTracker(){


tracker.innerHTML="";



for(let category in items){


let box=document.createElement("div");

box.className="category";



box.innerHTML=`

<h2>${category}</h2>


<div class="tracker-header">

<div>Item</div>

<div class="started-header">
Started
</div>

<div class="completed-header">
Completed
</div>

</div>

`;



items[category].forEach(item=>{


let data = trackerData[item] || {};



box.innerHTML += `


<div class="tracker-row">


<div class="item-name">
${item}
</div>



<div class="started-box">

<input 
type="checkbox"

${data.started ? "checked":""}

onchange="updateItem('${item}','started',this.checked)"

>

</div>



<div class="completed-box">

<input 
type="checkbox"

${data.completed ? "checked":""}

onchange="updateItem('${item}','completed',this.checked)"

>

</div>


</div>


`;



});



tracker.appendChild(box);


}



updateProgress();


}






window.updateItem=function(item,type,value){


set(

ref(database,`items/${item}/${type}`),

value

);


};






onValue(

ref(database,"items"),

snapshot=>{


trackerData=snapshot.val() || {};

loadTracker();


}

);



function updateProgress(){


let total=0;

let completed=0;



for(let category in items){


items[category].forEach(item=>{


total++;


if(trackerData[item]?.completed)

completed++;



});


}



let percent = total ? completed/total*100 : 0;



document.getElementById("progress-bar").style.width =
percent+"%";



document.getElementById("progress-text").innerHTML =
`${completed} / ${total} Items Completed`;



}






window.searchItems=function(){


let text=document
.getElementById("search")
.value
.toLowerCase();



document.querySelectorAll(".tracker-row")
.forEach(row=>{


row.style.display =
row.innerText.toLowerCase().includes(text)
?"grid"
:"none";


});


};