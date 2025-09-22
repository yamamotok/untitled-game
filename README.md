Untitled Game Project
----------------

This project is a "monorepo" and contains the following workspaces:
- server ... ws and game services in Node.js
- client ... web client

Both workspaces are managed by npm (npm workspaces).
Both are TypeScript projects.

Useful commands (run from repo root):
- npm install — installs dependencies across all workspaces
- npm run -w @untitled-game/client build — build client
- npm run -w @untitled-game/server build — build server
- npm exec -w @untitled-game/client tsc -- -v — run a tool in a workspace
