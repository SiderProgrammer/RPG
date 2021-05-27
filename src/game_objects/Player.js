import Character from "./Character";
import ASSETS from "../constants/assets";

export default class Player extends Character {
  constructor(scene, x, y) {
    super(scene, x, y, ASSETS.PLAYER);
    this.setDepth(9);
    this.setSize(this.displayWidth / 2, this.displayHeight / 2 - 10);
    this.setOffset(this.displayWidth / 4, this.displayHeight / 2 + 10);
    this.setCollideWorldBounds(true);

    this.speed = 300;
    this.duringClickMoveTween = false;
    this.animations = {
      left: "left",
      right: "right",
      up: "up",
      down: "down"
    };
  }

  update(keysBooleans) {
    this.setVelocity(0);
    this.handleMovement(keysBooleans);
    this.handleMoveAnimation(keysBooleans); // fix idle anim
  }

  handleMovement(keysBooleans) {
    if (keysBooleans.right) {
      this.setVelocityX(this.speed);
    } else if (keysBooleans.left) {
      this.setVelocityX(-this.speed);
    }

    if (keysBooleans.up) {
      this.setVelocityY(-this.speed);
    } else if (keysBooleans.down) {
      this.setVelocityY(this.speed);
    }
  }

  handleMoveAnimation(keysBooleans) {
    if (Object.values(keysBooleans).some((key) => key) && this.movingTween) {
      this.duringClickMoveTween = false;
      this.movingTween.stop();
      this.destinationPointer.destroy();
    }

    if (keysBooleans.right) {
      this.play(this.animations.right, true);
    } else if (keysBooleans.left) {
      this.play(this.animations.left, true);
    } else if (keysBooleans.up) {
      this.play(this.animations.up, true);
    } else if (keysBooleans.down) {
      this.play(this.animations.down, true);
    } else {
      if (this.duringClickMoveTween) return;
      this.anims.stop();
      this.anims.restart();
    }
  }
  playerGoTo(targetPoint, checkIfHeroFits = false) {
    const path = this.getPath(targetPoint, checkIfHeroFits);

    if (!path) return;
    this.lastDestinationPoint = targetPoint;

    this.goTo(path, this.playerStartMoving, this);

    if (this.destinationPointer) {
      this.destinationPointer.destroy();
    }

    this.destinationPointer = this.scene.add
      .sprite(targetPoint.x, targetPoint.y, "pointer-destination")
      .setDepth(10)
      .play("destination");
  }

  onPathEnd() {
    this.duringClickMoveTween = false;
    this.destinationPointer.destroy();
    //  this.setFrame(0);
  }

  playerStartMoving(path, index) {
    if (index === 0 && this.duringClickMoveTween) {
      this.duringClickMoveTween = false;
      this.movingTween.stop();
    }

    this.duringClickMoveTween = true;

    this.startMoving(path, index);
  }
}
