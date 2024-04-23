---
sidebar_position: 2
---

# Testnet

## Overview

The current HAQQ version of testedge2 is [`v1.7.3`](https://github.com/haqq-network/haqq/releases/tag/v1.7.3).

Sources of all scripts are here [`github`](https://github.com/haqq-network/testnets/tree/main/TestEdge2)

## Quickstart

_*Battle tested on [Ubuntu LTS 22.04](https://spinupwp.com/doc/what-does-lts-mean-ubuntu/#:~:text=The%20abbreviation%20stands%20for%20Long,extended%20period%20over%20regular%20releases)*_

Install packages:

```sh
sudo apt-get install curl git make gcc liblz4-tool build-essential jq bzip2 -y
```

**You can try to find latest compiled binary for your arch**:

https://github.com/haqq-network/haqq/releases/tag/v1.7.3

**Preresquisites for compile from source**

- `make` & `gcc`
- `Go 1.20+`

Easy Go compiler installation:
```sh
bash <(curl -s https://raw.githubusercontent.com/haqq-network/mainnet/master/install_go.sh) && \
source $HOME/.bash_profile
```


Build from source:

```sh
cd $HOME
git clone -b v1.7.3 https://github.com/haqq-network/haqq
cd haqq
make install
```

Check binary version:

```sh
haqq@haqq-node:~# haqqd -v
haqqd version "1.7.3" 1cdd044523cffd0a2428b139f611a48a60045a1b
```

**Run pipline**

- `init folders`
- `download genesis file for testnet`
- `download current addrbook`
- `download and run state sync settings script`
- `start`

```sh
CUSTOM_MONIKER="haqq_node_testedge2"

haqqd config chain-id haqq_54211-3 && \
haqqd init CUSTOM_MONIKER --chain-id haqq_54211-3

# Prepare genesis file for TestEdge(haqq_54211-3)
curl -OL https://raw.githubusercontent.com/haqq-network/testnets/main/TestEdge2/genesis.tar.bz2 &&\
bzip2 -d genesis.tar.bz2 && tar -xvf genesis.tar &&\
mv genesis.json $HOME/.haqqd/config/genesis.json

# Prepare addrbook
curl -OL https://raw.githubusercontent.com/haqq-network/testnets/main/TestEdge2/addrbook.json &&\
mv addrbook.json $HOME/.haqqd/config/addrbook.json

# Configure State sync
curl -OL https://raw.githubusercontent.com/haqq-network/testnets/main/TestEdge2/state_sync.sh &&\
sh state_sync.sh

# Start Haqq
haqqd start
```

## Upgrade to Validator Node

You now have an active full node. What's the next step? You can upgrade your full node to become a Haqq Validator. The top 150 validators have the ability to propose new blocks to the Haqq Network. Continue onto the [Run a Validator](../run-a-validator.md)..
