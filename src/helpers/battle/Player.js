import Entity from "./Entity";
export default class Player extends Entity {
  constructor(scene, x, y, texture, name) {
    super(scene, x, y, texture, name);

    this.damageValue = 100;
    this.type = "player";
    this.setScale(1.5);
    this.setFrame(4);
  }
}
