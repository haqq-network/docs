---
sidebar_position: 3
---

# Cosmos gRPC & REST

## Cosmos gRPC

HAQQ exposes gRPC endpoints for all the integrated Cosmos SDK modules. This makes it easier for
wallets and block explorers to interact with the Proof-of-Stake logic and native Cosmos transactions and queries.

## Cosmos HTTP REST (gRPC-Gateway)

[gRPC-Gateway](https://grpc-ecosystem.github.io/grpc-gateway/) reads a gRPC service definition and
generates a reverse-proxy server which translates RESTful JSON API into gRPC. With gRPC-Gateway,
users can use REST to interact with the Cosmos gRPC service.
See the list of supported gRPC-Gateway API endpoints using Swagger [here](../api#clients).