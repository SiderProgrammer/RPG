export default function createRockyAnimations(game) {
  game.anims.create({
    key: "Sten0001_Rookie_idle",
    frames: "Sten0001_Rookie_idle",
    frameRate: 20,
    repeat: -1
  });
  game.anims.create({
    key: "Sten0001_Rookie_attack",
    frames: "Sten0001_Rookie_attack",
    frameRate: 30
  });
}
