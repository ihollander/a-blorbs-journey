import { CHASER_IMAGE } from "../consts/images";
import { WEOW_SOUND } from "../consts/sounds";

import Enemy from "./Enemy";

export default class ChaserLarge extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, CHASER_IMAGE, "Chaser");

    this.setScale(1, 1);

    this.health = 10;
    this.sound = this.scene.sound.add(WEOW_SOUND, {
      loop: true,
      volume: 0
    });
    this.sound.play();
  }

  update() {
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.scene.player.x,
      this.scene.player.y
    );
    if (distance < 1000) {
      this.sound.setVolume((1000 - distance) / 1000);
    }

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
