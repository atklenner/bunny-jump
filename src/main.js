import Phaser from "./lib/phaser.js";

let node = document.createElement("h1");
node.textContent = Phaser.toString();

let body = document.querySelector("body");
body.appendChild(node);
