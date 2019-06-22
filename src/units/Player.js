import Bullet from "../weapons/Bullet";
import Controller from "../utils/Controller";

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
      .setScale(0.25, 0.25)
      .setDrag(300)
      .setAngularDrag(400)
      .setMaxVelocity(600);

    // create group for bullets
    this.bulletGroup = this.scene.physics.add.group();
    this.bullets = [];
    //tracking the sprite's health here
    this.alive = true
    // should we start the health at half? or full?
    this.health = 50
    this.maxHealth = 100

    this.weaponTimer = 0;

    // control class
    this.controller = new Controller(this.scene);
  }

  update(time, delta) {
    const { controller, sprite } = this;
    controller.update();

    let pad;
    if (this.scene.input.gamepad.total) {
      pad = this.scene.input.gamepad.getPad(0) || this.scene.input.gamepad.pad1;
    }

    // keyboard movement
    // vertical
    if (controller.moveUp) {
      sprite.body.setAccelerationY(-300);
    } else if (controller.moveDown) {
      sprite.body.setAccelerationY(300);
    } else {
      sprite.body.setAccelerationY(0);
    }

    // horizontal
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

  kill(){
    //this gets called when the sprite has no more health
    this.alive = false;
    this.sprite.visible = false;
    // not sure what else we want to do when a game ends
  }

  heal(amount){
    // this gets called when the sprite completes some action
    // picks up DNA? kills an enemy? or never?
    // and his health increases
    if(this.health > 0){
      this.health += amount
      if(this.health > this.maxHealth){
        this.health = this.maxHealth
      }
    return this.health
    }
  }

  damage(amount){
    // this gets called when the sprite doesn't avoid an enemy
    // and his health declines
    // if his health reaches 0, he should die
    if(this.health > 0){
      this.health -= amount
      if(this.health <= 0)
        this.kill()
      }
      return this.health 
    }

  }
}
