---
sidebar_position: 3
title: Run Node
---

# Run Node

## Hardware

Validators should set up a physical operation secured with restricted access. A good starting place, for example, would be co-locating in secure data centers.

Validators should expect to equip their datacenter location with redundant power, connectivity, and storage backups. Expect to have several redundant networking boxes for fiber, firewall and switching and then small servers with redundant hard drive and failover. Hardware can be on the low end of datacenter gear to start out with.

We anticipate that network requirements will be low initially. Bandwidth, CPU and memory requirements will rise as the network grows. Large hard drives are recommended for storing years of blockchain history.

## Supported OS

We officially support macOS and Linux only in the following architectures:

- `darwin/arm64`
- `darwin/x86_64`
- `linux/arm64`
- `linux/amd64`

### Minimum Requirements

To run mainnet or testnet validator nodes, you will need a machine with the following minimum hardware requirements:

- **4** or more physical CPU cores
- At least **500GB** of SSD disk storage
- At least **32GB** of memory (RAM)
- At least **100mbps** network bandwidth

As the usage of the blockchain grows, the server requirements may increase as well, so you should have a plan for
updating your server as well.
