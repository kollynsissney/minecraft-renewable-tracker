
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

    "🌱 Crops & Plants": [
        "Wheat",
        "Wheat Seeds",
        "Carrots",
        "Potatoes",
        "Beetroot",
        "Beetroot Seeds",
        "Pumpkin",
        "Melon",
        "Melon Seeds",
        "Sugar Cane",
        "Bamboo",
        "Cactus",
        "Cocoa Beans",
        "Nether Wart",
        "Sweet Berries",
        "Glow Berries",
        "Torchflower Seeds",
        "Pitcher Pods",
        "Kelp",
        "Sea Pickle",
        "Moss Block",
        "Moss Carpet",
        "Vines",
        "Cave Vines",
        "Weeping Vines",
        "Twisting Vines",
        "Azalea",
        "Flowering Azalea",
        "Spore Blossom"
    ],


    "🌲 Trees & Wood": [
        "Oak Log",
        "Spruce Log",
        "Birch Log",
        "Jungle Log",
        "Acacia Log",
        "Dark Oak Log",
        "Mangrove Log",
        "Cherry Log",
        "Pale Oak Log",
        "Crimson Stem",
        "Warped Stem",
        "Oak Sapling",
        "Spruce Sapling",
        "Birch Sapling",
        "Jungle Sapling",
        "Acacia Sapling",
        "Dark Oak Sapling",
        "Mangrove Propagule",
        "Cherry Sapling",
        "Pale Oak Sapling"
    ],


    "🐄 Passive Mob Farms": [
        "Leather",
        "Beef",
        "Wool",
        "Mutton",
        "Porkchop",
        "Chicken",
        "Feathers",
        "Eggs",
        "Rabbit Hide",
        "Rabbit Foot",
        "Rabbit",
        "Milk",
        "Honey",
        "Honeycomb",
        "Ink Sac",
        "Glow Ink Sac",
        "Scute",
        "Turtle Egg",
        "Goat Horn",
        "Frogspawn",
        "Froglight"
    ],


    "👹 Hostile Mob Farms": [
        "Rotten Flesh",
        "Bones",
        "Bone Meal",
        "Arrows",
        "String",
        "Spider Eye",
        "Gunpowder",
        "Ender Pearl",
        "Slimeball",
        "Blaze Rod",
        "Blaze Powder",
        "Magma Cream",
        "Ghast Tear",
        "Wither Skeleton Skull",
        "Coal",
        "Phantom Membrane",
        "Shulker Shell",
        "Wind Charge",
        "Breeze Rod",
        "Trident"
    ],


    "⛏ Block Generators": [
        "Cobblestone",
        "Stone",
        "Smooth Stone",
        "Mossy Cobblestone",
        "Cobbled Deepslate",
        "Basalt",
        "Blackstone",
        "Obsidian",
        "Lava",
        "Water",
        "Ice",
        "Packed Ice",
        "Blue Ice",
        "Snow",
        "Snow Block",
        "Clay",
        "Mud",
        "Dripstone",
        "Sand",
        "Red Sand",
        "Gravel"
    ],


    "🔥 Nether Resources": [
        "Netherrack",
        "Soul Sand",
        "Soul Soil",
        "Nether Brick",
        "Quartz",
        "Quartz Block",
        "Glowstone",
        "Magma Block",
        "Crimson Fungus",
        "Warped Fungus"
    ],


    "💎 Villager Trading": [
        "Emerald",
        "Enchanted Books",
        "Name Tag",
        "Saddle",
        "Glass",
        "Redstone Dust",
        "Glowstone Dust",
        "Diamond Tools",
        "Diamond Armor",
        "Maps"
    ],


    "🔴 Redstone Materials": [
        "Redstone Dust",
        "Glowstone Dust",
        "Quartz",
        "Iron",
        "Iron Nuggets",
        "Gold",
        "Gold Nuggets",
        "Copper",
        "Slimeball",
        "Honey",
        "Honeycomb",
        "Amethyst Shard"
    ],


    "🧪 Brewing": [
        "Nether Wart",
        "Blaze Powder",
        "Sugar",
        "Spider Eye",
        "Fermented Spider Eye",
        "Rabbit Foot",
        "Pufferfish",
        "Magma Cream",
        "Ghast Tear",
        "Golden Carrot",
        "Glistering Melon",
        "Phantom Membrane"
    ],


    "🎣 Fishing & Ocean": [
        "Cod",
        "Salmon",
        "Tropical Fish",
        "Pufferfish",
        "Nautilus Shell",
        "Fishing Rod",
        "Name Tag",
        "Saddle"
    ],


    "🏗 Building Materials": [
        "Glass",
        "Glass Pane",
        "Brick",
        "Stone Brick",
        "Mossy Stone Brick",
        "Granite",
        "Diorite",
        "Andesite",
        "Prismarine",
        "Prismarine Shard",
        "Prismarine Crystal",
        "Dark Prismarine",
        "Calcite",
        "Tuff",
        "Tuff Brick",
        "Amethyst Block"
    ],


    "⭐ Rare Renewables": [
        "Totem of Undying",
        "Elytra",
        "Shulker Shell",
        "Shulker Box",
        "Dragon Breath",
        "Dragon Egg",
        "End Crystal",
        "Nether Star",
        "beacon"
    ]

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