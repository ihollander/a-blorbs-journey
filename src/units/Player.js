import Bullet from "../weapons/Bullet";

import { PLAYER_IMAGE, TOOTH_IMAGE } from "../consts/images";

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;

    // create physics-based sprite
    // angle offset
    this.angleOffset = 18;
    this.sprite = scene.physics.add
      .sprite(x, y, PLAYER_IMAGE, 0)
      .setAngle(this.angleOffset)
      .setCollideWorldBounds(true)
      .setScale(0.15, 0.15)
      .setDrag(300)
      .setAngularDrag(400)
      .setMaxVelocity(600);

    // create group for bullets
    this.bulletGroup = this.scene.physics.add.group();
    this.bullets = [];

    this.weaponTimer = 0;

    // Track the arrow keys for movement
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    // Track the WASD keys for firing direction
    const { W, A, S, D } = Phaser.Input.Keyboard.KeyCodes;
    this.wasds = {
      up: scene.input.keyboard.addKey(W),
      left: scene.input.keyboard.addKey(A),
      down: scene.input.keyboard.addKey(S),
      right: scene.input.keyboard.addKey(D)
    };
  }

  update(time, delta) {
    const { cursors, wasds, sprite } = this;

    // vertical
    if (wasds.up.isDown) {
      sprite.body.setAccelerationY(-300);
    } else if (wasds.down.isDown) {
      sprite.body.setAccelerationY(300);
    } else {
      sprite.body.setAccelerationY(0);
    }

    // horizontal
    if (wasds.left.isDown) {
      sprite.body.setAccelerationX(-300);
    } else if (wasds.right.isDown) {
      sprite.body.setAccelerationX(300);
    } else {
      sprite.body.setAccelerationX(0);
    }

    // rotation & firing
    if (cursors.up.isDown) {
      sprite.setAngle(this.angleOffset + 180);
      this.fire();
    } else if (cursors.right.isDown) {
      sprite.setAngle(this.angleOffset + 270);
      this.fire();
    } else if (cursors.down.isDown) {
      sprite.setAngle(this.angleOffset);
      this.fire();
    } else if (cursors.left.isDown) {
      sprite.setAngle(this.angleOffset + 90);
      this.fire();
    }

    // update/cleanup bullets
    this.bullets = this.bullets.filter(bullet => {
      bullet.update(); // call update
      return bullet.active; // filter out not active
    });
  }

  fire() {
    // only allow fire at interval
    this.weaponTimer--;
    if (this.weaponTimer <= 0) {
      this.weaponTimer = 20;
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
}
