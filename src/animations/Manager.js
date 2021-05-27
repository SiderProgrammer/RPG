import createPlayerAnimations from "./player";
import createPointerAnimation from "./pointer";
import createNPCsAnimations from "./npc.js";
import createRockyAnimations from "./Rookie_0001";
import createAttackAnimations from "./attack";

export default class AnimationsManager {
  constructor(scene) {
    this.scene = scene;
  }

  createAnimations() {
    createAttackAnimations(this.scene);
    createRockyAnimations(this.scene);
    createPlayerAnimations(this.scene);
    createPointerAnimation(this.scene);
    createNPCsAnimations(this.scene);
  }
}
