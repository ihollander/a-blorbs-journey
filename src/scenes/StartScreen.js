import { TITLESCREEN_IMAGE } from "../consts/images";

import Controller from "../utils/Controller";

import titleScreen from "../assets/title-screen.jpg";

export default class StartScreen extends Phaser.Scene {
  constructor() {
    super({ key: "StartScreen" });
  }

  preload() {
    this.load.image(TITLESCREEN_IMAGE, titleScreen);
  }

  create() {
    this.add
      .image(
        this.game.config.width / 2,
        this.game.config.height / 2,
        TITLESCREEN_IMAGE
      )
      .setDisplaySize(this.game.config.width, this.game.config.height);

    this.controller = new Controller(this);
  }

  update() {
    if (this.controller.extras.x.isDown) {
      this.scene.stop("StartScreen");
      this.scene.start("MainGame");
    }
  }
}
