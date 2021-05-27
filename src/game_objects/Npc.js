import Character from "./Character";

export default class Npc extends Character {
  constructor(scene, x, y, sprite) {
    super(scene, x, y, sprite);

    this.scene = scene;
    this.spawnCords = { x, y };
    this.speed = 150;

    this.setSize(this.displayWidth / 2, this.displayHeight / 2 - 10);
    this.setOffset(this.displayWidth / 4, this.displayHeight / 2 + 5);
    this.setDepth(8);
    this.setImmovable(true);
    this.animations = {
      left: "npc_civilian_male_1_left",
      right: "npc_civilian_male_1_right",
      up: "npc_civilian_male_1_up",
      down: "npc_civilian_male_1_down",
      idle: "npc_civilian_male_1_idle"
    };
  }

  update() {
    if (this.dialogueIcon) this.updateDialogueIconPosition();
  }
  updateDialogueIconPosition() {
    this.dialogueIcon.setPosition(this.x, this.y - 80);
  }

  pauseMovingByPath() {
    if (this.movingTween) {
      this.movingTween.pause();
      this.anims.restart();
      this.anims.pause();
    }
  }

  resumeMovingByPath() {
    if (this.movingTween) {
      this.movingTween.resume();
      this.anims.resume();
    }
  }

  createTalkativeNPCicon() {
    this.dialogueIcon = this.scene.add
      .image(this.x + 5, this.y - 80, "Dialogue_bubble")
      .setDepth(100);

    this.scene.tweens.add({
      targets: this.dialogueIcon,
      duration: 700,
      y: "+=15",
      yoyo: true,
      repeat: -1
    });
  }

  npcGoTo(targetPoint) {
    const path = this.getPath(targetPoint);

    if (!path) return;

    this.goTo(path, this.npcStartMoving, this);
  }

  onPathEnd() {
    this.refreshAnims();

    const DELAY = 5000;

    if (this.isStopped) {
      this.scene.time.addEvent({
        callback: () => this.onPathEnd(),
        delay: DELAY
      });

      return;
    }

    this.scene.time.addEvent({
      delay: DELAY,
      callback: () => {
        if (this.x != this.spawnCords.x && this.y != this.spawnCords.y) {
          this.npcGoTo(this.spawnCords); // back to spawn point
        } else {
          this.startWalk(this.patterns); // go to dest point
        }
      }
    });
  }

  npcStartMoving(path, index) {
    this.startMoving(path, index);
  }

  startWalk(patterns) {
    this.patterns = patterns;
    const targetPoint = patterns[0]; // for now just 1 end point, in future handle more points

    this.npcGoTo(targetPoint);
  }

  refreshAnims() {
    // this.anims.stop(); //  no idea why these methods do not stop walking animation
    // this.anims.restart();
    this.anims.play(this.animations.idle); // so I play frame 0 to stop it
  }
}
