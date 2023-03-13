import Phaser from "./lib/phaser.js";

import Game from "./scenes/Game.js";
import GameOver from "./scenes/GameOver.js";

// Main controller for the entire game, loads a bunch of stuff, don't mess with it beyond the config
export default new Phaser.Game({
  // choose the renderer, WebGL or Canvas, Auto picks for you and chooses WebGL over canvas
  type: Phaser.AUTO,
  // sets the width of your game window thing
  width: 480,
  // sets the height of your game window thing
  height: 640,
  // passes all of the scenes to the Phaser.Game instance
  scene: [Game, GameOver],
  // passes the physics config to the Phaser.Game instance
  physics: {
    // sets the physics system, choose from arcade, impact, or matter
    default: "arcade",
    // passes the arcade physics config
    arcade: {
      // sets the acceleration of gravity in the game
      gravity: {
        y: 200,
      },
      // shows the little boxes around everything so you can see transparencies
      debug: true,
    },
  },
});
