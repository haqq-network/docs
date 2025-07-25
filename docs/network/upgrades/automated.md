---
sidebar_position: 1
---

# Automated Upgrades

We highly recommend validators use Cosmovisor to run their nodes. This will make low-downtime upgrades smoother, as validators don't have to manually upgrade binaries during the upgrade. Instead users can [pre-install](#manual-download) new binaries, and Cosmovisor will automatically update them based on on-chain Software Upgrade proposals.

> [`cosmovisor`](https://docs.cosmos.network/main/tooling/cosmovisor) is a small process manager for Cosmos SDK application binaries that monitors the governance module for incoming chain upgrade proposals. If it sees a proposal that gets approved, cosmovisor can automatically download the new binary, stop the current binary, switch from the old binary to the new one, and finally restart the node with the new binary.

## Prerequisites

- [Install Cosmovisor](https://docs.cosmos.network/main/tooling/cosmovisor#installation)

## 1. Setup Cosmovisor

Set up the Cosmovisor environment variables. We recommend setting these in your `.profile` so it is automatically set in every session.

```bash
echo "# Setup Cosmovisor" >> ~/.profile
echo "export DAEMON_NAME=haqqd" >> ~/.profile
echo "export DAEMON_HOME=$HOME/.haqqd" >> ~/.profile
source ~/.profile
```

After this, you must make the necessary folders for `cosmosvisor` in your `DAEMON_HOME` directory (`~/.haqqd`) and copy over the current binary.

```bash
mkdir -p ~/.haqqd/cosmovisor
mkdir -p ~/.haqqd/cosmovisor/genesis
mkdir -p ~/.haqqd/cosmovisor/genesis/bin
mkdir -p ~/.haqqd/cosmovisor/upgrades

cp $GOPATH/bin/haqqd ~/.haqqd/cosmovisor/genesis/bin
```

To check that you did this correctly, ensure your versions of `cosmovisor` and `haqqd` are the same:

```bash
cosmovisor run version
haqqd version
```

## 2. Download the HAQQ release

### Manual Download

Cosmovisor will continually poll the `$DAEMON_HOME/data/upgrade-info.json` for new upgrade instructions. When an upgrade is [released](https://github.com/haqq-network/haqq/releases), node operators need to:

1. Download (**NOT INSTALL**) the binary for the new release
2. Place it under `$DAEMON_HOME/cosmovisor/upgrades/<name>/bin`, where `<name>` is the URI-encoded name of the upgrade as specified in the Software Upgrade Plan.

**Example**: for a `Plan` with name `v1.8.5` with the following `upgrade-info.json`:

```json
{
  "binaries": {
    "darwin/arm64": "https://github.com/haqq-network/haqq/releases/download/v1.8.5/haqq_1.8.5_darwin_arm64.tar.gz",
    "darwin/x86_64": "https://github.com/haqq-network/haqq/releases/download/v1.8.5/haqq_1.8.5_darwin_amd64.tar.gz",
    "linux/arm64": "https://github.com/haqq-network/haqq/releases/download/v1.8.5/haqq_1.8.5_linux_arm64.tar.gz",
    "linux/amd64": "https://github.com/haqq-network/haqq/releases/download/v1.8.5/haqq_1.8.5_linux_amd64.tar.gz"
  }
}
```

Your `cosmovisor/` directory should look like this:

```shell
cosmovisor/
├── current/   # either genesis or upgrades/<name>
├── genesis
│   └── bin
│       └── haqqd
└── upgrades
    └── v3.0.0
        ├── bin
        │   └── haqqd
        └── upgrade-info.json
```

### Automatic Download

:::warning
**NOTE**: Auto-download doesn't verify in advance if a binary is available. If there will be any issue with downloading a binary, `cosmovisor` will stop and won't restart an the chain (which could lead it to a halt).
:::

It is possible to have Cosmovisor [automatically download](https://docs.cosmos.network/main/tooling/cosmovisor#auto-download) the new binary. Validators can use the automatic download option to prevent unnecessary downtime during the upgrade process. This option will automatically restart the chain with the upgrade binary once the chain has halted at the proposed `upgrade-height`. The major benefit of this option is that validators can prepare the upgrade binary in advance and then relax at the time of the upgrade.

To set the auto-download use set the following environment variable:

```bash
echo "export DAEMON_ALLOW_DOWNLOAD_BINARIES=true" >> ~/.profile
```

## 3. Start your node

Now that everything is setup and ready to go, you can start your node.

```bash
cosmovisor run start
```

You will need some way to keep the process always running. If you're on linux, you can do this by creating a service.

```bash
sudo tee /etc/systemd/system/haqqd.service > /dev/null <<EOF
[Unit]
Description=HAQQ Daemon
After=network-online.target

[Service]
User=$USER
ExecStart=$(which cosmovisor) start
Restart=always
RestartSec=3
LimitNOFILE=infinity

Environment="DAEMON_HOME=$HOME/.haqqd"
Environment="DAEMON_NAME=haqqd"
Environment="DAEMON_ALLOW_DOWNLOAD_BINARIES=false"
Environment="DAEMON_RESTART_AFTER_UPGRADE=true"

[Install]
WantedBy=multi-user.target
EOF
```

Then update and start the node

```bash
sudo -S systemctl daemon-reload
sudo -S systemctl enable haqqd
sudo -S systemctl start haqqd
```

You can check the status with:

```bash
systemctl status haqqd
```
