FROM docker/sandbox-templates:codex

# Keep the custom template compatible with the codex-luna sandbox kit. The
# base image supplies Codex; this flavor identifies the kit that launches it.
LABEL com.docker.sandboxes="templates" \
	com.docker.sandboxes.base="docker/sandbox-templates:codex" \
	com.docker.sandboxes.flavor="codex-luna"

USER root

ARG NODESOURCE_SETUP_SHA256=6e3d580f5bd7ccf2aa1e8df8d35c60d78e873c3ff8beb282c9bebd914904ad72

RUN curl -fsSL https://deb.nodesource.com/setup_24.x -o /tmp/nodesource-setup.sh \
	&& echo "${NODESOURCE_SETUP_SHA256}  /tmp/nodesource-setup.sh" | sha256sum --check --strict \
	&& bash /tmp/nodesource-setup.sh \
	&& rm /tmp/nodesource-setup.sh \
	&& apt-get update \
	&& apt-get install -y nodejs \
	&& rm -rf /var/lib/apt/lists/*

RUN npm install -g corepack@0.36.0 \
	&& corepack enable pnpm

RUN mkdir -p /home/agent/.codex \
	&& chown -R agent:agent /home/agent/.codex

USER agent
