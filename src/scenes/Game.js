import Phaser from "../lib/phaser.js";
import Carrot from "../game/Carrot.js";

// we extend the base Phaser.Scene class to create our own
export default class Game extends Phaser.Scene {
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /** @type {Phaser.Physics.Arcade.staticGroup}*/
  platforms;

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;

  /** @type {Phaser.Physics.Arcade.Group} */
  carrots;

  carrotsCollected = 0;

  carrotsCollectedText;

  constructor() {
    // this gives the scene a unique key
    super("game");
  }

  // the next three methods are called to setup the scene when it is being used

  // this method is called before preload and create
  init() {
    // initialize the count, this is done here to reset the count when reseting the game
    this.carrotsCollected = 0;
  }

  // called before create, used to load assets
  preload() {
    // this.load is a loader plugin that handles images, sounds, textures, and other data
    // preload is the place to do this loading, if you do it elsewhere you have to
    // start the Loader yourself
    this.load.image("background", "assets/bg_layer1.png");
    this.load.image("platform", "assets/ground_grass.png");
    this.load.image("bunny-stand", "assets/bunny1_stand.png");
    this.load.image("bunny-jump", "assets/bunny1_jump.png");
    this.load.image("carrot", "assets/carrot.png");

    // this.input is an Input Plugin, this.input.keyboard is the keyboard plugin
    // the createCursorKeys method returns the arrow keys, shift, and space that we can use
    // to check if they are being pressed
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  // called last when the scene starts, used to create the actual game objects used in this scene
  create() {
    // this.add is a game object factory, lets us add objects to a scene easily, here we
    // add an image, the scroll factor is set on the image
    // a scroll factor of 0 means the image doesn't move, 1 means it moves exactly with the camera
    this.add.image(240, 320, "background").setScrollFactor(1, 0);

    this.platforms = this.physics.add.staticGroup();

    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(80, 400);
      const y = 150 * i;

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, "platform");
      platform.scale = 0.5;

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body;
      body.updateFromGameObject();
    }

    this.player = this.physics.add
      .sprite(240, 320, "bunny-stand")
      .setScale(0.5);

    this.physics.add.collider(this.platforms, this.player);

    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.right = false;
    this.player.body.checkCollision.left = false;

    this.cameras.main.startFollow(this.player);

    this.cameras.main.setDeadzone(this.scale.width * 1.5);

    this.carrots = this.physics.add.group({ classType: Carrot });

    this.physics.add.collider(this.platforms, this.carrots);

    // run handleCollectCarrot when player and carrots overlap
    this.physics.add.overlap(
      this.player,
      this.carrots,
      this.handleCollectCarrot,
      undefined,
      this
    );

    // add text that keeps track of the score for the user
    const style = { color: "#000", fontSize: 24 };
    this.carrotsCollectedText = this.add
      .text(240, 10, "Carrots: 0", style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);
  }

  // this method is run once per frame when the scene is running
  update() {
    const touchingDown = this.player.body.touching.down;

    if (touchingDown) {
      this.player.setVelocityY(-300);

      this.player.setTexture("bunny-jump");
    }

    const vy = this.player.body.velocity.y;
    if (vy > 0 && this.player.texture.key !== "bunny-stand") {
      this.player.setTexture("bunny-stand");
    }

    this.platforms.children.iterate((child) => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child;

      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100);
        platform.body.updateFromGameObject();

        this.addCarrotAbove(platform);
      }
    });

    // this is supposed to collect any carrots that fall of the screen
    // I have no idea if this works...
    this.carrots.children.iterate((child) => {
      const carrot = child;

      const scrollY = this.cameras.main.scrollY;
      if (carrot.y >= scrollY + 700) {
        this.carrots.killAndHide(carrot);
      }
    });

    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    this.horizontalWrap(this.player);

    const bottomPlatform = this.findBottomMostPlatform();

    if (this.player.y > bottomPlatform.y + 200) {
      this.scene.start("game-over");
    }
  }

  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5;
    const gameWidth = this.scale.width;

    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
    }
  }

  addCarrotAbove(sprite) {
    const y = sprite.y - sprite.displayHeight;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    const carrot = this.carrots.get(sprite.x, y, "carrot");

    carrot.setActive(true);
    carrot.setVisible(true);

    this.add.existing(carrot);

    carrot.body.setSize(carrot.width, carrot.height);

    this.physics.world.enable(carrot);

    return carrot;
  }

  handleCollectCarrot(player, carrot) {
    // hide the carrot from displaying
    this.carrots.killAndHide(carrot);

    // disable the carrot from the physics world
    this.physics.world.disableBody(carrot.body);

    // increment the score value when the carrot is collected
    this.carrotsCollected++;

    // update score text
    this.carrotsCollectedText.text = `Carrots: ${this.carrotsCollected}`;
  }

  findBottomMostPlatform() {
    const platforms = this.platforms.getChildren();
    let bottomPlatform = platforms[0];

    for (let i = 1; i < platforms.length; i++) {
      const platform = platforms[i];

      if (platform.y < bottomPlatform.y) {
        continue;
      }

      bottomPlatform = platform;
    }

    return bottomPlatform;
  }
}
