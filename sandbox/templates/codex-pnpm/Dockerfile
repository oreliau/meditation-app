FROM docker/sandbox-templates:codex

# Keep the custom template compatible with the codex-luna sandbox kit. The
# base image supplies Codex; this flavor identifies the kit that launches it.
LABEL com.docker.sandboxes="templates" \
	com.docker.sandboxes.base="docker/sandbox-templates:codex" \
	com.docker.sandboxes.flavor="codex-luna"

USER root

RUN apt-get update && curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
	&& apt-get install -y nodejs \
	&& rm -rf /var/lib/apt/lists/*

RUN npm install -g corepack \
	&& corepack enable pnpm

RUN mkdir -p /home/agent/.codex \
	&& chown -R agent:agent /home/agent/.codex

USER agent
