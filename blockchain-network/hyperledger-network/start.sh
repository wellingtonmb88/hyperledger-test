#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -ev

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

docker-compose -f docker-compose.yml down

docker-compose -f docker-compose.yml up -d ca.notary.com orderer.notary.com couchdb peer1.notary.com peer2.notary.com peer1.observer.com peer2.observer.com

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

docker cp ./config/NotaryMSPanchors.tx peer1.notary.com:/opt/gopath/src/github.com/hyperledger/fabric
sleep 5
docker cp ./config/ObserverMSPanchors.tx peer1.observer.com:/opt/gopath/src/github.com/hyperledger/fabric
sleep 5



# Create the channel
docker exec -e "CORE_PEER_LOCALMSPID=NotaryMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@notary.com/msp" peer1.notary.com peer channel create -o orderer.notary.com:7050 -c notarychannel -f /etc/hyperledger/configtx/channel.tx
# Join peer0.notary.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=NotaryMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@notary.com/msp" peer1.notary.com peer channel join -b notarychannel.block
# # Join peer2.notary.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=NotaryMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@notary.com/msp" -e "CORE_PEER_ADDRESS=peer2.notary.com:7051" peer1.notary.com peer channel join -b notarychannel.block
 # Update the channel.
docker exec -e "CORE_PEER_LOCALMSPID=NotaryMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@notary.com/msp" -e "CORE_PEER_ADDRESS=peer1.notary.com:7051" peer1.notary.com  peer channel update -o  orderer.notary.com:7050 -c notarychannel -f ./NotaryMSPanchors.tx

sleep 5
docker cp peer1.notary.com:/opt/gopath/src/github.com/hyperledger/fabric ./config
sleep 5
docker cp ./config/fabric/notarychannel.block peer1.observer.com:/opt/gopath/src/github.com/hyperledger/fabric
sleep 5
docker cp ./config/fabric/notarychannel.block peer2.observer.com:/opt/gopath/src/github.com/hyperledger/fabric
sleep 5

# Join peer1.observer.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=ObserverMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@observer.com/msp" -e "CORE_PEER_ADDRESS=peer1.observer.com:7051" peer1.observer.com peer channel join -b notarychannel.block
# Join peer2.observer.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=ObserverMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@observer.com/msp" -e "CORE_PEER_ADDRESS=peer2.observer.com:7051" peer1.observer.com peer channel join -b notarychannel.block
# Update the channel.
docker exec -e "CORE_PEER_LOCALMSPID=ObserverMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@observer.com/msp" -e "CORE_PEER_ADDRESS=peer1.observer.com:7051" peer1.observer.com  peer channel update -o  orderer.notary.com:7050 -c notarychannel -f ./ObserverMSPanchors.tx