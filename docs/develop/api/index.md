# API

The following API's are recommended for development purposes. For maximum control and reliability it's recommended 
to run your own node.

## Networks

Quickly connect your app or client to HAQQ mainnet and public testnets. Head over to [Networks](./networks.md) 
to find a list of publicly available endpoints that you can use to connect to the HAQQ Network.

## Clients

The HAQQ Network supports different clients in order to support Cosmos and Ethereum transactions and queries. 
You can use Swagger as a REST interface for state queries and transactions:

|                                                                                       | Description                                                                          | Default Port | Swagger                                                             |
|---------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|:------------:|---------------------------------------------------------------------|
| **Cosmos [gRPC](./cosmos-grpc-rest.md#cosmos-grpc)**                                  | Query or send HAQQ transactions using gRPC                                           |    `9090`    |                                                                     |
| **Cosmos REST ([gRPC-Gateway](./cosmos-grpc-rest.md#cosmos-http-rest-grpc-gateway))** | Query or send HAQQ transactions using an HTTP RESTful API                            |    `9091`    | [Testnet](https://api.evmos.dev/) [Mainnet](https://api.evmos.org/) |
| **Ethereum [JSON-RPC](./ethereum-json-rpc/index.md)**                                 | Query Ethereum-formatted transactions and blocks or send Ethereum txs using JSON-RPC |    `8545`    |                                                                     |
| **Ethereum [Websocket](./ethereum-json-rpc/index.md#ethereum-websocket)**             | Subscribe to Ethereum logs and events emitted in smart contracts.                    |    `8586`    |                                                                     |
| **CometBFT [RPC](./tendermint.md)**                                    | Query transactions, blocks, consensus state, broadcast transactions, etc.            |   `26657`    | [Localhost](https://docs.tendermint.com/v0.34/rpc/)                 |
| **CometBFT [Websocket](./tendermint.md)**                                | Subscribe to CometBFT ABCI events                                                    |   `26657`    |                                                                     |
| **Command Line Interface (CLI)**                                                      | Query or send HAQQ transactions using your Terminal or Console.                      |     N/A      |                                                                     |