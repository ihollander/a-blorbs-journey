import Tooth from "../weapons/Tooth";

import Controller from "../utils/Controller";

import {
  PLAYER1_IMAGE,
  PLAYER2_IMAGE,
  PLAYER3_IMAGE,
  PLAYER4_IMAGE,
  PLAYER5_IMAGE
} from "../consts/images";

import { THUM2_SOUND } from "../consts/sounds";

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
    this.bulletGroup = this.scene.physics.add.group({
      defaultKey: "bullets",
      maxSize: 20
    });
    this.bullets = [];
    this.bulletInterval = 0;

    // healthbar
    this.health = 100;

    // controllers
    this.controller = new Controller(this.scene);
  }

  update(time, delta) {
    const { controller, sprite } = this;
    controller.update();

    // transformations based on health
    if (this.sprite.texture.key !== PLAYER1_IMAGE && this.health < 150) {
      this.sprite.setTexture(PLAYER1_IMAGE);
    } else if (
      this.sprite.texture.key !== PLAYER2_IMAGE &&
      this.health >= 150 &&
      this.health < 200
    ) {
      this.sprite.setTexture(PLAYER2_IMAGE);
    } else if (
      this.sprite.texture.key !== PLAYER3_IMAGE &&
      this.health >= 200 &&
      this.health < 250
    ) {
      this.sprite.setTexture(PLAYER3_IMAGE);
    } else if (
      this.sprite.texture.key !== PLAYER4_IMAGE &&
      this.health >= 250 &&
      this.health < 300
    ) {
      this.sprite.setTexture(PLAYER4_IMAGE);
    } else if (
      this.sprite.texture.key !== PLAYER5_IMAGE &&
      this.health >= 300
    ) {
      this.sprite.setTexture(PLAYER5_IMAGE);
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
      const bullet = new Tooth({
        group: this.bulletGroup,
        scene: this.scene,
        x: this.sprite.x,
        y: this.sprite.y,
        angle: this.sprite.body.rotation + 70
      });
      this.scene.sound.play(THUM2_SOUND, {
        seek: 0.15
      });
      this.bullets.push(bullet);
    }
  }

  kill() {
    //this gets called when the sprite has no more health
    this.alive = false;
    this.sprite.visible = false;
    // not sure what else we want to do when a game ends
  }

  heal(amount) {
    // this gets called when the sprite completes some action
    // picks up DNA? kills an enemy? or never?
    // and his health increases
    if (this.health > 0) {
      this.health += amount;
      if (this.health > this.maxHealth) {
        this.health = this.maxHealth;
      }
      return this.health;
    }
  }

  damage(amount) {
    // this gets called when the sprite doesn't avoid an enemy
    // and his health declines
    // if his health reaches 0, he should die
    if (this.health > 0) {
      this.health -= amount;
      if (this.health <= 0) this.kill();
    }
    return this.health;
  }
}
