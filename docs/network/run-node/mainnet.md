---
sidebar_position: 1
---

# Mainnet

## Overview

The current HAQQ version of mainnet is [`v1.7.4`](https://github.com/haqq-network/haqq/releases/tag/v1.7.4).

Sources of all scripts are here [`github`](https://github.com/haqq-network/mainnet)

## Quickstart

_*Battle tested on [Ubuntu LTS 22.04](https://spinupwp.com/doc/what-does-lts-mean-ubuntu/#:~:text=The%20abbreviation%20stands%20for%20Long,extended%20period%20over%20regular%20releases)*_

**All-in-one(tested on Ubuntu LTS):**

You can easily install all dependencies and the HAQQ node binary by using a single bash script.

```sh
CUSTOM_MONIKER="haqq_node" && \
curl -OL https://raw.githubusercontent.com/haqq-network/mainnet/master/all_in_one.sh && \
sudo sh all_in_one.sh "$CUSTOM_MONIKER"
```

**You can do the same yourself**

Install packages:

```sh
sudo apt-get update && \
sudo apt-get install curl git make gcc liblz4-tool build-essential jq -y
```

**Preresquisites for compile from source**

- `make` & `gcc`
- `Go 1.21+`

**Easy GO compiler and HAQQ node installation**

```sh
bash <(curl -s https://raw.githubusercontent.com/haqq-network/mainnet/master/install_go.sh) && \
source $HOME/.bash_profile && \
bash <(curl -s https://raw.githubusercontent.com/haqq-network/mainnet/master/install_haqq.sh)
```

**Do the same manually:**

Download latest binary for your arch:
https://github.com/haqq-network/haqq/releases/tag/v1.7.4

Build from source:

```sh
cd $HOME
git clone -b v1.7.4 https://github.com/haqq-network/haqq
cd haqq
make install
```

Verify binary version:

```sh
haqq@haqq-node:~# haqqd -v
haqqd version "1.7.4" b531ad3a9d86df47f28e5e6da133cea5c66a8d03
```

**Initialize and start HAQQ**

Run script:

```sh
curl -OL https://raw.githubusercontent.com/haqq-network/mainnet/master/init_start.sh && \
sh init_start.sh mainnet_node
```

_`mainnet_node`_ is argument value for custom moniker

## Upgrade to Validator Node

You now have an active full node. What's the next step? You can upgrade your full node to become a Haqq Validator. The top 150 validators have the ability to propose new blocks to the Haqq Network. Continue onto the [Run a Validator](../run-a-validator.md).
