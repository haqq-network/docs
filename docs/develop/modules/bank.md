---
sidebar_position: 1
title: x/bank
---

# Bank


## Abstract

This document specifies the internal `x/bank` module of the HAQQ Network.

:::tip
The `x/bank` module is a custom wrapper around the native Cosmos SDK `x/bank` module.
If you're not familiar with the core functionality of original module, please check this
[document](https://docs.cosmos.network/main/modules/bank) as prerequisite reading.
:::

Initially, this wrapper was made to comply with the tokenomics requirements described in the Islamic Coin
[Whitepaper](https://islamiccoin.net/whitepaper). HAQQ bank keeper has a custom coins `burn` policy, that funds
Evergreen DAO account instead of complete coins destruction in certain cases.

The latest improvements of HAQQ bank make it an EVM-first module. It supports a trustless, on-chain bidirectional 
internal conversion of tokens between HAQQ EVM and Cosmos runtimes. Bank utilizes the `x/erc20` features
to instantaneously convert users' native Cosmos `sdk.Coins` (in this document referred to as "Coin(s)") 
to ERC-20 (aka "Token(s)") during the transfers. That allows users' to see the same information about
balances and make transfers without additional conversions using the preferred wallet apps (e.g. Keplr, MetaMask, etc).

## Contents

1. **[Concept](#concept)**
2. **[Improvements](#improvements)**
3. **[ABCI](#abci)**
4. **[Events](#events)**
5. **[Keeper](#keeper)**
6. **[Parameters](#parameters)**
7. **[Client](#client)**

## Module Architecture

:::note
If you're not familiar with the overall module structure from the SDK modules, please check this
[document](https://docs.cosmos.network/main/building-modules/structure.html) as prerequisite reading.
:::

```shell
bank/
├── keeper
│   ├── grpc_query.go       # gRPC state query handlers
│   ├── keeper.go           # Store keeper with the custom Burn() function
│   └── msg_server.go       # Tx handlers (overrides functions Send, GetBalance, etc.) 
│   └── querier.go          # Legacy state query handlers
│   └── wrapped_keeper.go   # Store keeper wrapper
└── module.go               # Module setup for the module manager & ABCI InitGenesis and ExportGenesis functionality
```

## Concept

### Send ERC-20 Tokens

Once a token pair proposal passes, users of native Cosmos wallets (e.g., Keplr) can see their accurate Tokens
balance as if they were native Coins.
Holders of native Cosmos coins and IBC vouchers on the HAQQ Network can transfer their Tokens on HAQQ EVM 
by creating a `MsgSend` or `MsgTransfer` Tx.

:::tip
Learn more about `x/erc20` module and token pair registration [here](erc20.md).
:::

### Internal Burn of Coins

There are a few cases when Coins are subject to be burnt but are transferred to Evergreen DAO instead:

- Staking:
  - slash validator for an infraction
  - slash redelegation
  - slash an unbonding delegation
- Governance:
  - burn proposal deposits, if more than 1/3 of voters veto

## Improvements

### Get Balance(s)

The `Balance` endpoint allows users to query account balance by address for a given denomination.
The `AllBalances` endpoint allows users to query account balance by address for all denominations.

Internal requests being executed to retrieve balance(s):

- retrieve balance(s) of native coins on HAQQ Cosmos runtime
- retrieve balance(s) of registered ERC-20 tokens on HAQQ EVM runtime

### MsgSend

Send coins from one address to another.

Internal state transitions during execution:

- check if ERC-20 is enabled
  - check if the coins have registered token pairs
  - convert coins into tokens
  - execute ERC-20 transfer on HAQQ EVM runtime
- send native coins on HAQQ Cosmos runtime

### MsgTransfer

Send coins from one address to another via IBC.

Internal state transitions during execution:

- check if ERC-20 is enabled
    - check if the coins have registered token pairs
    - convert tokens into coins
- execute IBC transfer on HAQQ Cosmos runtime
