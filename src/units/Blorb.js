import { PLAYER_IMAGE } from "../consts/images";

export default class Blorb {
  constructor(scene, x, y) {
    this.scene = scene;

    // create physics-based sprite
    // angle offset
    this.angleOffset = Math.random() * 360;
    this.sprite = scene.physics.add
      .sprite(x, y, PLAYER_IMAGE, 0)
      .setAngle(this.angleOffset)
      .setCollideWorldBounds(false)
      .setScale(0.15, 0.15)
      .setDrag(300)
      .setAngularDrag(400)
      .setMaxVelocity(600);
  }

  update(time, delta) {
    sprite.body.setAccelerationX(this.angleOffset);
  }
}
