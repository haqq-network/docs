---
sidebar_position: 2
---

# Mainnet Full Node from Archive

## Overview

The current HAQQ version of mainnet is [`v1.8.5`](https://github.com/haqq-network/haqq/releases/tag/v1.8.5).
Sources of all scripts are here [`github`](https://github.com/haqq-network/mainnet)

## Quickstart

## Setup

### APT

```sh
sudo apt update && sudo apt upgrade -y
sudo apt install curl git make gcc liblz4-tool build-essential jq lz4 -y
```

Clone the mainnet repository:

```sh
git clone https://github.com/haqq-network/mainnet
```

### Go

You need Go version 1.21:

```sh
./mainnet/install_go.sh
export PATH=$PATH:/usr/local/go/bin
```

Check your Go installation:

```sh
go version
```

### Install the latest HAQQ node

```sh
cd $HOME
git clone -b v1.8.5 https://github.com/haqq-network/haqq
cd haqq && make install
```

Add the haqq binary to your `$PATH`:

```sh
export PATH=$PATH:~/go/bin/
```

Check the installation:

```sh
haqqd -v
```

You should see:

```
haqqd version "1.8.5" 9ddfca4b98943e106de99fd525b6bb05bfe66d34
```

### Configure HAQQ node

```sh
CUSTOM_MONIKER="mainnet_archive_node" && \
haqqd config chain-id haqq_11235-1 && \
haqqd init $CUSTOM_MONIKER --chain-id haqq_11235-1

# Prepare the genesis file for mainnet (haqq_11235-1)
curl -OL https://raw.githubusercontent.com/haqq-network/mainnet/master/genesis.json && \
mv genesis.json $HOME/.haqqd/config/genesis.json

# Prepare the addrbook
curl -OL https://raw.githubusercontent.com/haqq-network/mainnet/master/addrbook.json && \
mv addrbook.json $HOME/.haqqd/config/addrbook.json
```

## Configuration for full node

```sh
cd $HOME/.haqqd/config
```

## app.toml

```
pruning = "nothing"
```

## config.toml

```
[statesync]
enable = false
```

## Download and install archive

Delete all old data:

```sh
haqqd tendermint unsafe-reset-all --home $HOME/.haqqd --keep-addr-book
```

Download and unpack the latest archive snapshot:

```sh
snapshot="$(curl -s "https://snapshots.haqq.network/index.json" | jq -r .archive[0].link)"
wget -qO- "$snapshot" | lz4 -d - | tar -C "$HOME/.haqqd" -x -f -
```

### Check

```sh
haqqd start
```

## Service setup

Install the cosmovisor binary:

```sh
go install github.com/cosmos/cosmos-sdk/cosmovisor/cmd/cosmovisor@latest
```

Create cosmovisor folders:

```sh
mkdir $HOME/.haqqd/cosmovisor && \
mkdir -p $HOME/.haqqd/cosmovisor/genesis/bin && \
mkdir -p $HOME/.haqqd/cosmovisor/upgrades
```

Copy the node binary into the Cosmovisor folder:

```sh
cp /root/go/bin/haqqd $HOME/.haqqd/cosmovisor/genesis/bin
```

Create the haqqd cosmovisor service:

```sh
nano /etc/systemd/system/haqqd.service
```

Paste the following into the file:

```sh
[Unit]
Description="haqqd cosmovisor"
After=network-online.target

[Service]
User=root
ExecStart=/root/go/bin/cosmovisor run start
Restart=always
RestartSec=3
LimitNOFILE=4096
Environment="DAEMON_NAME=haqqd"
Environment="DAEMON_HOME=/root/.haqqd"
Environment="DAEMON_ALLOW_DOWNLOAD_BINARIES=true"
Environment="DAEMON_RESTART_AFTER_UPGRADE=true"
Environment="UNSAFE_SKIP_BACKUP=false"

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```sh
systemctl enable haqqd.service && \
systemctl start haqqd.service
```

Check logs:

```sh
journalctl -fu haqqd
```

## Helpful links

- https://quicksync.io/networks/osmosis.html
- https://polkachu.com/tendermint_snapshots/haqq