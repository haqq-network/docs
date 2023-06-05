---
sidebar_position: 3
---

# Mainnet

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
- `Go 1.19+` ([How to install Go](https://www.digitalocean.com/community/tutorials/how-to-install-go-on-ubuntu-20-04))

**Easy GO compiler and HAQQ node installation**

```sh
curl -OL https://raw.githubusercontent.com/haqq-network/mainnet/master/install_go.sh && \
curl -OL https://raw.githubusercontent.com/haqq-network/mainnet/master/install_haqq.sh && \
sh install_go.sh && \
source $HOME/.bash_profile && \
sh install_haqq.sh
```

**Do the same manually:**

Download latest binary for your arch:
https://github.com/haqq-network/haqq/releases/tag/v1.3.1

Build from source:

```sh
cd $HOME
git clone -b v1.3.1 https://github.com/haqq-network/haqq
cd haqq
make install
```

Verify binary version:

```sh
haqq@haqq-node:~# haqqd -v
haqqd version "1.3.1" 877c235c1b86b0c734fb482fdebdec71bdc47b07
```

**Initialize and start HAQQ**

Run script:

```sh
curl -OL https://raw.githubusercontent.com/haqq-network/mainnet/master/init_start.sh && \
sh init_start.sh mainnet_node
```

_`mainnet_node`_ is argument value for custom moniker
