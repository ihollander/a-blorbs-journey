import ClawberClawLarge from "../bullets/ClawberClawLarge";
import ClawberClawSmall from "../bullets/ClawberClawSmall";
import { SPIT1_SOUND } from "../consts/sounds";

export default class ClawberShot {
  constructor(scene) {
    this.scene = scene;
  }

  fire(x, y, rotation, isLarge) {
    let bullet;

    if (isLarge) {
      bullet = new ClawberClawLarge(this.scene, x, y, rotation, isLarge);
    } else {
      bullet = new ClawberClawSmall(this.scene, x, y, rotation, isLarge);
    }

    this.scene.enemyBulletGroup.add(bullet);
    bullet.init(rotation, isLarge);

    // play launch sound
    this.scene.sound.play(SPIT1_SOUND, {
      seek: 0.65
    });
  }
}
