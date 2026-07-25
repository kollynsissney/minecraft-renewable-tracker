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

// Items this browser tab just marked completed, so we can play a one-time
// "pop" animation on that row. Cleared automatically after the animation.
const justCompletedLocally = new Set();

// How long the "NEW" badge stays on a freshly-completed item before it fades away.
const NEW_BADGE_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

function isRecentlyCompleted(data) {
  return !!(data && data.completed && data.completedAt &&
    (Date.now() - data.completedAt < NEW_BADGE_DURATION_MS));
}

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

function rowHTML(item, category, isCompletedSection, toAnimate) {
  const data = trackerData[item] || {};
  const notes = data.notes || "";
  const justCompleted = toAnimate.has(item);
  const rowClass = "tracker-row"
    + (isCompletedSection ? " completed-row" : "")
    + (justCompleted ? " just-completed" : "");

  return `
    <div class="${rowClass}" data-item="${escapeHtml(item)}">
      <div class="item-name">
        ${item}
        ${isCompletedSection ? `<span class="category-tag">${category}</span>` : ""}
        ${isRecentlyCompleted(data) ? `<span class="new-badge">New</span>` : ""}
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
  // FIRST: while the old DOM is still in place, record where each item
  // about to move currently sits on screen.
  const toAnimate = new Set(justCompletedLocally);
  justCompletedLocally.clear();

  const firstRects = new Map();
  toAnimate.forEach(item => {
    const el = tracker.querySelector(`[data-item="${CSS.escape(item)}"]`);
    if (el) firstRects.set(item, el.getBoundingClientRect());
  });

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
        inner += rowHTML(item, category, false, toAnimate);
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
      inner += rowHTML(item, category, true, toAnimate);
    });

    box.innerHTML = inner;
    tracker.appendChild(box);
  }

  updateProgress();

  // LAST / INVERT / PLAY: for each item that moved, place it back at its
  // old on-screen spot with a transform (no visible jump), then let it
  // transition to its real resting position — the row itself travels
  // across the page instead of the page scrolling to it.
  toAnimate.forEach(item => {
    const el = tracker.querySelector(`[data-item="${CSS.escape(item)}"]`);
    const first = firstRects.get(item);
    if (!el || !first) return;

    const last = el.getBoundingClientRect();
    const dx = first.left - last.left;
    const dy = first.top - last.top;

    if (dx === 0 && dy === 0) return;

    el.style.position = "relative";
    el.style.zIndex = "5";
    el.style.transition = "none";
    el.style.transform = `translate(${dx}px, ${dy}px)`;

    // Force layout so the browser locks in the starting position above
    // before we animate away from it.
    void el.offsetHeight;

    el.style.transition = "transform 0.55s cubic-bezier(.22,.61,.36,1)";
    el.style.transform = "translate(0, 0)";

    el.addEventListener("transitionend", () => {
      el.style.transition = "";
      el.style.transform = "";
      el.style.position = "";
      el.style.zIndex = "";
    }, { once: true });
  });
}

// Started and Completed are mutually exclusive: checking one clears the other.
window.updateItem = function (item, type, value) {
  const updates = {};
  updates[type] = value;

  if (value) {
    const opposite = type === "started" ? "completed" : "started";
    updates[opposite] = false;
  }

  // Stamp (or clear) a timestamp whenever "completed" changes, so we know
  // when to stop showing the "NEW" badge.
  if (type === "completed") {
    updates.completedAt = value ? Date.now() : null;
  }

  if (type === "completed" && value) {
    justCompletedLocally.add(item);
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

// Nothing else may touch the data for hours at a time, so re-render every
// few minutes purely to let expired "NEW" badges drop off on their own.
setInterval(loadTracker, 5 * 60 * 1000);

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