import Bullet from "../weapons/Bullet";

import { PLAYER_IMAGE } from "../consts/images"; 

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

    // gamepad
  }

  update(time, delta) {
    const { cursors, wasds, sprite } = this;

    let pad;
    if (this.scene.input.gamepad.total) {
      pad = this.scene.input.gamepad.getPad(0) || this.scene.input.gamepad.pad1;
    }

    // keyboard movement
    // vertical
    if (
      wasds.up.isDown ||
      (pad &&
        pad.axes[1].value < -pad.axes[1].threshold &&
        pad.axes[1].value < -0.5)
    ) {
      sprite.body.setAccelerationY(-300);
    } else if (
      wasds.down.isDown ||
      (pad &&
        pad.axes[1].value > pad.axes[1].threshold &&
        pad.axes[1].value > 0.5)
    ) {
      sprite.body.setAccelerationY(300);
    } else {
      sprite.body.setAccelerationY(0);
    }

    // horizontal
    if (
      wasds.left.isDown ||
      (pad &&
        pad.axes[0].value < -pad.axes[0].threshold &&
        pad.axes[0].value < -0.5)
    ) {
      sprite.body.setAccelerationX(-300);
    } else if (
      wasds.right.isDown ||
      (pad &&
        pad.axes[0].value > pad.axes[0].threshold &&
        pad.axes[0].value > -0.5)
    ) {
      sprite.body.setAccelerationX(300);
    } else {
      sprite.body.setAccelerationX(0);
    }

    // rotation & firing
    if (
      cursors.up.isDown && cursors.right.isDown
      // pad stuff
    ) {
      sprite.setAngle(this.angleOffset + 225);
      this.fire();
    } else if (
      cursors.down.isDown && cursors.right.isDown
      // pad stuff
    ) {
      sprite.setAngle(this.angleOffset + 315);
      this.fire();
    } else if (
      cursors.down.isDown && cursors.left.isDown
      // pad stuff
    ) {
      sprite.setAngle(this.angleOffset + 45);
      this.fire();
    } else if (
      cursors.up.isDown && cursors.left.isDown
      // pad stuff
    ) {
      sprite.setAngle(this.angleOffset + 135);
      this.fire();
    } else if (
      cursors.up.isDown ||
      (pad &&
        pad.axes[4].value < -pad.axes[4].threshold &&
        pad.axes[4].value < -0.5)
    ) {
      sprite.setAngle(this.angleOffset + 180);
      this.fire();
    } else if (
      cursors.right.isDown ||
      (pad &&
        pad.axes[3].value > pad.axes[3].threshold &&
        pad.axes[3].value > 0.5)
    ) {
      sprite.setAngle(this.angleOffset + 270);
      this.fire();
    } else if (
      cursors.down.isDown ||
      (pad &&
        pad.axes[4].value > pad.axes[4].threshold &&
        pad.axes[4].value > 0.5)
    ) {
      sprite.setAngle(this.angleOffset);
      this.fire();
    } else if (
      cursors.left.isDown ||
      (pad &&
        pad.axes[3].value < -pad.axes[3].threshold &&
        pad.axes[3].value < -0.5)
    ) {
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
