import Bullet from "../weapons/Bullet";

import { PLAYER_IMAGE, TOOTH_IMAGE } from "../consts/images";

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;

    // create physics-based sprite
    this.sprite = scene.physics.add
      .sprite(x, y, PLAYER_IMAGE, 0)
      .setCollideWorldBounds(true)
      .setScale(0.15, 0.15)
      .setDrag(300)
      .setAngularDrag(400)
      .setMaxVelocity(600);

    // create group for bullets
    this.bulletGroup = this.scene.physics.add.group();
    this.bullets = [];

    this.weaponTimer = 0;

    // Track the arrow keys
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  update(time, delta) {
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

    this.weaponTimer--;
    if (cursors.space.isDown) {
      if (this.weaponTimer <= 0) {
        this.weaponTimer = 20;
        this.fire();
      }
    }

    // update bullets
    this.bullets = this.bullets.filter(bullet => {
      bullet.update(); // call update
      return bullet.active; // filter not active
    });
  }

  fire() {
    const bullet = new Bullet({
      scene: this.scene,
      group: this.bulletGroup,
      x: this.sprite.x,
      y: this.sprite.y,
      angle: this.sprite.body.rotation + 70
    });
    this.bullets.push(bullet);
  }
}
