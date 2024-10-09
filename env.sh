#!/bin/bash

# Define the source and target files
SOURCE_FILE=".env.example"
TARGET_FILE_ROOT=".env"
TARGET_FILE_APP="app/.env"

# Check if the source file exists
if [ ! -f "$SOURCE_FILE" ]; then
  echo "Error: $SOURCE_FILE not found!"
  exit 1
fi

# Copy the .env.example to .env in the root directory
cp "$SOURCE_FILE" "$TARGET_FILE_ROOT"
echo "Copied $SOURCE_FILE to $TARGET_FILE_ROOT"

# Copy the .env to the app/ directory
cp "$TARGET_FILE_ROOT" "$TARGET_FILE_APP"
echo "Copied $TARGET_FILE_ROOT to $TARGET_FILE_APP"
