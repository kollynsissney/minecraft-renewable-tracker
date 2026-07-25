import { 
    ref,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


const items = {


"Crops":[

"Wheat",
"Carrots",
"Potatoes",
"Beetroot",
"Pumpkin",
"Melon",
"Sugar Cane",
"Bamboo",
"Cactus",
"Cocoa Beans",
"Nether Wart"

],



"Trees":[

"Oak Log",
"Spruce Log",
"Birch Log",
"Jungle Log",
"Acacia Log",
"Dark Oak Log",
"Mangrove Log",
"Cherry Log",
"Crimson Stem",
"Warped Stem"

],



"Animal Farms":[

"Leather",
"Beef",
"Mutton",
"Wool",
"Eggs",
"Chicken",
"Porkchop",
"Honey",
"Honeycomb"

],



"Mob Farms":[

"Rotten Flesh",
"Bones",
"Arrows",
"Gunpowder",
"String",
"Spider Eye",
"Ender Pearl",
"Blaze Rod",
"Slimeball"

],



"Villagers":[

"Emerald",
"Enchanted Books",
"Name Tags",
"Diamond Tools",
"Diamond Armor"

],



"Block Farms":[

"Cobblestone",
"Stone",
"Basalt",
"Obsidian",
"Lava",
"Snowballs"

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






window.saveItem=function(item,value){



set(
ref(database,"items/"+item),
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