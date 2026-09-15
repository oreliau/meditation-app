```bash
sbx mcp add expo --url https://mcp.expo.dev/mcp
sbx secret set openai --oauth
docker build -t codex-pnpm:v1 ./sandbox/templates/codex-pnpm
docker image save codex-pnpm:v1 -o codex-pnpm.tar
sbx template load codex-pnpm.tar
sbx run ./sandbox/kits/codex-luna -t codex-pnpm:v1 --clone --name test  --static-mcp stitch,expo
docker build -t claude-code-pnpm:v1 .
docker image save claude-code-pnpm:v1 -o claude-code-pnpm.tar
sbx template load claude-code-pnpm.tar
sbx run ./sandbox/kits/claude-sonnet -t claude-code-pnpm:v1 --clone --name test
docker build -t claude-code-pnpm:v1 ./sandbox/templates/claude-code-pnpm
sbx run claude --kit . --clone --name chore-unistyle  --static-mcp stitch,expo
sbx run ./kits/claude-sonnet --clone --name chore-unistyle  --static-mcp stitch,expo
sbx mcp auth expo
sbx policy allow network mcp.expo.dev
sbx secret set github --sandbox claude-meditation-app -t "$(gh auth token)"
sbx run claude --clone  --static-mcp stitch,expo
sbx port name-of-sandbox --publish 3000:3000
sbx exec -it name-of-sandbox bash
```