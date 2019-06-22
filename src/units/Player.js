import Bullet from "../weapons/Bullet";
import Controller from "../utils/Controller";

import { PLAYER1_IMAGE, PLAYER2_IMAGE, PLAYER3_IMAGE } from "../consts/images";

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;

    // create physics-based sprite
    // angle offset for slightly tilty sprite
    this.angleOffset = 18;
    this.sprite = scene.physics.add
      .sprite(x, y, PLAYER1_IMAGE, 0)
      .setAngle(this.angleOffset)
      .setCollideWorldBounds(true)
      .setScale(0.25, 0.25)
      .setDrag(300)
      .setAngularDrag(400)
      .setMaxVelocity(600);

    // create group for bullets
    this.bulletGroup = this.scene.physics.add.group({});
    this.bullets = [];

    this.bulletInterval = 0;

    // healthbar
    this.health = 10;

    // controllers
    this.controller = new Controller(this.scene);
  }

  update(time, delta) {
    const { controller, sprite } = this;
    controller.update();

    // transformations based on health
    if (this.sprite.texture.key !== PLAYER1_IMAGE && this.health < 100) {
      this.sprite.setTexture(PLAYER1_IMAGE);
    } else if (
      this.sprite.texture.key !== PLAYER2_IMAGE &&
      this.health >= 100 &&
      this.health < 200
    ) {
      this.sprite.setTexture(PLAYER2_IMAGE);
    } else if (
      this.sprite.texture.key !== PLAYER3_IMAGE &&
      this.health >= 200
    ) {
      this.sprite.setTexture(PLAYER3_IMAGE);
    }

    // vertical movement
    if (controller.moveUp) {
      sprite.body.setAccelerationY(-300);
    } else if (controller.moveDown) {
      sprite.body.setAccelerationY(300);
    } else {
      sprite.body.setAccelerationY(0);
    }

    // horizontal movement
    if (controller.moveLeft) {
      sprite.body.setAccelerationX(-300);
    } else if (controller.moveRight) {
      sprite.body.setAccelerationX(300);
    } else {
      sprite.body.setAccelerationX(0);
    }

    // rotation & firing
    if (controller.shootUp && controller.shootRight) {
      sprite.setAngle(this.angleOffset + 225);
      this.fire();
    } else if (controller.shootDown && controller.shootRight) {
      sprite.setAngle(this.angleOffset + 315);
      this.fire();
    } else if (controller.shootDown && controller.shootLeft) {
      sprite.setAngle(this.angleOffset + 45);
      this.fire();
    } else if (controller.shootUp && controller.shootLeft) {
      sprite.setAngle(this.angleOffset + 135);
      this.fire();
    } else if (controller.shootUp) {
      sprite.setAngle(this.angleOffset + 180);
      this.fire();
    } else if (controller.shootRight) {
      sprite.setAngle(this.angleOffset + 270);
      this.fire();
    } else if (controller.shootDown) {
      sprite.setAngle(this.angleOffset);
      this.fire();
    } else if (controller.shootLeft) {
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
    this.bulletInterval--;
    if (this.bulletInterval <= 0) {
      this.bulletInterval = 20;
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
