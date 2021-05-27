import NPC from "../game_objects/Npc";
import ASSETS from "../constants/assets";
export default function createEnemyNPCs(scene, obj) {
  const hoverCallback = (item) => {
    scene.outlinePlugin.setOutline({
      object: item,
      thickness: 3,
      outlineColor: 0xff0000
    });
  };

  const leaveCallback = (item) => {
    scene.outlinePlugin.remove(item);
  };

  obj.objects.map((_npc) => {
    const enemyNPC = new NPC(scene, _npc.x, _npc.y, ASSETS.MONSTER_1);
    scene.physics.add.collider(
      enemyNPC,
      scene.player,
      scene.collideEnemyNPC,
      null,
      scene
    );

    enemyNPC.setInteractive();

    enemyNPC.on("pointerover", () => hoverCallback(enemyNPC));
    enemyNPC.on("pointerout", () => leaveCallback(enemyNPC));
  });
}
