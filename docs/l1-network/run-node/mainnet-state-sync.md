---
sidebar_position: 3
---

# Mainnet from State-Sync

:::info Fresh snapshots

Latest pruned and archive snapshots for fast node sync are available at [HAQQ Snapshots](https://snapshots.haqq.network/index.html).

:::

:::tip Recommended: run from snapshot

We recommend running your node from a snapshot for the fastest and most reliable sync. See [Mainnet from Snapshot](mainnet-from-snapshot.md) for the step-by-step guide.

:::

## Overview

The current HAQQ version of mainnet is [`v1.9.1`](https://github.com/haqq-network/haqq/releases/tag/v1.9.1).
Sources of all scripts are here [`github`](https://github.com/haqq-network/mainnet)

## Quickstart

_*Battle tested on [Ubuntu LTS 22.04](https://spinupwp.com/doc/what-does-lts-mean-ubuntu/#:~:text=The%20abbreviation%20stands%20for%20Long,extended%20period%20over%20regular%20releases)*_

**All-in-one (tested on Ubuntu LTS):**

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
- `Go 1.23+`

**Easy GO compiler and HAQQ node installation**

```sh
bash <(curl -s https://raw.githubusercontent.com/haqq-network/mainnet/master/install_go.sh) && \
source $HOME/.bash_profile && \
bash <(curl -s https://raw.githubusercontent.com/haqq-network/mainnet/master/install_haqq.sh)
```

**Do the same manually:**

Download latest binary for your arch:
https://github.com/haqq-network/haqq/releases/tag/v1.9.1

Build from source:

```sh
cd $HOME
git clone -b v1.9.1 https://github.com/haqq-network/haqq
cd haqq
make install
```

Verify binary version:

```sh
haqq@haqq-node:~# haqqd -v
haqqd version 1.9.1 5998c256a2acc8fb523795cd5c9374716952c014
```

**Initialize and start HAQQ**

Run script:

```sh
curl -OL https://raw.githubusercontent.com/haqq-network/mainnet/master/init_start.sh && \
sh init_start.sh mainnet_node
```

_`mainnet_node`_ is argument value for custom moniker

# Set chain in client.toml
sed -i.bak 's/^chain-id = .*/chain-id = "haqq_11235-1"/' $HAQQD_DIR/config/client.toml

## Upgrade to Validator Node

You now have an active full node. What's the next step? You can upgrade your full node to become a Haqq Validator. The top 150 validators have the ability to propose new blocks to the Haqq Network. Continue onto the [Run a Validator](../run-a-validator.md).
