import { TOOTH_IMAGE } from "../consts/images";

export default class Ammo extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture = TOOTH_IMAGE) {
    super(scene, x, y, texture);

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);

    // timer to destroy bullet
    this.lifespan = 100;

    // default speed
    this.speed = 400;

    // default damage
    this.damage = 10;
  }

  update() {
    this.lifespan--;
    if (this.active && this.lifespan <= 0) {
      // this.setActive(false);
      // this.setVisible(false);
      // this.disableBody(true, true);
      this.destroy();
    }
  }
}
