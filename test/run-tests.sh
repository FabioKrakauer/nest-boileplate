#!/usr/bin/env bash

source ./test/.env.test
export DB_NAME="gir_test_backend"

npx run migration:up

if [ $? -ne 0 ]; then
    echo "Database not ready yet, trying again in 10 seconds"
    sleep 10

    if [ $? -ne 0 ]; then
        echo "Migration failed"
        exit 1
    fi
fi

npm run test