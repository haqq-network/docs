---
sidebar_position: 7
title: x/ibc
---

# IBC Transfer

## Abstract

This document specifies the internal `x/ibc/transfer` module of the HAQQ Network.

:::tip
The `x/ibc/transfer` module is a custom wrapper around the native IBC Transfer module.
If you're not familiar with the [IBC protocol](https://www.ibcprotocol.dev) and its native implementation, please check this
[document](https://ibc.cosmos.network/main/apps/transfer/overview) as prerequisite reading.
:::

This wrapper allows IBC (ICS20) transfers for the registered ERC-20 tokens by automatic conversion between EVM
and native Cosmos representations. It coupled with [x/erc20](erc20.md) and [x/evm](evm.md) modules. 

## References

- [IBC protocol](https://www.ibcprotocol.dev)
- [IBC documentation](https://ibc.cosmos.network)
- [Original ICS20 implementation](https://github.com/cosmos/ibc-go/blob/v6.2.1/modules/apps/transfer/)
- [Original Transfer module documentation](https://ibc.cosmos.network/main/apps/transfer/overview)

## Module Architecture

:::note
If you're not familiar with the overall module structure from the SDK modules, please check this
[document](https://docs.cosmos.network/main/building-modules/structure.html) as prerequisite reading.
:::

```shell
ibc/transfer/
├── keeper
│   ├── keeper.go      # Store keeper that handles the business logic of the module and has access to a specific subtree of the state tree.
│   └── msg_server.go  # Tx handlers
├── types
│   └── interfaces.go  # The interfaces describing the components of the required modules
├── ibc_module.go      # ICS26 implementation (used for transfer stacks)
└── module.go          # Module setup for the module manager & ABCI InitGenesis and ExportGenesis functionality
```
