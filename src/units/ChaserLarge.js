import { CHASER_IMAGE } from "../consts/images";

import Enemy from "./Enemy";

export default class ChaserLarge extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, CHASER_IMAGE, "Chaser");

    this.setScale(1, 1);

    this.health = 10;
  }

  update() {
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.scene.player.x,
      this.scene.player.y
    );
    this.setAngle((angle * 180) / Math.PI);

    this.scene.physics.velocityFromRotation(
      this.rotation,
      100,
      this.body.velocity
    );
  }
}
