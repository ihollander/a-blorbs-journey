import Eyeball from "../bullets/Eyeball";
import { THUM2_SOUND } from "../consts/sounds";

export default class EyeballGun {
  constructor(scene) {
    this.interval = 600;
    this.nextFire = 0;
    this.scene = scene;
  }

  fire(x, y, rotation, scale) {
    if (this.scene.time.now < this.nextFire) return;

    this.nextFire = this.scene.time.now + this.interval;

    const bullet = new Eyeball(this.scene, x, y);
    this.scene.bulletGroup.add(bullet);
    bullet.init(rotation, scale);

    // play launch sound
    this.scene.sound.play(THUM2_SOUND, {
      seek: 0.15
    });
  }
}
