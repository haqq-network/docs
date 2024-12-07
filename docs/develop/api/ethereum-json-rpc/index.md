---
sidebar_position: 2
---

# Ethereum JSON-RPC

The JSON-PRC Server provides an API that allows you to connect to the HAQQ blockchain and interact with the EVM. This
gives you direct access to reading Ethereum-formatted transactions or sending them to the network which otherwise
wouldn't be possible on a Cosmos chain, such as HAQQ.

[JSON-RPC](http://www.jsonrpc.org/specification) is a stateless, light-weight remote procedure call (RPC) protocol. It
defines several data structures and the rules around their processing. JSON-RPC is provided on multiple transports.
HAQQ supports JSON-RPC over HTTP and WebSocket. Transports must be enabled through command-line flags or through the
`app.toml` configuration file. It uses JSON ([RFC 4627](https://www.ietf.org/rfc/rfc4627.txt)) as data format.

More on Ethereum JSON-RPC:

- [EthWiki JSON-RPC API](https://eth.wiki/json-rpc/API)
- [Geth JSON-RPC Server](https://geth.ethereum.org/docs/interacting-with-geth/rpc)
- [Ethereum's PubSub JSON-RPC API](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub)

## JSON-RPC over HTTP

HAQQ supports most of the standard web3 JSON-RPC APIs to connect with existing Ethereum-compatible web3 tooling over
HTTP. Ethereum JSON-RPC APIs use a namespace system. RPC methods are grouped into several categories depending on
their purpose. All method names are composed of the namespace, an underscore, and the actual method name within
the namespace. For example, the `eth_call` method resides in the eth namespace. Access to RPC methods can be enabled
on a per-namespace basis.

Find below the JSON-RPC namespaces supported on HAQQ or head over to the documentation for the individual API endpoints
and their respective curl commands on the [JSON-RPC Methods](./methods.md) page.

| Namespace                                   | Description                                                                                                                                                                                                                  | Supported | Enabled by Default |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------: | :----------------: |
| [`eth`](./methods.md#eth-methods)           | HAQQ provides several extensions to the standard `eth` JSON-RPC namespace.                                                                                                                                                   |    ✔     |         ✔         |
| [`web3`](./methods.md#web3-methods)         | The `web3` API provides utility functions for the web3 client.                                                                                                                                                               |    ✔     |         ✔         |
| [`net`](./methods.md#net-methods)           | The `net` API provides access to network information of the node                                                                                                                                                             |    ✔     |         ✔         |
| `clique`                                    | The `clique` API provides access to the state of the clique consensus engine. You can use this API to manage signer votes and to check the health of a private network.                                                      |    🚫     |                    |
| `debug`                                     | The `debug` API gives you access to several non-standard RPC methods, which will allow you to inspect, debug and set certain debugging flags during runtime.                                                                 |    ✔     |                    |
| `les`                                       | The `les` API allows you to manage LES server settings, including client parameters and payment settings for prioritized clients. It also provides functions to query checkpoint information in both server and client mode. |    🚫     |                    |
| [`miner`](./methods.md#miner-methods)       | The `miner` API allows you to remote control the node’s mining operation and set various mining specific settings.                                                                                                           |    ✔     |         🚫         |
| [`txpool`](./methods.md#txpool-methods)     | The `txpool` API gives you access to several non-standard RPC methods to inspect the contents of the transaction pool containing all the currently pending transactions as well as the ones queued for future processing.    |    ✔     |         🚫         |
| `admin`                                     | The `admin` API gives you access to several non-standard RPC methods, which will allow you to have a fine grained control over your node instance, including but not limited to network peer and RPC endpoint management.    |    🚫     |                    |
| [`personal`](./methods.md#personal-methods) | The `personal` API manages private keys in the key store.                                                                                                                                                                    |    ✔     |         🚫         |

## Subscribing to Ethereum Events

### Filters

HAQQ also supports the Ethereum [JSON-RPC](./methods.md) filters calls to
subscribe to [state logs](https://eth.wiki/json-rpc/API#eth_newfilter),
[blocks](https://eth.wiki/json-rpc/API#eth_newblockfilter) or [pending transactions](https://eth.wiki/json-rpc/API#eth_newpendingtransactionfilter) changes.

Under the hood, it uses the Tendermint RPC client's event system to process subscriptions that are
then formatted to Ethereum-compatible events.

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_newBlockFilter","params":[],"id":1}' -H "Content-Type: application/json" http://localhost:8545

{"jsonrpc":"2.0","id":1,"result":"0x3503de5f0c766c68f78a03a3b05036a5"}
```

Then you can check if the state changes with the [`eth_getFilterChanges`](https://eth.wiki/json-rpc/API#eth_getfilterchanges) call:

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getFilterChanges","params":["0x3503de5f0c766c68f78a03a3b05036a5"],"id":1}' -H "Content-Type: application/json" http://localhost:8545

{"jsonrpc":"2.0","id":1,"result":["0x7d44dceff05d5963b5bc81df7e9f79b27e777b0a03a6feca09f3447b99c6fa71","0x3961e4050c27ce0145d375255b3cb829a5b4e795ac475c05a219b3733723d376","0xd7a497f95167d63e6feca70f344d9f6e843d097b62729b8f43bdcd5febf142ab","0x55d80a4ba6ef54f2a8c0b99589d017b810ed13a1fda6a111e1b87725bc8ceb0e","0x9e8b92c17280dd05f2562af6eea3285181c562ebf41fc758527d4c30364bcbc4","0x7353a4b9d6b35c9eafeccaf9722dd293c46ae2ffd4093b2367165c3620a0c7c9","0x026d91bda61c8789c59632c349b38fd7e7557e6b598b94879654a644cfa75f30","0x73e3245d4ddc3bba48fa67633f9993c6e11728a36401fa1206437f8be94ef1d3"]}
```

### Ethereum Websocket

The Ethereum Websocket allows you to subscribe to Ethereum logs and events emitted in smart contracts. This way you
don't need to continuously make requests when you want specific information.

Since HAQQ is built with the Cosmos SDK framework and uses Tendermint Core as it's consensus Engine, it inherits the
[event format](../tendermint.md#subscribing-to-events-via-websocket) from them. However, in order to support the
native Web3 compatibility for websockets of the [Ethereum's PubSubAPI](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub),
HAQQ needs to cast the CometBFT responses retrieved into the Ethereum types.

You can start a connection with the Ethereum websocket using the `--json-rpc.ws-address` flag when starting
the node (default `"0.0.0.0:8546"`):

```bash
haqqd start --json-rpc.address="0.0.0.0:8545" --json-rpc.ws-address="0.0.0.0:8546" --json-rpc.api="eth,web3,net,txpool,debug" --json-rpc.enable
```

Then, start a websocket subscription with [`ws`](https://github.com/hashrocket/ws)

```bash
# connect to tendermint websocket at port 8546 as defined above
ws ws://localhost:8546/

# subscribe to new Ethereum-formatted block Headers
> {"id": 1, "method": "eth_subscribe", "params": ["newHeads", {}]}
< {"jsonrpc":"2.0","result":"0x44e010cb2c3161e9c02207ff172166ef","id":1}
```

## Further Considerations

### HEX value encoding

At present there are two key datatypes that are passed over JSON:

- **quantities** and
- **unformatted byte arrays**.

Both are passed with a hex encoding, however with different requirements to formatting.

When encoding quantities (integers, numbers), encode as hex, prefix with `"0x"`, the most compact representation (slight
exception: zero should be represented as `"0x0"`). Examples:

- `0x41` (65 in decimal)
- `0x400` (1024 in decimal)
- WRONG: `0x` (should always have at least one digit - zero is `"0x0"`)
- WRONG: `0x0400` (no leading zeroes allowed)
- WRONG: `ff` (must be prefixed `0x`)

When encoding unformatted data (byte arrays, account addresses, hashes, bytecode arrays), encode as hex, prefix with `"0x"`,
two hex digits per byte. Examples:

- `0x41` (size 1, `"A"`)
- `0x004200` (size 3, `"\0B\0"`)
- `0x` (size 0, `""`)
- WRONG: `0xf0f0f` (must be even number of digits)
- WRONG: `004200` (must be prefixed `0x`)

### Default block parameter

The following methods have an extra default block parameter:

- [`eth_getBalance`](./methods.md#eth_getbalance)
- [`eth_getCode`](./methods.md#eth_getcode)
- [`eth_getTransactionCount`](./methods.md#eth_gettransactioncount)
- [`eth_getStorageAt`](./methods.md#eth_getstorageat)
- [`eth_call`](./methods.md#eth_call)

When requests are made that act on the state of HAQQ, the last default block parameter determines the height of the block.

The following options are possible for the `defaultBlock` parameter:

- `HEX String` - an integer block number
- `String "earliest"` for the earliest/genesis block
- `String "latest"` - for the latest mined block
- `String "pending"` - for the pending state/transactions
