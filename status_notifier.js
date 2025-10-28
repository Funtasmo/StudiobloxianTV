// Roblox Status Notifier
// Node.js script with rotating quotes and live status
// Run with Node.js. Uses presence API and console display.

import fetch from "node-fetch";

// ---------------- CONFIG ----------------
const USER_ID = 1; // <-- put your Roblox numeric user ID here
const CHECK_INTERVAL = 10 * 1000;       // poll presence every 10 seconds
const QUOTE_INTERVAL = 5 * 60 * 1000;   // rotate quote every 5 minutes

// status icons
const ICONS = {
  Offline: "🔴 Offline",
  Online: "🔵 Online",
  InStudio: "🟠 In Studio",
  InGame: "🟢 In Game",
  Invisible: "🟣 Invisible"
};

// your quote list
const QUOTES = [
  "Every session of Roblox is another day.\nYet every single one sparks my imagination, better than before.",
  "A simple idea turned into an inspiring game engine.\nDidn't it play so well?",
  "Wow, look at how this place has aged.\nFive years of building games and how it's evolved so much...\nYet I still miss 2020.",
  "A universe made of dreams, inspirations, and experiences.\nWe're all in it right now.",
  "Some just call this platform a game.\nI would call it freedom of creativity.",
  "I've equipped my tools and I'm READY TO RUMBLE!",
  "Even the tiniest parts can create the biggest universe.\nBuild something today! It helps creativity.",
  "Online today, geared up tommorrow.\nRoblox is just that way.",
  "In Studio, crafting a lot of stuff.\nIt might be something to do with BORK or just... something else.",
  "Offline right now, but my imagination never sleeps.",
  "If something looks cool, join it!\nYou never know if you like it or not."
];

// ---------------- VARIABLES ----------------
let currentQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
let lastQuoteChange = Date.now();

// ---------------- HELPERS ----------------
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function getPresence(userId) {
  try {
    const res = await fetch(`https://presence.roblox.com/v1/presence/users?userIds=${userId}`);
    if (!res.ok) throw new Error(`Presence request failed: ${res.status}`);
    const data = await res.json();
    return data.userPresences?.[0]?.presenceType || "Unknown";
  } catch (err) {
    console.error("Error fetching presence:", err.message);
    return "Unknown";
  }
}

// ---------------- MAIN LOOP ----------------
async function loop() {
  try {
    const presence = await getPresence(USER_ID);
    const now = Date.now();

    // rotate quote every QUOTE_INTERVAL
    if (now - lastQuoteChange > QUOTE_INTERVAL) {
      currentQuote = randomFrom(QUOTES);
      lastQuoteChange = now;
    }

    const icon = ICONS[presence] || "❓ Unknown";
    console.clear();
    console.log(`${icon}\n${currentQuote}`);
  } catch (err) {
    console.error("Loop error:", err.message);
  } finally {
    setTimeout(loop, CHECK_INTERVAL);
  }
}

// start
loop();
