import {
  AnimatedSprite,
  Application,
  Assets,
  Container,
  Rectangle,
  Sprite,
  Texture,
} from 'pixi.js';

import { World, WorldSchema } from '@untitled-game/model';

export const TILE_SIZE = 50; // px per guidelines

// Keep track of rendered player sprites
// playerId -> Sprite
const playerSprites = new Map<string, Sprite>();
// Keep track of rendered ghost sprites
// ghostId -> Sprite
const ghostSprites = new Map<string, Sprite>();
const world = new (class {
  current: World = WorldSchema.parse({ players: [] });
})();

export async function initPixi() {
  // Grid constants per spec
  const GRID_SIZE = 10; // 10x10
  const WIDTH = TILE_SIZE * GRID_SIZE; // 480
  const HEIGHT = WIDTH;

  // Create and init the Pixi application
  const app = new Application();
  await app.init({ width: WIDTH, height: HEIGHT, background: '#000000' });

  // Mount canvas into the #container element
  const containerEl = document.getElementById('container');
  if (containerEl) {
    containerEl.innerHTML = '';
    containerEl.appendChild(app.canvas);
  } else {
    document.body.appendChild(app.canvas);
  }

  // Load the grass spritesheet image and draw ground
  const grassUrl = new URL('../image/grass-spritesheet.png', import.meta.url).href;
  const grassBase = await Assets.load(grassUrl);

  // Create a 16x16 tile texture from (4, 0) position of the spritesheet
  // Each tile in the spritesheet is 16x16 pixels
  const tileTexture = new Texture({ source: grassBase, frame: new Rectangle(4 * 16, 0, 16, 16) });

  // Build a 16x16 grid of tiles
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const tile = new Sprite(tileTexture);
      tile.x = x * TILE_SIZE;
      tile.y = y * TILE_SIZE;
      tile.width = TILE_SIZE;
      tile.height = TILE_SIZE;
      app.stage.addChild(tile);
    }
  }

  // Create a layer for players (above ground)
  const playersLayer = new Container<Sprite>();
  app.stage.addChild(playersLayer);

  // Create a separate layer for ghosts (above players)
  const ghostsLayer = new Container<Sprite>();
  app.stage.addChild(ghostsLayer);

  // Load dino spritesheet and prepare two animation frames (first and second columns), source tiles are 24x24
  const dinoUrl = new URL('../image/dino-spritesheet.png', import.meta.url).href;
  const dinoBase = await Assets.load(dinoUrl);
  const frame0 = new Texture({ source: dinoBase, frame: new Rectangle(0, 0, 24, 24) });
  const frame1 = new Texture({ source: dinoBase, frame: new Rectangle(24, 0, 24, 24) });
  const dino = () => {
    const spr = new AnimatedSprite([
      { texture: frame0, time: 780 },
      { texture: frame1, time: 780 },
    ]);
    spr.scale.set(TILE_SIZE / 24);
    spr.play();
    return spr;
  };

  // Prepare ghost texture (column 12 of the same spritesheet)
  const ghostTexture = new Texture({ source: dinoBase, frame: new Rectangle(12 * 24, 0, 24, 24) });
  const ghost = () => {
    const spr = new Sprite(ghostTexture);
    spr.scale.set(TILE_SIZE / 24);
    return spr;
  };

  // Update the positions of players
  app.ticker.add((ticker) => {
    const dinoSpeed = 0.55; // pixels per millisecond
    for (const [playerId, spr] of playerSprites) {
      const player = world.current.players.find((p) => p.playerId === playerId);
      if (!player) {
        continue;
      }
      const xd = player.pos.x * TILE_SIZE - spr.x;
      const yd = player.pos.y * TILE_SIZE - spr.y;
      const threshold = 5.0;
      if (xd > threshold) {
        spr.x += dinoSpeed * ticker.deltaMS;
      } else if (xd < -threshold) {
        spr.x -= dinoSpeed * ticker.deltaMS;
      } else {
        spr.x = player.pos.x * TILE_SIZE;
      }
      if (yd > threshold) {
        spr.y += dinoSpeed * ticker.deltaMS;
      } else if (yd < -threshold) {
        spr.y -= dinoSpeed * ticker.deltaMS;
      } else {
        spr.y = player.pos.y * TILE_SIZE;
      }
    }
  });

  // Animate ghosts: fly horizontally left-to-right
  app.ticker.add((ticker) => {
    const ghostSpeed = 4.5;
    for (const [_, spr] of ghostSprites) {
      spr.x += ghostSpeed * ticker.deltaTime;
    }
  });

  const onUpdate = (world_: World) => {
    world.current = world_;

    // Render players according to the latest world snapshot
    const playerIds = new Set<string>();
    for (const p of world.current.players) {
      playerIds.add(p.playerId);
      let spr = playerSprites.get(p.playerId);
      if (!spr) {
        spr = dino();
        playersLayer.addChild(spr);
        playerSprites.set(p.playerId, spr);
        spr.x = p.pos.x * TILE_SIZE;
        spr.y = p.pos.y * TILE_SIZE;
      }
    }
    // Remove sprites for players that no longer exist in the world snapshot
    for (const [id, spr] of playerSprites) {
      if (!playerIds.has(id)) {
        playersLayer.removeChild(spr);
        playerSprites.delete(id);
      }
    }

    // Render ghosts according to the latest world snapshot
    const ghostIds = new Set<string>();
    for (const g of world.current.ghosts ?? []) {
      ghostIds.add(g.id);
      let spr = ghostSprites.get(g.id);
      if (!spr) {
        spr = ghost();
        ghostsLayer.addChild(spr);
        ghostSprites.set(g.id, spr);
        spr.x = g.pos.x * TILE_SIZE;
        spr.y = g.pos.y * TILE_SIZE;
      }
    }
    // Remove sprites for ghosts that no longer exist in the world snapshot
    for (const [id, spr] of ghostSprites) {
      if (!ghostIds.has(id)) {
        ghostsLayer.removeChild(spr);
        ghostSprites.delete(id);
      }
    }
  };

  return { onUpdate };
}
