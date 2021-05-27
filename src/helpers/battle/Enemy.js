import battleConfig from "../../configuration/battle";
import Entity from "./Entity";
import "regenerator-runtime/runtime";

export default class Enemy extends Entity {
  constructor(scene, x, y, texture, name) {
    super(scene, x, y, texture, name);

    this.damageValue = 1;
    this.type = "enemy";
  }

  highlight() {
    this.scene.outlinePlugin.setOutline({
      object: this,
      thickness: 3,
      outlineColor: 0xff0000
    });
  }
  attack() {
    return new Promise((resolve) => {
      this.play("Sten0001_Rookie_attack");
      this.showAttackAnimation(this.x + 180, this.y - 50, false);

      this.scene.player.handleTheAttack(this.damageValue); // just for now

      this.once("animationcomplete", () => {
        this.play("Sten0001_Rookie_idle");

        resolve();
      });
    });
  }
  chooseAction() {
    const action = {};

    if (this.healthBar.value / 100 < battleConfig.heal.healThreshold) {
      action.action = "heals";
      action.target = this.name;
    } else if (
      this.scene.getEnemyPartyTotalHealth() / 100 <
      battleConfig.run.runThreshold
    ) {
      action.action = "run";
    } else {
      action.action = "attacks";
      action.target = "Player";
    }
    return action;
  }

  execAction(action) {
    return new Promise(async (resolve) => {
      if (action === "heals") {
        this.heal(battleConfig.heal.healValue);
        this.scene.highlightActionButton(this.scene.healButton);
      } else if (action === "run") {
        this.enemyTryRun(battleConfig.run.runLikelihood);
      } else {
        this.scene.highlightActionButton(this.scene.attackButton);
        await this.attack();
      }

      resolve();
    });
  }
  async takeAction() {
    const { action, target } = this.chooseAction();

    this.scene.updateActionInfo({
      name: this.name,
      action,
      target
    });

    await this.execAction(action);

    this.scene.outlinePlugin.remove(this);

    this.scene.nextTurn();
  }

  enemyTryRun(chance) {
    if (Math.random() < chance) {
      this.scene.endBattle();
    }
  }
}
