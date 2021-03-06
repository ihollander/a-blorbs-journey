import ToothGun from "../weapons/ToothGun";
import SpreadToothGun from "../weapons/SpreadToothGun";
import NailGun from "../weapons/NailGun";
import SpreadNailGun from "../weapons/SpreadNailGun";
import ToothAndNailGun from "../weapons/ToothAndNailGun";
import ToothNailEyeballGun from "../weapons/ToothNailEyeballGun";

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
      spreadTooth: new SpreadToothGun(this.scene),
      nail: new NailGun(this.scene),
      spreadNail: new SpreadNailGun(this.scene),
      toothAndNail: new ToothAndNailGun(this.scene),
      toothNailEyeball: new ToothNailEyeballGun(this.scene)
    };
    this.currentWeapon = this.weapons.tooth;

    // healthbar
    this._health = 50;
    this.maxHealth = 5000;
    this.suffering = false;

    this.highScore = this._health;
  }

  update() {
    // transformations based on health
    this.updateTransform();

    // movement
    this.updateMovement();

    // rotation & firing
    this.updateRotation();
  }

  updateMovement() {
    const {
      scene: { controller },
      body
    } = this;
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
    const {
      scene: { controller },
      angleOffset
    } = this;
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
    if (this.texture.key !== PLAYER1_IMAGE && this.health < 100) {
      this.setTexture(PLAYER1_IMAGE);
      this.setScale(0.25, 0.25);
      this.currentWeapon = this.weapons.tooth;
    } else if (
      this.texture.key !== PLAYER2_IMAGE &&
      this.health >= 100 &&
      this.health < 170
    ) {
      this.setTexture(PLAYER2_IMAGE);
      this.setScale(0.27, 0.27);
      this.currentWeapon = this.weapons.spreadTooth;
      this.scene.maxEnemies = 40;
    } else if (
      this.texture.key !== PLAYER3_IMAGE &&
      this.health >= 170 &&
      this.health < 270
    ) {
      this.setTexture(PLAYER3_IMAGE);
      this.setScale(0.29, 0.29);
      this.currentWeapon = this.weapons.nail;
      this.scene.maxEnemies = 50;
    } else if (
      this.texture.key !== PLAYER4_IMAGE &&
      this.health >= 270 &&
      this.health < 400
    ) {
      this.setTexture(PLAYER4_IMAGE);
      this.setScale(0.31, 0.31);
      this.currentWeapon = this.weapons.spreadNail;
      this.scene.maxEnemies = 60;
    } else if (this.texture.key !== PLAYER5_IMAGE && this.health >= 400) {
      this.setTexture(PLAYER5_IMAGE);
      this.setScale(0.34, 0.34);
      this.currentWeapon = this.weapons.toothAndNail;
      this.scene.maxEnemies = 70;
    } else if (this.health >= 550) {
      // Scales based on current health
      const newScale = 0.35 + (this.health - 300) * 0.0005;
      this.setScale(newScale, newScale);
      this.currentWeapon = this.weapons.toothNailEyeball;
      this.scene.maxEnemies = 80;
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
    this.scene.cameras.main.shake(500, 0.025);
    this.scene.gameOver = true;
    this.scene.gameOverCard
      .setPosition(
        this.scene.cameras.main.worldView.centerX,
        this.scene.cameras.main.worldView.centerY
      )
      .setVisible(true);
    this.scene.highScore
      .setPosition(
        this.scene.cameras.main.worldView.centerX - 180,
        this.scene.cameras.main.worldView.centerY + 200
      )
      .setText(
        `High Score: ${this.highScore}\nKill Count: ${this.scene.killCount}`
      )
      .setVisible(true);
    this.scene.controller.rumble(0.75, 500);
    this.destroy();
  }

  powerup() {
    this.health += 10;
  }

  damage(amount) {
    this.health -= amount
  }

  // getter and setter for health
  // use this.health =
  get health() {
    return this._health;
  }

  set health(amount) {
    // check high score
    if (this._health > this.highScore) {
      this.highScore = this._health;
    }

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
