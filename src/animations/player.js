import ASSETS from "../constants/assets";

export default function createPlayerAnimations(game) {
  game.anims.create({
    key: "left",
    frames: game.anims.generateFrameNumbers(ASSETS.PLAYER, {
      frames: [4, 5, 6, 7]
    }),
    frameRate: 10,
    repeat: -1
  });
  game.anims.create({
    key: "right",
    frames: game.anims.generateFrameNumbers(ASSETS.PLAYER, {
      frames: [8, 9, 10, 11]
    }),
    frameRate: 10,
    repeat: -1
  });
  game.anims.create({
    key: "up",
    frames: game.anims.generateFrameNumbers(ASSETS.PLAYER, {
      frames: [12, 13, 14, 15]
    }),
    frameRate: 10,
    repeat: -1
  });
  game.anims.create({
    key: "down",
    frames: game.anims.generateFrameNumbers(ASSETS.PLAYER, {
      frames: [0, 1, 2, 3]
    }),
    frameRate: 10,
    repeat: -1
  });
}
