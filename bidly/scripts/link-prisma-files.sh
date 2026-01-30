#!/bin/bash


# Create symbolic links for each .prisma file found
for file in $(find apps/server/src/app -type f -name "*.prisma"); do
    cp "$file" prisma/schema/$(basename "$file")
done