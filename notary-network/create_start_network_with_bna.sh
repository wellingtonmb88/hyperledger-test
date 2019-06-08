#!/bin/bash
if [ -z "$1" ]
  then
    echo "No argument VERSION supplied"
else
    npm version  $1

    composer archive create --sourceType dir --sourceName . -a notary-network@$1.bna

    composer network install --card PeerAdmin@notary-network --archiveFile notary-network@$1.bna

    composer network start --networkName notary-network --networkVersion $1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@notary-network  --file networkadmin.card

    npm run prepublish
fi

