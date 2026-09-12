#!/bin/bash

# Script to start a new feature with Claude
# Prompts for feature name, prompt, MCP selection, then runs sbx with grill-with-docs

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Start a New Feature${NC}"
echo ""

# Prompt for feature name
read -p "Feature name: " FEATURE_NAME

if [ -z "$FEATURE_NAME" ]; then
    echo "Error: Feature name cannot be empty"
    exit 1
fi

echo ""

# Prompt for prompt/description
echo "Enter the prompt for the feature (press Enter twice when done):"
PROMPT=""
while IFS= read -r line; do
    if [ -z "$line" ]; then
        if [ -z "$PROMPT" ]; then
            continue
        else
            break
        fi
    fi
    PROMPT="${PROMPT}${line} "
done

PROMPT=$(echo "$PROMPT" | xargs) # Trim whitespace

if [ -z "$PROMPT" ]; then
    echo "Error: Prompt cannot be empty"
    exit 1
fi

echo ""

# Get available MCPs
echo -e "${BLUE}📦 Fetching available MCPs...${NC}"
MCP_LIST=$(sbx mcp ls 2>/dev/null | tail -n +2) # Skip header

if [ -z "$MCP_LIST" ]; then
    echo "No MCPs available"
    SELECTED_MCPS=""
else
    echo -e "${YELLOW}Available MCPs:${NC}"

    # Create array of MCPs
    MCP_ARRAY=()
    while IFS= read -r line; do
        MCP_ARRAY+=("$line")
    done <<< "$MCP_LIST"

    # Display MCPs with numbers
    for i in "${!MCP_ARRAY[@]}"; do
        echo "  $((i + 1)). ${MCP_ARRAY[$i]}"
    done

    echo ""
    echo "Select MCPs to enable (enter numbers separated by commas, or leave empty for none):"
    read -p "Selection (e.g., 1,3,5): " MCP_SELECTION

    # Parse selected MCPs
    SELECTED_MCPS=""
    if [ ! -z "$MCP_SELECTION" ]; then
        IFS=',' read -ra INDICES <<< "$MCP_SELECTION"
        for idx in "${INDICES[@]}"; do
            idx=$(echo "$idx" | xargs) # Trim whitespace
            if [[ "$idx" =~ ^[0-9]+$ ]] && [ "$idx" -ge 1 ] && [ "$idx" -le "${#MCP_ARRAY[@]}" ]; then
                if [ -z "$SELECTED_MCPS" ]; then
                    SELECTED_MCPS="${MCP_ARRAY[$((idx - 1))]}"
                else
                    SELECTED_MCPS="${SELECTED_MCPS},${MCP_ARRAY[$((idx - 1))]}"
                fi
            fi
        done
    fi
fi

echo ""
echo -e "${GREEN}✓ Starting feature: $FEATURE_NAME${NC}"
echo -e "${GREEN}✓ Prompt: $PROMPT${NC}"
if [ ! -z "$SELECTED_MCPS" ]; then
    echo -e "${GREEN}✓ MCPs: $SELECTED_MCPS${NC}"
fi
echo ""

# Build sbx command
SBX_CMD="sbx run ./sandbox/kits/claude-sonnet -t claude-code-pnpm:v1 --clone --name \"$FEATURE_NAME\""

# Add static-mcp flag if MCPs are selected
if [ ! -z "$SELECTED_MCPS" ]; then
    SBX_CMD="$SBX_CMD --static-mcp $SELECTED_MCPS"
fi

SBX_CMD="$SBX_CMD . -- \"/grill-with-docs $PROMPT\""

# Run the sbx command
echo "Running: $SBX_CMD"
eval "$SBX_CMD"
