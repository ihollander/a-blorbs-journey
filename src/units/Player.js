import ToothGun from "../weapons/ToothGun";
import NailGun from "../weapons/NailGun";
import SpreadNailGun from "../weapons/SpreadNailGun";
import ToothAndNailGun from "../weapons/ToothAndNailGun";

import Controller from "../utils/Controller";

import {
  PLAYER1_IMAGE,
  PLAYER2_IMAGE,
  PLAYER3_IMAGE,
  PLAYER4_IMAGE,
  PLAYER5_IMAGE
} from "../consts/images";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, PLAYER1_IMAGE);

    this.scene = scene;

    // since we're not using a physics factory function to create
    // these will let the scene know about this object
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    // create physics-based sprite
    // angle offset for slightly tilty sprite
    this.angleOffset = 18;
    // this.scene.physics.world.enable(this); // give access 2 physics

    this.setAngle(this.angleOffset);
    this.setCollideWorldBounds(true);
    this.setScale(0.25, 0.25);
    this.setDrag(300);
    this.setAngularDrag(400);
    this.setMaxVelocity(600);
    this.setDepth(1);

    // weapons
    this.weapons = {
      tooth: new ToothGun(this.scene),
      nail: new NailGun(this.scene),
      spreadNail: new SpreadNailGun(this.scene),
      toothAndNail: new ToothAndNailGun(this.scene)
    };
    this.currentWeapon = this.weapons.tooth;

    // healthbar
    this._health = 250;
    this.maxHealth = 500;
    this.suffering = false;

    // controllers
    this.controller = new Controller(this.scene);
  }

  update(time, delta) {
    const { controller } = this;
    controller.update(); // update to get the gamepad info

    // transformations based on health
    this.updateTransform();

    // movement
    this.updateMovement();

    // rotation & firing
    this.updateRotation();
  }

  updateMovement() {
    const { controller, body } = this;
    // vertical movement
    if (controller.moveUp) {
      body.setAccelerationY(-300);
    } else if (controller.moveDown) {
      body.setAccelerationY(300);
    } else {
      body.setAccelerationY(0);
    }

    // horizontal movement
    if (controller.moveLeft) {
      body.setAccelerationX(-300);
    } else if (controller.moveRight) {
      body.setAccelerationX(300);
    } else {
      body.setAccelerationX(0);
    }
  }

  updateRotation() {
    const { controller, angleOffset } = this;
    if (controller.shootUp && controller.shootRight) {
      this.setAngle(angleOffset + 225);
      this.fire();
    } else if (controller.shootDown && controller.shootRight) {
      this.setAngle(angleOffset + 315);
      this.fire();
    } else if (controller.shootDown && controller.shootLeft) {
      this.setAngle(angleOffset + 45);
      this.fire();
    } else if (controller.shootUp && controller.shootLeft) {
      this.setAngle(angleOffset + 135);
      this.fire();
    } else if (controller.shootUp) {
      this.setAngle(angleOffset + 180);
      this.fire();
    } else if (controller.shootRight) {
      this.setAngle(angleOffset + 270);
      this.fire();
    } else if (controller.shootDown) {
      this.setAngle(angleOffset);
      this.fire();
    } else if (controller.shootLeft) {
      this.setAngle(angleOffset + 90);
      this.fire();
    }
  }

  updateTransform() {
    if (this.texture.key !== PLAYER1_IMAGE && this.health < 150) {
      this.setTexture(PLAYER1_IMAGE);
      this.setScale(0.25, 0.25);
      this.currentWeapon = this.weapons.tooth;
    } else if (
      this.texture.key !== PLAYER2_IMAGE &&
      this.health >= 150 &&
      this.health < 200
    ) {
      this.setTexture(PLAYER2_IMAGE);
      this.setScale(0.27, 0.27);
      this.currentWeapon = this.weapons.nail;
    } else if (
      this.texture.key !== PLAYER3_IMAGE &&
      this.health >= 200 &&
      this.health < 250
    ) {
      this.setTexture(PLAYER3_IMAGE);
      this.setScale(0.29, 0.29);
      this.currentWeapon = this.weapons.spreadNail;
    } else if (
      this.texture.key !== PLAYER4_IMAGE &&
      this.health >= 250 &&
      this.health < 300
    ) {
      this.setTexture(PLAYER4_IMAGE);
      this.setScale(0.31, 0.31);
      this.currentWeapon = this.weapons.toothAndNail;
    } else if (this.texture.key !== PLAYER5_IMAGE && this.health >= 300) {
      this.setTexture(PLAYER5_IMAGE);
      this.setScale(0.34, 0.34);
    } else if (this.health >= 350) {
      // Scales based on current health
      const newScale = 0.35 + (this.health - 300) * 0.0005;
      this.setScale(newScale, newScale);
    }
  }

  fire() {
    // dynamically get weapon
    this.bulletInterval = this.currentWeapon.interval;
    this.currentWeapon.fire(
      this.x,
      this.y,
      this.body.rotation + 70,
      this.scale
    );
  }

  kill() {
    //this gets called when the sprite has no more health
    this.alive = false;
    this.visible = false;
    // not sure what else we want to do when a game ends
  }

  // getter and setter for health
  // use this.health =
  get health() {
    return this._health;
  }

  set health(amount) {
    const prevHealth = this._health;
    // can't take additional damage while suffering
    if (prevHealth > amount && !this.suffering) {
      this.suffer();
      this._health = amount;
    } else if (prevHealth < amount) {
      this._health = amount;
    }

    if (this._health > 0) {
      // cap max health
      if (this._health > this.maxHealth) {
        this._health = this.maxHealth;
      }
    } else {
      this._health = 0;
      this.kill();
    }

    this.scene.healthbar.setText(`Health: ${this._health}`);
    return this._health;
  }

  suffer() {
    this.suffering = true;
    // debugger;
    this.setTint(0xff0000);
    setTimeout(() => {
      this.clearTint();
      this.suffering = false;
    }, 1000);
  }
}
