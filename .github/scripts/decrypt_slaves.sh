#!/bin/sh

# --batch to prevent interactive command
# --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$SLAVES_JSON_KEY" \
--output node_project/slaves.json node_project/slaves.json.gpg