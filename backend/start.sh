#!/bin/bash

# Exit immediately if any command fails
set -e

# Set optimal Gunicorn settings based on environment
if [ "$RENDER" = "true" ]; then
  # Production settings for Render
  WORKERS=4
  THREADS=4
  TIMEOUT=120
else
  # Development settings
  WORKERS=2
  THREADS=2
  TIMEOUT=60
fi

exec gunicorn \
  --bind 0.0.0.0:$PORT \
  --workers $WORKERS \
  --threads $THREADS \
  --timeout $TIMEOUT \
  --preload \
  --access-logfile - \
  --error-logfile - \
  wsgi:app