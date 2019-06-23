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

    // bullets
    this.bullets = [];
    this.bulletInterval = 0;

    // healthbar
    this.health = 100;
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

    // update/cleanup bullets
    this.bullets = this.bullets.filter(bullet => {
      bullet.update(); // call update
      return bullet.active; // filter out not active
    });
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
    } else if (
      this.texture.key !== PLAYER2_IMAGE &&
      this.health >= 150 &&
      this.health < 200
    ) {
      this.setTexture(PLAYER2_IMAGE);
    } else if (
      this.texture.key !== PLAYER3_IMAGE &&
      this.health >= 200 &&
      this.health < 250
    ) {
      this.setTexture(PLAYER3_IMAGE);
    } else if (
      this.texture.key !== PLAYER4_IMAGE &&
      this.health >= 250 &&
      this.health < 300
    ) {
      this.setTexture(PLAYER4_IMAGE);
    } else if (this.texture.key !== PLAYER5_IMAGE && this.health >= 300) {
      this.setTexture(PLAYER5_IMAGE);
    }
  }

  fire() {
    // only allow fire at interval
    this.bulletInterval--;
    if (this.bulletInterval <= 0) {
      this.bulletInterval = 20;
      const bullet = new Tooth({
        group: this.scene.bulletGroup,
        scene: this.scene,
        x: this.x,
        y: this.y,
        angle: this.body.rotation + 70
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
    this.visible = false;
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
    if (this.health > 0 && this.suffering === false) {
      this.suffer();
      this.health -= amount;
      // if (this.health <= 0) this.kill();
    }
    return this.health;
  }

  suffer() {
    this.suffering = true;
    // debugger;
    this.setTintFill(0xffffff);
    setTimeout(() => {
      this.clearTint();
      this.suffering = false;
    }, 200);
  }
}
