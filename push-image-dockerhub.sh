#!/bin/zsh

if [[ -z "$DOCKERHUB_PASSWORD" || -z "$DOCKERHUB_USERNAME" ]]; then
  echo "Environment variables DOCKERHUB_PASSWORD or DOCKERHUB_USERNAME are unset or empty."
  exit 1
fi

COMMIT_HASH=$(git rev-parse --short HEAD)
if [[ -z "$COMMIT_HASH" ]]; then
  echo "Failed to obtain the commit hash."
  exit 1
fi

docker build --platform linux/arm64/v8 . -t $DOCKERHUB_USERNAME/pdftextextractorapi:linux-
docker push $DOCKERHUB_USERNAME/pdftextextractorapi:$COMMIT_HASH
