---
sidebar_position: 2
---

# Mainnet Full Node from Archive 

## Overview

The current HAQQ version of mainnet is [`v1.8.5`](https://github.com/haqq-network/haqq/releases/tag/v1.8.5).
Sources of all scripts are here [`github`](https://github.com/haqq-network/mainnet)

## Quickstart

_*Battle tested on [Ubuntu LTS 22.04](https://spinupwp.com/doc/what-does-lts-mean-ubuntu/#:~:text=The%20abbreviation%20stands%20for%20Long,extended%20period%20over%20regular%20releases)*_


## Setup
### APT
```sh
sudo apt update && sudo apt upgrade -y
sudo apt install curl git make gcc liblz4-tool build-essential jq -y
sudo apt install snapd -y && sudo snap install lz4 -y
```

Script repository 

```sh
git clone https://github.com/haqq-network/mainnet
```


### Go
Need version 1.21
https://go.dev/doc/install

Don't forget:
```sh
./mainnet/install_go.sh 
export PATH=$PATH:/usr/local/go/bin
```

Checking

```
go version
```


### Install latest HAQQ node
```sh
cd $HOME
git clone -b v1.8.5 https://github.com/haqq-network/haqq
cd haqq && make install
```
Checking 

```sh
haqqd -v
```
haqqd version 1.8.5 9ddfca4b98943e106de99fd525b6bb05bfe66d34

### Сonfig HAQQ node

```sh
CUSTOM_MONIKER="mainnet_seed_node" && \
haqqd config chain-id haqq_11235-1 && \
haqqd init $CUSTOM_MONIKER --chain-id haqq_11235-1

# Prepare genesis file for mainet(haqq_11235-1)
curl -OL https://raw.githubusercontent.com/haqq-network/mainnet/master/genesis.json && \
mv genesis.json $HOME/.haqqd/config/genesis.json

# Prepare addrbook
curl -OL https://raw.githubusercontent.com/haqq-network/mainnet/master/addrbook.json && \
mv addrbook.json $HOME/.haqqd/config/addrbook.json
```


## Config for full node

```sh
cd .haqqd/config
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

##  Download and install archive
go to - https://storage.googleapis.com/haqq-archive-snapshots/  -and see the latest available snapshots. We take snapshots every 2 days. 

```
<ListBucketResult xmlns="http://doc.s3.amazonaws.com/2006-03-01">
<Name>haqq-archive-snapshots</Name>
...
<Contents>
<Key>haqqd-2024-05-23-02-00-02.lz4</Key>
...
<Key>haqqd-2024-05-27-02-00-01.lz4</Key>
<Generation>1716804004002747</Generation>
</Contents>
</ListBucketResult>
```

haqqd-2024-05-27-02-00-01.lz4 - last one from the example, and link to archive will be https://storage.googleapis.com/haqq-archive-snapshots/haqqd-2024-05-27-02-00-01.lz4 


```
wget -O haqqd-2023-07-13-02-00-01.lz4 https://storage.googleapis.com/haqq-archive-snapshots/haqqd-2024-05-27-02-00-01.lz4

haqqd tendermint unsafe-reset-all --home $HOME/.haqqd --keep-addr-book

lz4 -c -d haqqd-2023-07-13-02-00-01.lz4  | tar -x -C $HOME/.haqqd 
```

### Checks 

```sh
haqqd start
```


## Service setup

1. Install cosmovisor bin
```sh
go install github.com/cosmos/cosmos-sdk/cosmovisor/cmd/cosmovisor@latest
```

2. Create cosmovisor folders
```sh
mkdir $HOME/.haqqd/cosmovisor && \
mkdir -p $HOME/.haqqd/cosmovisor/genesis/bin && \
mkdir -p $HOME/.haqqd/cosmovisor/upgrades
```

3. Copy node binary into Cosmovisor folder
```sh
cp /root/go/bin/haqqd $HOME/.haqqd/cosmovisor/genesis/bin
```

4. Create haqqd cosmovisor service
```sh
nano /etc/systemd/system/haqqd.service
```

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

5. Enable and start service

```sh
systemctl enable haqqd.service && \
systemctl start haqqd.service
```

6. Check logs
```sh
journalctl -fu haqqd
```


## Helpful links

- https://quicksync.io/networks/osmosis.html 
- https://polkachu.com/tendermint_snapshots/haqq
