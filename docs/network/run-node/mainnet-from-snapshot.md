---
sidebar_position: 1
---

# Mainnet from Snapshot 

## Overview

The current HAQQ version of mainnet is [`v1.8.5`](https://github.com/haqq-network/haqq/releases/tag/v1.8.5).
Sources of all scripts are here [`github`](https://github.com/haqq-network/mainnet)

## Quickstart

_*Battle tested on [Ubuntu LTS 22.04](https://spinupwp.com/doc/what-does-lts-mean-ubuntu/#:~:text=The%20abbreviation%20stands%20for%20Long,extended%20period%20over%20regular%20releases)*_

**You can follow these steps to set up your environment:**

Install packages:

```sh
sudo apt-get update && \
sudo apt-get install curl git make gcc liblz4-tool build-essential jq aria2 -y
```

**Preresquisites for compile from source**

- `make` & `gcc`
- `Go 1.21+`

**Easy GO compiler and HAQQ Node installation**

```sh
bash <(curl -s https://raw.githubusercontent.com/haqq-network/mainnet/master/install_go.sh) && \
source $HOME/.bash_profile && \
bash <(curl -s https://raw.githubusercontent.com/haqq-network/mainnet/master/install_haqq.sh)
```

**Do the same manually:**

Download latest binary for your arch:
https://github.com/haqq-network/haqq/releases/tag/v1.8.5

Build from source:

```sh
cd $HOME
git clone -b v1.8.5 https://github.com/haqq-network/haqq
cd haqq
make install
```

Verify Binary Version:

```sh
haqq@haqq-node:~# haqqd -v
haqqd version 1.8.5 9ddfca4b98943e106de99fd525b6bb05bfe66d34
```

**Initialize**

Run script:

```sh
export CUSTOM_MONIKER="mainnet_node"
export HAQQD_DIR="$HOME/.haqqd" # default haqq home folder

haqqd config chain-id haqq_11235-1 && \
haqqd init $CUSTOM_MONIKER --chain-id haqq_11235-1

# Prepare genesis file for mainet(haqq_11235-1)
curl -L https://raw.githubusercontent.com/haqq-network/mainnet/master/genesis.json -o $HAQQD_DIR/config/genesis.json

# Prepare addrbook
curl -L https://raw.githubusercontent.com/haqq-network/mainnet/master/addrbook.json -o $HAQQD_DIR/config/addrbook.json
```

After that need to download a haqq node snapshot from one of our providers:

- [Polkachu](https://polkachu.com/tendermint_snapshots/haqq)
- [Publicnode](https://publicnode.com/snapshots)

Example download command via aria2(via polkachu):
```ruby
aria2c https://snapshots.polkachu.com/snapshots/haqq/haqq_12345540.tar.lz4
```

And decompress to HAQQD_DIR and start node(archive name is just for example use actual name from provider)

Example for Polkachu format:
```sh
lz4 -c -d haqq_12345540.tar.lz4  | tar -x -C $HAQQD_DIR
```
Example for Publicnode format:
```sh
lz4 -c -d haqq-pruned-12345957-12345967.tar.lz4  | tar -x -C $HAQQD_DIR
```

After decompress you can try to start the node:
```sh
haqqd start
```

## Upgrade to Validator Node

You now have an active full node. What's the next step? You can upgrade your full node to become a Haqq Validator. The top 150 validators have the ability to propose new blocks to the Haqq Network. Continue onto the [Run a Validator](../run-a-validator.md).
