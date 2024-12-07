---
sidebar_position: 2
title: x/coinomics
---

# Coinomics

## Abstract

This document specifies the internal `x/coinomics` module of the HAQQ Network.

The `x/coinomics` module is part of the HAQQ Network tokenomics and aims to increase the growth of the network by distributing
rewards to users who stake their coins to network validators.
The rewards drive users to delegate coins and participate in governance on HAQQ to improve the sustainability of the services in the network.

## Contents

1. **[Concept](#concept)**
2. **[State](#state)**
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
coinomics/
├── client
│   └── cli
│       └── query.go      # CLI query commands for the module
├── keeper
│   ├── abci.go           # ABCI BeginBlock and EndBlock logic
│   ├── grpc_query.go     # gRPC state query handlers
│   ├── inflation.go      # Main coin minting calculations logic of the module
│   ├── keeper.go         # Store keeper that handles the business logic of the module and has access to a specific subtree of the state tree.
│   ├── migrations.go     # The module migration handler
│   ├── mint_info.go      # Store state handlers of the module
│   └── params.go         # Parameter getter and setter
├── spec
│   └── README.md         # The specification of the module
├── types
│   ├── codec.go          # Type registration for encoding
│   ├── events.go         # Events exposed to the CometBFT PubSub/Websocket
│   ├── genesis.go        # Genesis state for the module
│   ├── interfaces.go     # The interfaces describing the components of the required modules
│   ├── keys.go           # Store keys and utility functions
│   └── params.go         # Module parameters that can be customized with governance parameter change proposals
├── genesis.go            # ABCI InitGenesis and ExportGenesis functionality
└── module.go             # Module setup for the module manager
```

## Concept

Islomic Coin [Whitepaper](https://islamiccoin.net/whitepaper) describes a minting mechanism in details.

Briefly, ISLM supply is limited to 100 billion coins. Inflation is calculated as a percentage of total bonded coins
which is a parameter `RewardCoefficient` controlled by governance and is initially set to `7.78%`
(i.e. expected to generate ~7% yield for staked ISLM).
In each block, newly minted coins (rewards) are calculated as:

```
TotalBondedCoins * RewardCoefficient * BlockTimeMs / MsInCurrentYear
```

## State

The `x/coinomics` module keeps in the state variable needed to the next mint calculation:

Only `KeyPrefixPrevBlockTS` in previous block needs to be tracked in state for the next mint calculation.
Value of `KeyPrefixMaxSupply` is assumed to be constant and doesn't change during blocks mining.

|                      | Description                     | Key         | Value              | Store |
| -------------------- | ------------------------------- | ----------- | ------------------ | ----- |
| KeyPrefixPrevBlockTS | Timestamp of the previous block | `[]byte{1}` | `[]byte{sdk.Int}`  | KV    |
| KeyPrefixMaxSupply   | Maximum total ISLM supply       | `[]byte{2}` | `[]byte{sdk.Coin}` | KV    |

## ABCI

### Begin Block

The `x/coinomics` module is not involved in Begin Blocker logic.

### End Block

The coin mint is calculated, minted and allocated at the end of each block.

#### Disabling mint

We introduce two parameters : `EnableCoinomics`and `RewardCoefficient`.

`RewardCoefficient` the current staking reward coefficient value.
`EnableCoinomics` controls the module execution.

- If `EnableCoinomics = false`, all calculations and coin minting will be disabled and module will return without further computation.
- If `RewardCoefficient = 0`, the amount of coins to be minted is dynamically calculated, minted and allocated upon each block at `EndBlock`.
  However, the result of these calculations always will be `zero` and no coins will be minted.

#### Enabling mint

To enable coin minting, the following parameters should be set:

- `EnableCoinomics` should be `true`
- `RewardCoefficient` should be set to a positive decimal between (0 and 100). It defines the coefficient used to calculate the inflation.

#### Calculation

The `KeyPrefixPrevBlockTS` is initialized at the block height when `EnableCoinomics` has been set to `true`
to the `BlockTime` value of previous block.
The coin mint is after calculated, minted and allocated according to the time elapsed since in the previous block.

```go
if EnableCoinomics == true {
    var yearInMillis sdk.Dec
    if isLeapYear {
        yearInMillis, _ = sdk.NewDecFromStr("31622400000") // 366 days in milliseconds
    } else {
        yearInMillis, _ = sdk.NewDecFromStr("31536000000") // 365 days in milliseconds
    }

    prevBlockTS, _ := sdk.NewDecFromStr(k.GetPrevBlockTS(ctx).String())
    currentBlockTS, _ := sdk.NewDecFromStr(math.NewInt(ctx.BlockTime().UnixMilli()).String())
    totalBonded, _ := sdk.NewDecFromStr(k.stakingKeeper.TotalBondedTokens(ctx).String())
    rewardCoefficient := params.RewardCoefficient.Quo(sdk.NewDec(100))

    blockMint := totalBonded.Mul(rewardCoefficient).Mul((currentBlockTS.Sub(prevBlockTS)).Quo(yearInMillis))
}
```

## Events

The `x/coinomics` module doesn't emit any events.

## Keeper

The `x/coinomics` module provides this exported keeper that can be passed to other modules,
which require access to the max supply parameter.

```go
type Keeper interface {
    GetMaxSupply(ctx sdk.Context) sdk.Coin
}
```

## Parameters

The `x/coinomics` module contains the following parameters:

| Key               | Type    | Default Values | Description                                  |
| ----------------- | ------- | -------------- | -------------------------------------------- |
| MintDenom         | string  | `aISLM`        | The denom of the coins to be minted          |
| EnableCoinomics   | bool    | `false`        | Controls the execution of the module logic   |
| RewardCoefficient | sdk.Dec | 7.8            | The current staking Reward Coefficient value |

## Client

### CLI

A user can query and interact with the `x/coinomics` module using the CLI.

#### Queries

The `query` commands allow users to query `x/coinomics` state.

```bash
haqqd query coinomics --help
```

##### Max Supply

The `max-supply` command allows users to query the max allowed ISLM supply value.

```bash
haqqd query coinomics max-supply [flags]
```

Example:

```bash
haqqd query coinomics max-supply ...
```

Example Output:

```
max_supply: "100000000000000000000000000000aISLM"
```

##### Reward Coefficient

The `reward-coefficient` command allows users to query the current staking reward coefficient value.

```bash
haqqd query coinomics reward-coefficient [flags]
```

Example:

```bash
haqqd query coinomics reward-coefficient ...
```

Example Output:

```
reward_coefficient: "7.800000000000000000"
```

##### Params

The `params` command allows users to query the current module params.

```bash
haqqd query coinomics params [flags]
```

Example:

```bash
haqqd query coinomics params ...
```

Example Output:

```
mint_denom: "aISLM"
enable_coinomics: true
reward_coefficient: "7.800000000000000000"
```

### gRPC

#### Queries

| Verb   | Method                                      | Description                       |
| ------ | ------------------------------------------- | --------------------------------- |
| `gRPC` | `haqq.coinomics.v1.Query/MaxSupplyRequest`  | Get the `MaxSupply` value         |
| `gRPC` | `haqq.coinomics.v1.Query/RewardCoefficient` | Get the `RewardCoefficient` value |
| `gRPC` | `haqq.coinomics.v1.Query/Params`            | Get the module params             |
| `GET`  | `/haqq/coinomics/v1/max_supply`             | Get the `MaxSupply` value         |
| `GET`  | `/haqq/coinomics/v1/reward_coefficient`     | Get the `RewardCoefficient` value |
| `GET`  | `/haqq/coinomics/v1/params`                 | Get the module params             |
