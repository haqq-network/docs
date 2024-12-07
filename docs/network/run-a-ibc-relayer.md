---
sidebar_position: 9
---

# IBC Relayer

- [Tutorial IBC Relayer](https://tutorials.cosmos.network/academy/2-cosmos-concepts/13-relayer-intro.html)
- [IBC Docs](https://ibc.cosmos.network/main/)

An IBC (Inter-Blockchain Communication) Relayer is a crucial component in the Cosmos ecosystem, enabling the transfer of data and assets between different blockchain networks. It facilitates seamless communication by relaying messages across various independent chains, ensuring interoperability and connectivity.

Hermes is an open-source Rust implementation of a relayer for the Inter-Blockchain Communication Protocol (IBC). Hermes is widely used in production by relayer operators. It offers excellent logging and debugging options, but compared to the Go relayer, it may require more detailed knowledge of IBC to use properly. It is the one we recommend you use.

## About Hermes

An IBC relayer is an off-chain process responsible for relaying IBC datagrams between any two chains. It does so by scanning chain states, building transactions based on these states, and submitting the transactions to the chains involved in the network.

The relayer is a central element in the IBC network architecture. This is because chain modules in this architecture do not directly send messages to each other over networking infrastructure but instead create and store the data to be retrieved and used by a relayer to build the IBC datagrams.

We sometimes refer to Hermes as "IBC Relayer CLI" to make it clear that this is a relayer CLI (i.e., a binary) and distinguish it from the relayer core library (the crate called ibc-relayer).

Hermes is actively developed and maintained by [Informal Systems](https://informal.systems) in the [informalsystems/hermes repository](https://github.com/informalsystems/hermes).

# Run a IBC Relayer

We recommend start from the basic instructions from Hermes - [here.](https://hermes.informal.systems)

## Install

### Setup

For instructions on how to install Rust on your machine, please follow the official [Rust Installation Notes.](https://www.rust-lang.org/tools/install). The provided instructions will install the entire Rust toolchain, including rustc, cargo, and rustup, required to build the project.

Hermes requires Rust 1.76.0.

```bash
rustc --version
```

Also check `cargo`

```bash
cargo version
```

### Install

```bash
cargo install ibc-relayer-cli --bin hermes --locked
```

If you have not installed Rust and Cargo via rustup.rs, you may need to add the $HOME/.cargo/bin directory to your PATH environment variable. For most shells, this can be done by adding the following line to your .bashrc or .zshrc configuration file:

```bash
export PATH="$HOME/.cargo/bin:$PATH"
```

### Check

```bash
hermes version
```

Congratulations you've installed Hermes.

## Docker

We have prepared a Docker file for building Hermes, the IBC relayer, to facilitate its setup and deployment. You can obtain the Docker file and the full Docker Compose project using the links below:

- [Hermes Docker File](https://raw.githubusercontent.com/haqq-network/hermes-docker/master/hermes.Dockerfile)
- [Hermes Docker Compose File](https://raw.githubusercontent.com/haqq-network/hermes-docker/master/docker-compose.yml)

We also recommend using Docker Compose for managing your Hermes deployment. The full repository containing the Docker Compose project can be found here: [HAQQ Hermes Docker Project](https://github.com/haqq-network/hermes-docker)

## Config

You can and should use the official documentation to configure it. The configuration from the example can be used as an [example.](https://raw.githubusercontent.com/haqq-network/hermes-docker/master/config.yaml)
The key feature is `address_type derivation = 'ethermint'` and `ethermint.crypto.v1.ethsecp256k1.PubKey'` which need to be specified in the network settings, as in the example below.

```yaml
[[chains]]
id = "haqq_11235-1"
type = "CosmosSdk"
rpc_addr = "http://haqq_rpc_addr "
grpc_addr = "http://haqq_grpc_addr"
event_source = { mode = 'push', url = "ws://haqq_rpc_addr/websocket", batch_delay = '3000ms'}

rpc_timeout = "10s"
trusted_node = false
account_prefix = "haqq"
key_name = ""
key_store_type = "Test"
store_prefix = "ibc"
default_gas = 500000
max_gas = 1500000
gas_price = { price = 27500000000, denom = "aISLM"}
gas_multiplier = 1.5
max_msg_num = 30
max_tx_size = 180000
max_grpc_decoding_size = 33554432
clock_drift = "15s"
max_block_time = "30s"
trusting_period = "14days"
ccv_consumer_chain = false
trust_threshold = { numerator = '1', denominator = '3' }
memo_prefix = "IBC from HAQQ Network"
sequential_batch_tx = false

[chains.packet_filter]
policy = 'allow'
list = [
  ['ica*', '*'],
  ['transfer', 'channel-0'],
  ['transfer', 'channel-1'],
  ['transfer', 'channel-2'],
  ['transfer', 'channel-3'],
  ['transfer', 'channel-4'],
  ['transfer', 'channel-6'],
  ['transfer', 'channel-7'],
]

[chains.packet_filter.min_fees]

[chains.address_type]
derivation = 'ethermint'
proto_type = { pk_type = '/ethermint.crypto.v1.ethsecp256k1.PubKey' }
```

You can see the settings of other networks in the [GitHub example](https://raw.githubusercontent.com/haqq-network/hermes-docker/master/config.yaml) or in the documentation of other networks.

## Keys setup

Pay special attention to the HD-Path for Networks haqq_11235-1 and kava_2222-10. When configuring an IBC Relayer, it's important to note that the networks haqq_11235-1 and kava_2222-10 use non-standard HD paths. Unlike the typical Cosmos HD path, these networks require specific paths for proper functionality.

```bash
hermes keys add --chain haqq_11235-1 --mnemonic-file /root/.hermes/.mnemonic --hd-path "m/44'/60'/0'/0/0"
hermes keys add --chain kava_2222-10 --mnemonic-file /root/.hermes/.mnemonic --hd-path "m/44'/459'/0'/0/0"
hermes keys add --chain stride-1 --mnemonic-file /root/.hermes/.mnemonic
hermes keys add --chain axelar-dojo-1 --mnemonic-file /root/.hermes/.mnemonic
hermes keys add --chain osmosis-1 --mnemonic-file /root/.hermes/.mnemonic
hermes keys add --chain noble-1 --mnemonic-file /root/.hermes/.mnemonic
hermes keys add --chain cosmoshub-4 --mnemonic-file /root/.hermes/.mnemonic
```

## Commands

Note: you can get channels from the configuration or from the documentation [here.](../../develop/ibc/)

Clear the channel with the following:

```bash
hermes clear packets --chain haqq_11235-1 --channel channel-7 --port transfer
```

Get the channels with the following:

```bash
hermes query channels  --chain haqq_11235-1
```
