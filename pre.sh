#!/usr/bin/env bash
if [ ! -d "./docs/modules" ]; then
  echo "Modules directory not exists."
  mkdir -p ./docs/modules
fi

# Include the specs from Ethermint

if [ ! -d "./docs/modules/evm" ]; then
  echo "Directory emv/feemarket not exists."

  git clone https://github.com/evmos/ethermint.git
  mv ethermint/x/evm/spec/ ./docs/modules/evm
  mv ethermint/x/feemarket/spec/ ./docs/modules/feemarket
  rm -rf ethermint
fi

if [ ! -d "./docs/modules/auth" ]; then
  echo "Directory auth not exists."
  # Include the specs from Cosmos SDK
  git clone -b v0.45.8 https://github.com/cosmos/cosmos-sdk.git
  mv cosmos-sdk/x/auth/spec/ ./docs/modules/auth
  mv cosmos-sdk/x/bank/spec/ ./docs/modules/bank
  mv cosmos-sdk/x/crisis/spec/ ./docs/modules/crisis
  mv cosmos-sdk/x/distribution/spec/ ./docs/modules/distribution
  mv cosmos-sdk/x/gov/spec/ ./docs/modules/gov
  mv cosmos-sdk/x/slashing/spec/ ./docs/modules/slashing
  mv cosmos-sdk/x/staking/spec/ ./docs/modules/staking
  rm -rf cosmos-sdk
fi

if [ ! -d "./docs/modules/transfer" ]; then
  echo "Directory transfer not exists."

  # Include the specs from IBC go
  git clone https://github.com/cosmos/ibc-go.git --branch v3.1.0 --single-branch
  mv ibc-go/modules/apps/transfer/spec/ ./docs/modules/transfer
  rm -rf ibc-go
fi
