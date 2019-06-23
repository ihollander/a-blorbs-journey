import { CHASER_IMAGE } from "../consts/images";

import Enemy from "./Enemy";

export default class Chaser extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, CHASER_IMAGE, "Chaser");

    this.setScale(0.4, 0.4);
  }

  update() {
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.scene.player.sprite.x,
      this.scene.player.sprite.y
    );
    this.setAngle((angle * 180) / Math.PI);
  }
}
