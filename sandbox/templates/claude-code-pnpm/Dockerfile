FROM docker/sandbox-templates:claude-code

USER root

RUN apt-get update && curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
	&& apt-get install -y nodejs \
	&& rm -rf /var/lib/apt/lists/*

RUN npm install -g corepack \
	&& corepack enable pnpm 

RUN chown -R agent:agent /home/agent/.claude

USER agent
