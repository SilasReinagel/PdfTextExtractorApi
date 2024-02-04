#!/bin/zsh

# Check if GHR_TOKEN or GHR_USERNAME is unset or empty
if [[ -z "$GHR_TOKEN" || -z "$GHR_USERNAME" ]]; then
  echo "Environment variables GHR_TOKEN or GHR_USERNAME are unset or empty."
  exit 1
fi

# Convert username to lowercase
GHR_USERNAME_LOWER=${GHR_USERNAME:l}

echo $GHR_TOKEN | docker login ghcr.io -u $GHR_USERNAME_LOWER --password-stdin

# Get the commit hash
COMMIT_HASH=$(git rev-parse --short HEAD)

# Verify that COMMIT_HASH is not empty
if [[ -z "$COMMIT_HASH" ]]; then
  echo "Failed to obtain the commit hash."
  exit 1
fi

# Build and push the image using the lowercase username
docker build --platform linux/amd64/v3 . -t ghcr.io/$GHR_USERNAME_LOWER/pdftextextractor:$COMMIT_HASH
docker push ghcr.io/$GHR_USERNAME_LOWER/pdftextextractor:$COMMIT_HASH
