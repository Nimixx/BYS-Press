#!/bin/bash

# Production Bundle Script for WordPress Theme
# This script creates a production-ready zip file of the theme

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG_FILE="$THEME_DIR/bundle.config.json"

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}Error: bundle.config.json not found!${NC}"
    exit 1
fi

# Read config using a simple parser (works on macOS and Linux)
THEME_NAME=$(grep -o '"themeName"[[:space:]]*:[[:space:]]*"[^"]*"' "$CONFIG_FILE" | sed 's/.*"themeName"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
OUTPUT_DIR=$(grep -o '"outputDir"[[:space:]]*:[[:space:]]*"[^"]*"' "$CONFIG_FILE" | sed 's/.*"outputDir"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')

# Create output directory if it doesn't exist
mkdir -p "$THEME_DIR/$OUTPUT_DIR"

# Create a temporary directory for the bundle
TEMP_DIR=$(mktemp -d)
BUNDLE_DIR="$TEMP_DIR/$THEME_NAME"

echo -e "${YELLOW}Creating production bundle...${NC}"
echo "Theme: $THEME_NAME"
echo "Output: $OUTPUT_DIR"

# Copy all files to temp directory
mkdir -p "$BUNDLE_DIR"
cp -r "$THEME_DIR"/* "$BUNDLE_DIR/" 2>/dev/null || true
cp -r "$THEME_DIR"/.[!.]* "$BUNDLE_DIR/" 2>/dev/null || true

# Read exclude patterns and remove them from bundle
echo -e "${YELLOW}Removing excluded files and directories...${NC}"

# Extract exclude patterns from config (simple approach)
EXCLUDES=$(grep -A 100 '"exclude"' "$CONFIG_FILE" | grep -o '"[^"]*"' | sed 's/"//g' | grep -v "exclude")

for EXCLUDE in $EXCLUDES; do
    # Remove glob patterns (like *.md)
    if [[ "$EXCLUDE" == *"*"* ]]; then
        find "$BUNDLE_DIR" -name "$EXCLUDE" -type f -delete 2>/dev/null || true
    else
        # Remove specific files or directories
        rm -rf "$BUNDLE_DIR/$EXCLUDE" 2>/dev/null || true
    fi
    echo "  - Excluded: $EXCLUDE"
done

# Generate timestamp for the bundle
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ZIP_NAME="${THEME_NAME}_${TIMESTAMP}.zip"
ZIP_PATH="$THEME_DIR/$OUTPUT_DIR/$ZIP_NAME"

# Create zip file
echo -e "${YELLOW}Creating zip file...${NC}"
cd "$TEMP_DIR"
zip -r -q "$ZIP_PATH" "$THEME_NAME"

# Clean up
rm -rf "$TEMP_DIR"

# Get file size
FILE_SIZE=$(du -h "$ZIP_PATH" | cut -f1)

echo -e "${GREEN}✓ Bundle created successfully!${NC}"
echo -e "Location: ${GREEN}$OUTPUT_DIR/$ZIP_NAME${NC}"
echo -e "Size: ${GREEN}$FILE_SIZE${NC}"

# Create a symlink to the latest bundle
LATEST_LINK="$THEME_DIR/$OUTPUT_DIR/${THEME_NAME}_latest.zip"
rm -f "$LATEST_LINK"
ln -s "$ZIP_NAME" "$LATEST_LINK"
echo -e "Latest: ${GREEN}$OUTPUT_DIR/${THEME_NAME}_latest.zip${NC}"

# Copy installation instructions next to the bundle
if [ -f "$THEME_DIR/INSTALL.md" ]; then
    INSTALL_NAME="${THEME_NAME}_${TIMESTAMP}_INSTALL.md"
    cp "$THEME_DIR/INSTALL.md" "$THEME_DIR/$OUTPUT_DIR/$INSTALL_NAME"

    # Also create a latest symlink for the install guide
    LATEST_INSTALL="$THEME_DIR/$OUTPUT_DIR/${THEME_NAME}_INSTALL.md"
    rm -f "$LATEST_INSTALL"
    ln -s "$INSTALL_NAME" "$LATEST_INSTALL"

    echo -e "Install Guide: ${GREEN}$OUTPUT_DIR/$INSTALL_NAME${NC}"
fi
