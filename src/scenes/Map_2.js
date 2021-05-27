import MapScene from "./MapScene";
import SCENES from "../constants/scenes";
import MAPS from "../constants/maps";

export default class Map_2 extends MapScene {
  constructor() {
    super(SCENES.MAP_2, MAPS.map_2.key);
  }

  create() {}
}
