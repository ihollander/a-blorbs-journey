import { CHASER_IMAGE } from "../consts/images";
import { PEPEPEP_SOUND } from "../consts/sounds";

import Enemy from "./Enemy";

export default class Chaser extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, CHASER_IMAGE, "Chaser");

    this.setScale(0.4, 0.4);

    this.health = 20;
    this.sound = this.scene.sound.add(PEPEPEP_SOUND, {
      loop: true,
      volume: 0
    });
    this.sound.play();

    this.collisionDamage = 50;
  }

  update() {
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.scene.player.x,
      this.scene.player.y
    );
    if (distance < 1000) {
      this.sound.setVolume((1000 - distance) / 600);
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
      400,
      this.body.velocity
    );
  }
}
