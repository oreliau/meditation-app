sbx mcp add expo --url https://mcp.expo.dev/mcp
docker build -t claude-code-pnpm:v1 .
docker image save claude-code-pnpm:v1 -o claude-code-pnpm.tar
sbx template load claude-code-pnpm.tar
sbx run ./sandbox/kits/claude-sonnet -t claude-code-pnpm:v1 --clone --name test
docker build -t claude-code-pnpm:v1 ./sandbox/templates/claude-code-pnpm
sbx run claude --kit . --clone --name chore-unistyle
sbx run ./kits/claude-sonnet --clone --name chore-unistyle
sbx mcp auth expo
sbx policy allow network mcp.expo.dev
sbx secret set github --sandbox claude-meditation-app -t "$(gh auth token)"
sbx run claude --clone
sbx port name-of-sandbox --publish 3000:3000
sbx exec -it name-of-sandbox bash
