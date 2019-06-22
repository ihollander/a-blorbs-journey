import Phaser from "phaser";

import { TOOTH_IMAGE } from "../consts/images";

export default class Tooth extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, TOOTH_IMAGE);

    this.setScale(0.25, 0.25);
    this.scene.physics.world.enable(this); // ??
  }

  fire(x, y, angle) {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
    this.setAngle(angle);
    this.setAngularVelocity(400);
  }

  update(time, delta) {}
}
