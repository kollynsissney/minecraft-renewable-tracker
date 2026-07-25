const items = {

    "Crops": [
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


    "Trees": [
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


    "Animal Farms": [
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


    "Mob Farms": [
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


    "Villager Trading": [
        "Emerald",
        "Enchanted Books",
        "Name Tags",
        "Diamond Tools",
        "Diamond Armor"
    ],


    "Block Farms": [
        "Cobblestone",
        "Stone",
        "Basalt",
        "Obsidian",
        "Lava",
        "Snowballs"
    ]

};



const tracker = document.getElementById("tracker");


import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyCn6dgpN_Ed-HxBI5ODghMuu0-I3rF44Oo",
  authDomain: "minecraft-renewable-tracker.firebaseapp.com",
  projectId: "minecraft-renewable-tracker",
  storageBucket: "minecraft-renewable-tracker.firebasestorage.app",
  messagingSenderId: "1047531306156",
  appId: "1:1047531306156:web:4a2ce8f08e1516e946f309",
  measurementId: "G-YWP0VJ226X"
};



function loadTracker(){

    tracker.innerHTML = "";


    for(let category in items){


        let categoryDiv = document.createElement("div");

        categoryDiv.className = "category";


        categoryDiv.innerHTML =
        `<h2>${category}</h2>`;


        items[category].forEach(item => {


            let checked =
            localStorage.getItem(item) === "true";


            categoryDiv.innerHTML += `

            <div class="item">

            <input 
            type="checkbox"
            ${checked ? "checked" : ""}
            onchange="saveItem('${item}', this.checked)"
            >

            ${item}

            </div>

            `;


        });


        tracker.appendChild(categoryDiv);


    }


    updateProgress();

}





function saveItem(item, value){

    database.ref("items/" + item).set(value);

    updateProgress();

}





function updateProgress(){


    let total = 0;

    let completed = 0;



    for(let category in items){


        items[category].forEach(item=>{


            total++;


            if(localStorage.getItem(item)==="true"){

                completed++;

            }


        });


    }



    let percent = 0;


    if(total > 0){

        percent = (completed / total) * 100;

    }



    document.getElementById("progress-bar")
    .style.width = percent + "%";



    document.getElementById("progress-text")
    .innerHTML =
    `${completed} / ${total} Items Completed`;

}





function resetTracker(){


    let confirmReset =
    confirm("Are you sure you want to reset everything?");


    if(confirmReset){

        localStorage.clear();

        loadTracker();

    }


}





function searchItems(){


    let search =
    document.getElementById("search")
    .value
    .toLowerCase();



    document.querySelectorAll(".item")
    .forEach(item=>{


        if(item.innerText.toLowerCase().includes(search)){

            item.style.display="block";

        }

        else{

            item.style.display="none";

        }


    });


}





loadTracker();