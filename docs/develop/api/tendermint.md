---
sidebar_position: 4
---

# Tendermint RPC

The Tendermint RPC allows you to query transactions, blocks, consensus state, broadcast transactions, etc.

The latest Tendermint RPC documentations can be found [here](https://docs.tendermint.com/v0.34/rpc/). Tendermint
supports the following RPC protocols:

- URI over HTTP
- JSON-RPC over HTTP
- JSON-RPC over Websockets

The docs will contain an interactive Swagger interface.

## URI/HTTP

A GET request with arguments encoded as query parameters:

```
curl localhost:26657/block?height=5
```

## RPC/HTTP

JSONRPC requests can be POST'd to the root RPC endpoint via HTTP. See the list
of supported Tendermint RPC endpoints using Swagger [here](../api#clients).

## RPC/Websocket

### Cosmos and Tendermint Events

`Event`s are objects that contain information about the execution of the application
and are triggered after a block is committed. They are mainly used by service providers
like block explorers and wallet to track the execution of various messages and index transactions.
You can get the full list of `event` categories and values [here](#list-of-tendermint-events).

More on Events:

- [Cosmos SDK Events](https://docs.cosmos.network/main/core/events.html)

### Subscribing to Events via Websocket

Tendermint Core provides a [Websocket](https://docs.tendermint.com/v0.34/tendermint-core/subscription.html) connection to subscribe or unsubscribe to Tendermint `Events`. To start a connection with the Tendermint websocket you need to define the address with the `--rpc.laddr` flag when starting the node (default `tcp://127.0.0.1:26657`):

```bash
haqqd start --rpc.laddr="tcp://127.0.0.1:26657"
```

Then, start a websocket subscription with [ws](https://github.com/hashrocket/ws)

```bash
# connect to tendermint websocket at port 8080
ws ws://localhost:8080/websocket

# subscribe to new Tendermint block headers
> { "jsonrpc": "2.0", "method": "subscribe", "params": ["tm.event='NewBlockHeader'"], "id": 1 }
```

The `type` and `attribute` value of the `query` allow you to filter the specific `event` you are
looking for. For example, a an Ethereum transaction on Haqq (`MsgEthereumTx`) triggers an `event` of type `ethermint` and
has `sender` and `recipient` as `attributes`. Subscribing to this `event` would be done like so:

```json
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "id": "0",
    "params": {
        "query": "tm.event='Tx' AND ethereum.recipient='hexAddress'"
    }
}
```

where `hexAddress` is an Ethereum hex address (eg: `0x1122334455667788990011223344556677889900`).

The generic syntax look like this:

```json
{
    "jsonrpc": "2.0",
    "method": "subscribe",
    "id": "0",
    "params": {
        "query": "tm.event='<event_value>' AND eventType.eventAttribute='<attribute_value>'"
    }
}
```

### List of Tendermint Events

The main events you can subscribe to are:

- `NewBlock`: Contains `events` triggered during `BeginBlock` and `EndBlock`.
- `Tx`: Contains `events` triggered during `DeliverTx` (i.e. transaction processing).
- `ValidatorSetUpdates`: Contains validator set updates for the block.

:::tip
👉 The list of events types and values for each Cosmos SDK module can be found in the [Modules Specification](./../../../../protocol/modules/) section.
Check the `Events` page to obtain the event list of each supported module on Haqq.
:::

List of all Tendermint event keys:

|                                                      | Event Type       | Categories  |
| ---------------------------------------------------- | ---------------- | ----------- |
| Subscribe to a specific event                        | `"tm.event"`     | `block`     |
| Subscribe to a specific transaction                  | `"tx.hash"`      | `block`     |
| Subscribe to transactions at a specific block height | `"tx.height"`    | `block`     |
| Index `BeginBlock` and `Endblock` events             | `"block.height"` | `block`     |
| Subscribe to ABCI `BeginBlock` events                | `"begin_block"`  | `block`     |
| Subscribe to ABCI `EndBlock` events                  | `"end_block"`    | `consensus` |

Below is a list of values that you can use to subscribe for the `tm.event` type:

|                        | Event Value             | Categories  |
| ---------------------- | ----------------------- | ----------- |
| New block              | `"NewBlock"`            | `block`     |
| New block header       | `"NewBlockHeader"`      | `block`     |
| New Byzantine Evidence | `"NewEvidence"`         | `block`     |
| New transaction        | `"Tx"`                  | `block`     |
| Validator set updated  | `"ValidatorSetUpdates"` | `block`     |
| Block sync status      | `"BlockSyncStatus"`     | `consensus` |
| lock                   | `"Lock"`                | `consensus` |
| New consensus round    | `"NewRound"`            | `consensus` |
| Polka                  | `"Polka"`               | `consensus` |
| Relock                 | `"Relock"`              | `consensus` |
| State sync status      | `"StateSyncStatus"`     | `consensus` |
| Timeout propose        | `"TimeoutPropose"`      | `consensus` |
| Timeout wait           | `"TimeoutWait"`         | `consensus` |
| Unlock                 | `"Unlock"`              | `consensus` |
| Block is valid         | `"ValidBlock"`          | `consensus` |
| Consensus vote         | `"Vote"`                | `consensus` |

### Example

```bash
ws ws://localhost:26657/websocket
> { "jsonrpc": "2.0", "method": "subscribe", "params": ["tm.event='ValidatorSetUpdates'"], "id": 1 }
```

Example response:

```json
{
    "jsonrpc": "2.0",
    "id": 0,
    "result": {
        "query": "tm.event='ValidatorSetUpdates'",
        "data": {
            "type": "tendermint/event/ValidatorSetUpdates",
            "value": {
              "validator_updates": [
                {
                  "address": "09EAD022FD25DE3A02E64B0FE9610B1417183EE4",
                  "pub_key": {
                    "type": "tendermint/PubKeyEd25519",
                    "value": "ww0z4WaZ0Xg+YI10w43wTWbBmM3dpVza4mmSQYsd0ck="
                  },
                  "voting_power": "10",
                  "proposer_priority": "0"
                }
              ]
            }
        }
    }
}
```

:::tip
**Note:** When querying Ethereum transactions versus Cosmos transactions, the transaction hashes are different.
When querying Ethereum transactions, users need to use event query.
Here's an example with the CLI:

```bash
curl -X GET "http://localhost:26657/tx_search?query=ethereum_tx.ethereumTxHash%3D0x8d43464891fac6c113e809e14dff1a3e608eae124d629799e42ca0e36562d9d7&prove=false&page=1&per_page=30&order_by=asc" -H "accept: application/json"
```

:::