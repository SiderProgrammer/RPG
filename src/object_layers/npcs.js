import NPC from "../game_objects/Npc";
import NPCS_CONFIG from "../configuration/npcs";
import ASSETS from "../constants/assets";
export default function createNPCs(scene, obj) {
  const hoverCallback = (item) => {
    scene.outlinePlugin.setOutline({ object: item });
  };

  const leaveCallback = (item) => {
    scene.outlinePlugin.remove(item);
  };

  obj.objects.map((_npc) => {
    const npc = new NPC(
      scene,
      _npc.x,
      _npc.y,
      NPCS_CONFIG[_npc.name]?.assets?.sprite || ASSETS.NPC_CIVILIAN_MALE_1
    ).setInteractive();

    scene.physics.add.collider(npc, scene.player);
    scene.NPCs.push(npc);

    //if (!_npc.name) return;

    const npcConfig = NPCS_CONFIG[_npc.name];
    if (!npcConfig) return;

    const clickCallback = () => {
      const distance = npcConfig.distanceToDialogue;
      const dialogue = npcConfig.dialog;

      scene.objectClickCallback({
        object: npc,
        distance,
        dialogue,
        closeDialogueCallback: () => {
          scene.unpauseNPCs();
        }
      });
    };

    if (npcConfig.movementPatterns.length > 0) {
      // if is moving
      npc.startWalk(npcConfig.movementPatterns);
      npc.setDepth(npc.depth + 1);
      if (!npcConfig.dialog) return;
      npc.on("pointerdown", () => {
        npc.pauseMovingByPath();
        scene.movingNPCclicked = 0; // counter to manipulate stoping NPCs by pointer
        scene.isAnyNPCstopped = true;
        npc.isStopped = true;
      });
    }

    if (npcConfig.dialog) {
      npc.on("pointerdown", () => clickCallback());
      npc.on("pointerover", () => hoverCallback(npc));
      npc.on("pointerout", () => leaveCallback(npc));

      npc.createTalkativeNPCicon();
    }
  });
}
