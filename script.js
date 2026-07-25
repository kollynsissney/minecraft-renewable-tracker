
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { 
    getDatabase,
    ref,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyCn6dgpN_Ed-HxBI5ODghMuu0-I3rF44Oo",
    authDomain: "minecraft-renewable-tracker.firebaseapp.com",
    databaseURL: "https://minecraft-renewable-tracker-default-rtdb.firebaseio.com/",
    projectId: "minecraft-renewable-tracker",
    storageBucket: "minecraft-renewable-tracker.firebasestorage.app",
    messagingSenderId: "1047531306156",
    appId: "1:1047531306156:web:4a2ce8f08e1516e946f309",
    measurementId: "G-YWP0VJ226X"
};


const app = initializeApp(firebaseConfig);

const database = getDatabase(app);


const items = {

 farming: [
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
 
  animalBreedingAndDrops: [
    "Egg", "Feather", "Chicken", "Cooked Chicken",
    "Milk", "Beef", "Cooked Beef", "Leather",
    "Wool", "Mutton", "Porkchop",
    "Rabbit Hide", "Rabbit Meat", "Rabbit's Foot",
    "Honey Bottle", "Honeycomb",
    "Suspicious Stew", "Mushroom Stew",
    "Sniffer Egg", "Armadillo Scute", "Cod", "Salmon", "Pufferfish", "Tropical Fish",
  ],
 
  mobDrops: [
    "String", "Spider Eye", "Gunpowder", "Bone", "Bone Meal",
    "Rotten Flesh", "Ender Pearl", "Blaze Rod", "Slimeball",
    "Magma Cream", "Ink Sac", "Glow Ink Sac", "Phantom Membrane",
    "Shulker Shell", "Totem of Undying", "Emerald", "Prismarine Shard",
    "Prismarine Crystals", "Nautilus Shell", "Trident",
    "Wither Skeleton Skull", "Mob Heads", "Ghast Tear",
    "Glowstone Dust", "Music Discs",
  ],
 

  naturalBlockGeneration: [
    "Cobblestone", "Stone", "Obsidian", "Ice",
    "Packed Ice", "Blue Ice", "Snow Layers", "Powder Snow",
    "Mycelium", "Grass Block", "Sculk", "Sculk Vein",
    "Sculk Sensor", "Sculk Shrieker",
  ],
 
  bossDrops: [
    "Nether Star", "Dragon Breath",
  ],
};
 

let completedItems = {};



const tracker =
document.getElementById("tracker");



function loadTracker(){


tracker.innerHTML="";


for(let category in items){


let box=document.createElement("div");

box.className="category";


box.innerHTML=
`<h2>${category}</h2>`;



items[category].forEach(item=>{


let checked =
completedItems[item] || false;



box.innerHTML += `

<div class="item">

<input 
type="checkbox"
${checked ? "checked":""}
onchange="saveItem('${item}',this.checked)"
>

${item}

</div>

`;



});



tracker.appendChild(box);


}



updateProgress();


}






window.saveItem = function(item, value){

    console.log("Saving:", item, value);

    set(
        ref(database, "items/" + item),
        value
    );

};







onValue(
ref(database,"items"),
(snapshot)=>{


completedItems =
snapshot.val() || {};


loadTracker();


}

);







window.resetTracker=function(){


if(confirm("Reset everything?")){


for(let category in items){


items[category].forEach(item=>{


set(
ref(database,"items/"+item),
false
);


});


}


}


};









function updateProgress(){


let total=0;

let complete=0;



for(let category in items){


items[category].forEach(item=>{


total++;


if(completedItems[item]){

complete++;

}


});


}



let percent =
(total === 0)
?0
:(complete/total)*100;



document.getElementById("progress-bar")
.style.width =
percent+"%";



document.getElementById("progress-text")
.innerHTML =
`${complete} / ${total} Items Completed`;



}








window.searchItems=function(){


let text =
document
.getElementById("search")
.value
.toLowerCase();



document.querySelectorAll(".item")
.forEach(item=>{


if(
item.innerText
.toLowerCase()
.includes(text)
)

item.style.display="block";


else

item.style.display="none";


});


};