import ASSETS from "../constants/assets";

export default function createNPCsAnimations(game) {
  game.anims.create({
    key: "npc_civilian_male_1_left",
    frames: game.anims.generateFrameNumbers(ASSETS.NPC_CIVILIAN_MALE_1, {
      frames: [4, 5, 6, 7]
    }),
    frameRate: 10,
    repeat: -1
  });
  game.anims.create({
    key: "npc_civilian_male_1_right",
    frames: game.anims.generateFrameNumbers(ASSETS.NPC_CIVILIAN_MALE_1, {
      frames: [8, 9, 10, 11]
    }),
    frameRate: 10,
    repeat: -1
  });
  game.anims.create({
    key: "npc_civilian_male_1_up",
    frames: game.anims.generateFrameNumbers(ASSETS.NPC_CIVILIAN_MALE_1, {
      frames: [12, 13, 14, 15]
    }),
    frameRate: 10,
    repeat: -1
  });
  game.anims.create({
    key: "npc_civilian_male_1_down",
    frames: game.anims.generateFrameNumbers(ASSETS.NPC_CIVILIAN_MALE_1, {
      frames: [0, 1, 2, 3]
    }),
    frameRate: 10,
    repeat: -1
  });

  game.anims.create({
    key: "npc_civilian_male_1_idle",
    frames: game.anims.generateFrameNumbers(ASSETS.NPC_CIVILIAN_MALE_1, {
      frames: [0]
    }),
    frameRate: 10,
    repeat: -1
  });
}
