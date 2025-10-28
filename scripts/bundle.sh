#!/bin/bash

# Production Bundle Script for WordPress Theme
# This script creates a production-ready zip file of the theme

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG_FILE="$THEME_DIR/bundle.config.json"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}WordPress Theme Production Bundle${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}✗ Error: bundle.config.json not found!${NC}"
    exit 1
fi

# Read config
THEME_NAME=$(grep -o '"themeName"[[:space:]]*:[[:space:]]*"[^"]*"' "$CONFIG_FILE" | sed 's/.*"themeName"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
VERSION=$(grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' "$CONFIG_FILE" | sed 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
OUTPUT_DIR=$(grep -o '"outputDir"[[:space:]]*:[[:space:]]*"[^"]*"' "$CONFIG_FILE" | sed 's/.*"outputDir"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')

echo -e "${YELLOW}Theme:${NC} $THEME_NAME"
echo -e "${YELLOW}Version:${NC} $VERSION"
echo -e "${YELLOW}Output:${NC} $OUTPUT_DIR\n"

# Step 1: Clean previous build
echo -e "${YELLOW}[1/5] Cleaning previous build...${NC}"
if [ -d "$THEME_DIR/dist" ]; then
    rm -rf "$THEME_DIR/dist"
    echo -e "${GREEN}✓ Cleaned dist directory${NC}\n"
else
    echo -e "${GREEN}✓ No previous build found${NC}\n"
fi

# Step 2: Run production build
echo -e "${YELLOW}[2/5] Running production build...${NC}"
cd "$THEME_DIR"

if ! npm run build; then
    echo -e "\n${RED}✗ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build completed successfully${NC}\n"

# Step 3: Validate build output
echo -e "${YELLOW}[3/5] Validating build output...${NC}"

if [ ! -d "$THEME_DIR/dist" ]; then
    echo -e "${RED}✗ dist directory not found!${NC}"
    exit 1
fi

REQUIRED_FILES=("dist/js/main.js" "dist/css/main.css" "dist/manifest.json")
for FILE in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$THEME_DIR/$FILE" ]; then
        echo -e "${RED}✗ Required file not found: $FILE${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✓ All required files present${NC}\n"

# Step 4: Create bundle
echo -e "${YELLOW}[4/5] Creating production bundle...${NC}"

# Create output directory
mkdir -p "$THEME_DIR/$OUTPUT_DIR"

# Create temporary directory
TEMP_DIR=$(mktemp -d)
BUNDLE_DIR="$TEMP_DIR/$THEME_NAME"
mkdir -p "$BUNDLE_DIR"

# Copy only included files
INCLUDES=$(grep -A 100 '"include"' "$CONFIG_FILE" | grep -o '"[^"]*"' | sed 's/"//g' | grep -v "include")

for INCLUDE in $INCLUDES; do
    if [ -e "$THEME_DIR/$INCLUDE" ]; then
        if [ -d "$THEME_DIR/$INCLUDE" ]; then
            cp -r "$THEME_DIR/$INCLUDE" "$BUNDLE_DIR/"
            echo "  ✓ Copied: $INCLUDE/"
        else
            cp "$THEME_DIR/$INCLUDE" "$BUNDLE_DIR/"
            echo "  ✓ Copied: $INCLUDE"
        fi
    else
        echo "  ⚠ Skipped (not found): $INCLUDE"
    fi
done

echo ""

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ZIP_NAME="${THEME_NAME}_v${VERSION}_${TIMESTAMP}.zip"
ZIP_PATH="$THEME_DIR/$OUTPUT_DIR/$ZIP_NAME"

# Create zip file
echo -e "${YELLOW}Creating archive...${NC}"
cd "$TEMP_DIR"
zip -r -q "$ZIP_PATH" "$THEME_NAME"

# Clean up temp directory
rm -rf "$TEMP_DIR"

# Get file size
FILE_SIZE=$(du -h "$ZIP_PATH" | cut -f1)

echo -e "${GREEN}✓ Archive created${NC}\n"

# Step 5: Create symlinks and summary
echo -e "${YELLOW}[5/5] Finalizing...${NC}"

# Create symlink to latest bundle
LATEST_LINK="$THEME_DIR/$OUTPUT_DIR/${THEME_NAME}_latest.zip"
rm -f "$LATEST_LINK"
cd "$THEME_DIR/$OUTPUT_DIR"
ln -s "$ZIP_NAME" "${THEME_NAME}_latest.zip"

echo -e "${GREEN}✓ Created latest symlink${NC}\n"

# Final summary
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Bundle created successfully!${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${YELLOW}Bundle Details:${NC}"
echo -e "  File: ${GREEN}$ZIP_NAME${NC}"
echo -e "  Size: ${GREEN}$FILE_SIZE${NC}"
echo -e "  Path: ${GREEN}$OUTPUT_DIR/$ZIP_NAME${NC}"
echo -e "  Latest: ${GREEN}$OUTPUT_DIR/${THEME_NAME}_latest.zip${NC}\n"

echo -e "${YELLOW}Contents:${NC}"
for INCLUDE in $INCLUDES; do
    if [ -e "$THEME_DIR/$INCLUDE" ]; then
        echo -e "  ${GREEN}✓${NC} $INCLUDE"
    fi
done

echo -e "\n${GREEN}Ready for deployment!${NC}\n"
