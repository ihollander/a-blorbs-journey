import { PLAYER1_IMAGE } from "../consts/images";

import Enemy from "./Enemy";

export default class Blorb extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, PLAYER1_IMAGE, "Blorb");
    this.setScale(0.15, 0.15);
    this.body.velocity.y = Phaser.Math.Between(10, 100);
    this.body.velocity.x = Phaser.Math.Between(-100, 100);
  }
}
//
// export default class Blorb {
//   constructor(scene, x, y) {
//     this.scene = scene;
//
//     // create physics-based sprite
//     // angle offset
//     this.angleOffset = Math.random() * 360;
//     this.sprite = scene.physics.add
//       .sprite(x, y, PLAYER_IMAGE, 0)
//       .setAngle(this.angleOffset)
//       .setCollideWorldBounds(true)
//       .setScale(0.15, 0.15)
//       .setDrag(0)
//       .setAngularDrag(400)
//       .setMaxVelocity(600);
//
//     this.sprite.body.setVelocityX(Math.random() * 300);
//     this.sprite.body.setVelocityY(Math.random() * 300);
//
//     // Movement timer determines whether it changes direction
//     this.movementTimer = 0;
//   }
//
//   update(time, delta) {
//     const { movementTimer, sprite } = this;
//     movementTimer++;
//     if (time >= 100) {
//       this.changeVector(movementTimer, sprite);
//     }
//   }
//
//   changeVector(movementTimer, sprite) {
//     if (movementTimer >= 100) {
//       movementTimer = 0;
//       sprite.body.setVelocityX(Math.random() * 300);
//       sprite.body.setVelocityY(Math.random() * 300);
//     }
//   }
// }
