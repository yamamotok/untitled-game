# Untitled Game — Development Guidelines

## Technical Guidelines

### Packages

This project is a mono-repo managed by npm workspaces. It contains the following packages:

- Web Client `/packages/client`
- WebSocket Server `/packages/ws`
- Worker `/packages/worker`

- Models `/libs/model`
- Database (Redis) utilities `/libs/database`
- Message dispatcher utility `/libs/dispatcher`

### TypeScript

All packages are written in TypeScript.

### Game world rendering on the client side

We use [Pixi.js](https://pixijs.com/) version 8.

---

## Specifications

This is a top-down view 2D game.

### World

The World is a 2D grid of Tiles. World size is 10 x 10.

### Tile

A Tile is a 50 x 50 pixel square.
