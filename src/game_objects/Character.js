export default class Character extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, sprite) {
    super(scene, x, y, sprite);
    this.scene = scene;
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
  }

  getPath(targetPoint, checkIfHeroFits) {
    const offsetY = 15;

    const path = this.scene.navMesh.findPath(
      new Phaser.Math.Vector2(this.x, this.y + offsetY),
      targetPoint
    );
    //console.log(path);

    if (checkIfHeroFits) {
      const condition_1 = this.scene.navMesh.findPath(
        new Phaser.Math.Vector2(this.x, this.y + offsetY),
        { x: targetPoint.x, y: targetPoint.y + 25 }
      );

      const condition_2 = this.scene.navMesh.findPath(
        new Phaser.Math.Vector2(this.x, this.y + offsetY),
        { x: targetPoint.x, y: targetPoint.y - 10 }
      );

      if (condition_1 && condition_2) return path;
    } else {
      return path;
    }
  }

  stopMovingByPath() {
    if (!this.movingTween) return;
    this.movingTween.remove();
    this.onPathEnd();
  }

  goTo(path, startMovingFunction, context) {
    // this.scene.navMesh.debugDrawPath(path, 0xffd900);

    const segments = [];
    for (let i = 0; i < path.length; i++) {
      segments.push([path[i].x, path[i].y]);
    }

    startMovingFunction.call(context, segments, 0);
  }

  startMoving(path, index) {
    if (path[index + 1]) {
      const initialX = path[index][0];
      const initialY = path[index][1];
      const directionX = path[index + 1][0] - initialX;
      const directionY = path[index + 1][1] - initialY;
      const targetX = path[index + 1][0];
      const targetY = path[index + 1][1];

      let distance =
        (initialX - targetX) * (initialX - targetX) +
        (initialY - targetY) * (initialY - targetY);

      distance = Math.sqrt(distance);

      let neededTime = 0;

      neededTime = (distance / this.speed) * 1000; // in ms

      if (Math.abs(directionX) > Math.abs(directionY)) {
        if (this.x < targetX) {
          this.play(this.animations.right, true);
        } else if (this.x > targetX) {
          this.play(this.animations.left, true);
        }
      } else {
        if (this.y < targetY) {
          this.play(this.animations.down, true);
        } else if (this.y > targetY) {
          this.play(this.animations.up, true);
        }
      }

      this.movingTween = this.scene.tweens.add({
        targets: this,
        x: targetX,
        y: targetY - 20, // -20 is responsible for arranging the character
        duration: neededTime,
        yoyo: false,
        onComplete: () => {
          this.startMoving(path, index + 1);
        }
      });
    } else {
      this.onPathEnd();
    }
  }
}
