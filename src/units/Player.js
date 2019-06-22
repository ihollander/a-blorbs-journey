import { PLAYER_IMAGE } from "../consts/images";

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;

    // create physics-based sprite
    this.sprite = scene.physics.add
      .sprite(x, y, PLAYER_IMAGE, 0)
      .setCollideWorldBounds(true)
      .setAngle(90)
      .setScale(3.5, 3.5)
      .setDrag(300)
      .setAngularDrag(400)
      .setMaxVelocity(600);

    // Track the arrow keys
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  update() {
    const { cursors, sprite } = this;

    if (cursors.left.isDown) {
      sprite.setAngularVelocity(-150);
    } else if (cursors.right.isDown) {
      sprite.setAngularVelocity(150);
    } else {
      sprite.setAngularVelocity(0);
    }

    if (cursors.up.isDown) {
      this.scene.physics.velocityFromRotation(
        sprite.rotation,
        600,
        sprite.body.acceleration
      );
    } else {
      sprite.setAcceleration(0);
    }
  }
}
