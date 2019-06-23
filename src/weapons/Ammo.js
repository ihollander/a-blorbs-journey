import { TOOTH_IMAGE } from "../consts/images";
import { THUM2_SOUND } from "../consts/sounds";

export default class Ammo extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, TOOTH_IMAGE);

    this.scene = scene;

    // since we're not using a physics factory function to create
    // these will let the scene know about this object
    this.scene.add.existing(this);
    // this.scene.physics.add.existing(this);
  }

  init(angle, scale) {
    this.setAngularVelocity(500);
    this.setScale(scale);
    this.setAngle(angle);

    // timer to destroy bullet
    this.lifespan = 100;

    // movement logic
    this.speed = 400;
    this.scene.physics.velocityFromRotation(
      this.rotation,
      this.speed,
      this.body.velocity
    );

    this.body.velocity.x *= 2;
    this.body.velocity.y *= 2;

    // play launch sound
    this.scene.sound.play(THUM2_SOUND, {
      seek: 0.15
    });
  }

  update() {
    this.lifespan--;
    if (this.active && this.lifespan <= 0) {
      // this.setActive(false);
      // this.setVisible(false);
      // this.disableBody(true, true);
      this.destroy(); //
    }
  }
}
