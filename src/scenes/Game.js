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

    const platforms = this.physics.add.staticGroup();

    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(80, 400);
      const y = 150 * i;

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = platforms.create(x, y, "platform");
      platform.scale = 0.5;

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body;
      body.updateFromGameObject();
    }
  }
}
