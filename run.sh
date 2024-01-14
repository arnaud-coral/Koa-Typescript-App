#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | sed 's/#.*//g' | xargs)
fi

# Stop the script if NODE_ENV is not set
if [ -z "$NODE_ENV" ]; then
    echo "NODE_ENV is not set. Exiting..."
    exit 1
fi

# Notify which environment is being run
echo "Running app in $NODE_ENV environment..."

# Check if NODE_ENV is set to 'local'
if [ "$NODE_ENV" = "local" ]; then
    docker-compose -f docker-compose.local.yml up --build
else
    docker-compose -f docker-compose.yml up --build
fi
