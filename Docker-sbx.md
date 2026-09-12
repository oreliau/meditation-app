sbx mcp add expo --url https://mcp.expo.dev/mcp
sbx run claude --kit . --clone --name chore-unistyle
sbx run ./kits/claude-sonnet --clone --name chore-unistyle
sbx mcp auth expo
sbx policy allow network mcp.expo.dev
sbx secret set github --sandbox claude-meditation-app -t "$(gh auth token)"
sbx run claude --clone
sbx port name-of-sandbox --publish 3000:3000
sbx exec -it name-of-sandbox bash
