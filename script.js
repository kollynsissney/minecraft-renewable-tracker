import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
  update,
  onValue
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

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

  "Animal Drops": [
    "Iron", "Egg", "Feather", "Chicken", "Cooked Chicken",
    "Milk", "Beef", "Cooked Beef", "Leather",
    "Wool", "Mutton", "Porkchop",
    "Rabbit Hide", "Rabbit Meat", "Rabbit's Foot",
    "Honey Bottle", "Honeycomb",
    "Suspicious Stew", "Mushroom Stew",
    "Sniffer Egg", "Armadillo Scute", "Cod", "Salmon", "Pufferfish", "Tropical Fish", "Frog Lights"
  ],

  "Mob Drops": [
    "String", "Spider Eye", "Gunpowder", "Bone", "Bone Meal",
    "Rotten Flesh", "Ender Pearl", "Blaze Rod", "Slimeball",
    "Magma Cream", "Ink Sac", "Glow Ink Sac", "Phantom Membrane",
    "Shulker Shell", "Totem of Undying", "Emerald", "Prismarine Shard",
    "Prismarine Crystals", "Nautilus Shell", "Trident",
    "Wither Skeleton Skull", "Mob Heads", "Ghast Tear",
    "Glowstone Dust", "Music Discs",
  ],

  "Naturally Generating Blocks": [
    "Cobblestone", "Stone", "Obsidian", "Ice",
    "Packed Ice", "Blue Ice", "Snow Layers", "Powder Snow",
    "Mycelium", "Grass Block", "Sculk", "Sculk Vein",
    "Sculk Sensor", "Sculk Shrieker", "Resin", "Gravity Blocks"
  ],

  "Boss Drops": [
    "Nether Star", "Dragon Breath",
  ],
};

const categoryIcons = {
  "Farming": "🌾",
  "Animal Drops": "🐄",
  "Mob Drops": "💀",
  "Naturally Generating Blocks": "⛰️",
  "Boss Drops": "👑"
};

let trackerData = {};
const tracker = document.getElementById("tracker");

// Basic escaping so notes text can't break the row's HTML
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function headerRowHTML() {
  return `
    <div class="tracker-header">
      <div>Item</div>
      <div>Notes</div>
      <div class="started-header">Started</div>
      <div class="completed-header">Completed</div>
    </div>
  `;
}

function rowHTML(item, category, isCompletedSection) {
  const data = trackerData[item] || {};
  const notes = data.notes || "";
  const rowClass = "tracker-row" + (isCompletedSection ? " completed-row" : "");

  return `
    <div class="${rowClass}">
      <div class="item-name">
        ${item}
        ${isCompletedSection ? `<span class="category-tag">${category}</span>` : ""}
      </div>

      <div class="notes-box">
        <input
          type="text"
          class="notes-input"
          placeholder="Add a note..."
          value="${escapeHtml(notes)}"
          onchange="updateNotes('${item}', this.value)"
        >
      </div>

      <div class="started-box">
        <input
          type="checkbox"
          ${data.started ? "checked" : ""}
          onchange="updateItem('${item}','started',this.checked)"
        >
      </div>

      <div class="completed-box">
        <input
          type="checkbox"
          ${data.completed ? "checked" : ""}
          onchange="updateItem('${item}','completed',this.checked)"
        >
      </div>
    </div>
  `;
}

function loadTracker() {
  tracker.innerHTML = "";
  const completedItems = [];

  for (let category in items) {
    const activeItems = items[category].filter(item => !trackerData[item]?.completed);

    items[category].forEach(item => {
      if (trackerData[item]?.completed) {
        completedItems.push({ item, category });
      }
    });

    const box = document.createElement("div");
    box.className = "category";

    let inner = `<h2>${categoryIcons[category] || "📦"} ${category}</h2>`;

    if (activeItems.length === 0) {
      inner += `<p class="empty-msg">🎉 All items in this category are done!</p>`;
    } else {
      inner += headerRowHTML();
      activeItems.forEach(item => {
        inner += rowHTML(item, category, false);
      });
    }

    box.innerHTML = inner;
    tracker.appendChild(box);
  }

  if (completedItems.length > 0) {
    const box = document.createElement("div");
    box.className = "category completed-category";

    let inner = `<h2>✅ Completed (${completedItems.length})</h2>`;
    inner += headerRowHTML();
    completedItems.forEach(({ item, category }) => {
      inner += rowHTML(item, category, true);
    });

    box.innerHTML = inner;
    tracker.appendChild(box);
  }

  updateProgress();
}

// Started and Completed are mutually exclusive: checking one clears the other.
window.updateItem = function (item, type, value) {
  const updates = {};
  updates[type] = value;

  if (value) {
    const opposite = type === "started" ? "completed" : "started";
    updates[opposite] = false;
  }

  update(ref(database, `items/${item}`), updates);
};

// Saved on blur (onchange), not on every keystroke, so typing isn't
// interrupted by the full-list re-render triggered by onValue below.
window.updateNotes = function (item, value) {
  set(ref(database, `items/${item}/notes`), value);
};

onValue(ref(database, "items"), snapshot => {
  trackerData = snapshot.val() || {};
  loadTracker();
});

function updateProgress() {
  let total = 0;
  let completed = 0;

  for (let category in items) {
    items[category].forEach(item => {
      total++;
      if (trackerData[item]?.completed) completed++;
    });
  }

  const percent = total ? (completed / total * 100) : 0;

  document.getElementById("progress-bar").style.width = percent + "%";
  document.getElementById("progress-text").innerHTML =
    `${completed} / ${total} Items Completed`;
}

window.searchItems = function () {
  const text = document.getElementById("search").value.toLowerCase();

  document.querySelectorAll(".tracker-row").forEach(row => {
    const name = row.querySelector(".item-name").childNodes[0].textContent.toLowerCase();
    const noteInput = row.querySelector(".notes-input");
    const note = noteInput ? noteInput.value.toLowerCase() : "";
    const match = name.includes(text) || note.includes(text);
    row.style.display = match ? "grid" : "none";
  });
};