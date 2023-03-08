import Phaser from "../lib/phaser.js";

export default class Game extends Phaser.Scene {
  constructor() {
    // this gives the scene a unique key
    super("game");
  }

  preload() {
    this.load.image("background", "assets/bg_layer1.png");

    // load platform image
    this.load.image("platform", "assets/ground_grass.png");
  }

  create() {
    this.add.image(240, 320, "background");

    // put platform in the middle
    this.add.image(240, 320, "platform").setScale(0.5);
  }
}
