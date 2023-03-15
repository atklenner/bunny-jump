import Phaser from "../lib/phaser.js";

// this is just extending the Sprite object, not really doing anything
// this is probably better form for future projects where you will do more
export default class Carrot extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    this.setScale(0.5);
  }
}
