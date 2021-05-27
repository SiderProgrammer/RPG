import createEnemyNPCs from "./enemies";
import createItems from "./items";
import createNPCs from "./npcs";
import createPortalZones from "./portals";

export default class ObjectLayerManager {
  constructor(scene) {
    this.scene = scene;
  }

  createEnemies(obj) {
    createEnemyNPCs(this.scene, obj);
  }

  createItems(obj) {
    createItems(this.scene, obj);
  }

  createNPCs(obj) {
    createNPCs(this.scene, obj);
  }

  createPortalZones(obj) {
    createPortalZones(this.scene, obj);
  }
}
