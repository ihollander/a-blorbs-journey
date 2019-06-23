import Nail from "../bullets/Nail";
import { SPIT1_SOUND } from "../consts/sounds";

export default class NailGun {
  constructor(scene) {
    this.interval = 200;
    this.nextFire = 0;
    this.scene = scene;
  }

  fire(x, y, rotation, scale) {
    if (this.scene.time.now < this.nextFire) return;

    this.nextFire = this.scene.time.now + this.interval;

    const bullet = new Nail(this.scene, x, y);
    this.scene.bulletGroup.add(bullet);
    bullet.init(rotation, scale);

    // play launch sound
    this.scene.sound.play(SPIT1_SOUND, {
      seek: 0.65
    });
  }
}
