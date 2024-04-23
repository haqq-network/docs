---
sidebar_position: 9
title: x/liquidvesting
---

# Liquid Vesting

## Abstract

This document specifies the internal `x/liquidvesting` module of the HAQQ Network.

:::tip
The `x/liquidvesting` module works with the `ClawbackVestingAccount`, `schedules`, `lockup periods`, `erc20`. Before studying this module, we recommend familiarizing yourself with the `x/vesting` module and `x/erc20`, which you can do [here](./vesting.md) and [here](./erc20.md).
:::

The `x/liquidvesting` module offers new capabilities for user-managed vesting without altering token unlock intervals or the volume of token releases. These management features are enabled by creating partially liquid tokens, `aLIQUIDX`, in exchange for locked ISLM on a 1-to-1 basis. Partially liquid tokens carry the original vesting schedule but can be transferred, sold peer-to-peer, or converted back to ISLM with the original schedule intact.

Upon creation, `aLIQUIDX` tokens are automatically registered on the EVM layer as `ERC20` tokens. Each issuance of these partially liquid tokens generates a new unique partially liquid token.

:::note
The user interface and user experience of `x/liquidvesting` module is presented in [Vesting DApp](https://vesting.haqq.network/) you can read more 
[here](/learn/ecosystem/vesting/#liquid-vesting-functionality).
:::

## Contents

1. **[Abstract](#abstract)**
2. **[Contents](#contents)**
3. **[References](#references)**
4. **[Module Architecture](#module-architecture)**
5. **[Concepts](#concepts)**
6. **[Concepts](#state)**
7. **[State Transitions](#state-transitions)**
8. **[Transitions](#transitions)**
9. **[Parameters](#parameters)**
10. **[Clients](#clients)**
11. **[Shedule amount modification](#shedule-amount-modification )**


## References

- HAQQ liquidvesting implementation: [https://github.com/haqq-network/haqq/tree/master/x/liquidvesting](https://github.com/haqq-network/haqq/tree/master/x/liquidvesting)
- HAQQ vesting implementation: [https://github.com/haqq-network/haqq/tree/master/x/vesting](https://github.com/haqq-network/haqq/tree/master/x/vesting)

## Module Architecture

:::note
If you're not familiar with the overall module structure from the SDK modules, please check this
[document](https://docs.cosmos.network/main/building-modules/structure.html) as prerequisite reading.
:::

```shell
liquidvesting/
├── client
│   └── cli
│       ├── query.go                 # CLI query commands for the liquidvesting module
│       └── tx.go                    # CLI transaction commands for the liquidvesting module
├── keeper
│   ├── denom.go                     # Creation and management aLIQUIDX denoms
│   ├── grpc_query.go                # gRPC state query handlers
│   ├── keeper.go                    # Store keeper that handles the business logic of the module and has access to a specific subtree of the state tree. 
│   ├── msg_server.go                # Tx handlers
│   └── params.go                    # Parameter getter and setter
├── types
│   ├── codec.go                     # Type registration for encoding 
│   ├── denom.go                     # Denom types description 
│   ├── errors.go                    # Module-specific errors
│   ├── genesis.go                   # Genesis state for the module 
│   ├── interfaces.go                # The interfaces describing the components of the required modules 
│   ├── keys.go                      # Store keys and utility functions 
│   ├── msg.go                       # Module transaction messages  
│   ├── params.go                    # Module parameters that can be customized with governance parameter change proposals
│   └──schedule.go                   # Interaction with the vesting schedule 
├── genesis.go                       # ABCI InitGenesis and ExportGenesis functionality 
├── handler.go                       # Message routing  
└── module.go                        # Module setup for the module manager 
```

## Concepts

`aLIQUIDX` are semi-liquid tokens registered on both the Cosmos and EVM layers as ERC20 tokens. These tokens are unrestricted, meaning they can be freely bought and sold.


Users with vesting accounts and locked 1,000 ISLM tokens can make their locked ISLM tokens liquid - convert loked aISLM to liquid tokens `aLIQUIDX` . For every token creation, an exact amount of `aISLM` (minimal denomination is 10^18 aISLM equals 1 `ISLM`) is deducted from the user's vested balance corresponding to the number of aLIQUIDX tokens created. Each creation of `aLIQUIDX` tokens generates a new denomination and a new token—such as `aLIQUID1`, `aLIQUID2`, etc. A specific schedule assigned to the module by the creator of the token is associated with each of these denominations. Thus, each `aLIQUIDX` has its own unique schedule which may differ from another `aLIQUIDY` if `X != Y`. After creation, any user can exchange their `aLIQUIDX` tokens back into aISLM according to the schedule of that specific token. The exchange can be for all tokens at once or just a portion.

### Liquidation
If vesting account contains only locked tokens user can use `Liquidate` transaction and next things will happen:

1. Specified amount amount of locked ISLM token will be transfered from a user vesting account to `x/liquidvesting` module account
2. `x/liquidvesting` module will mint a liquid token which won't be locked and could be freely used in any way. Its amount will be equal to specified amount of locked ISLM token transfered to module account.
3. ERC20 contract of newly created liquid token `aLIQUIDX` will be deployed on evm layer and token pair for it will be created with `x/erc20` module

`aLIQUIDX` tokens can be transferred across both EVM and Cosmos layers.
The minimum creation threshold of 1,000 ISLM tokens is set to reduce the number of denoms.

**The primary purpose of `aLIQUIDX` is to enable p2p market for locked ISLM tokens.**

#### Liquid token 

Liquid token represents arbitrary amount of ISLM token locked in vesting. For each liquidate transaction new unique liquid token will be created.
Liquid token has vesting unlock schedule, it derives from original vesting account schedule which liquid token created from.

### Redeem
Once user has any liquid token on its account, it can be redeemed to locked ISLM token. Once user uses `Redeem` transaction next things will happen:

1. Liquid token amount specified for redeem will be burnt
2. ISLM token will be transfered to user's account from `x/liquidvesting` module
3. Liquid token unlock schedule will be applied to user's account. If user has a regular account it converts to vesting account. If user already has vesting account liquid token schedule will be merged with already existing schedule.

### Example

User A with schedule SA creates 2,000 `aLIQUID1` tokens.

User B with schedule SB creates 2,000 `aLIQUID2` tokens.

User C has no schedule.

If Users A and B transfer/sell 1,000 aLIQUID1 and 1,000 aLIQUID2 to User C, then User C's balance will simply show 1,000 aLIQUID1 and 1,000 aLIQUID2. However, if User C decides to exchange 500 aLIQUID1 for 500 aISLM, the exchange will apply schedule SA, resulting in a balance of 500 aISLM, 500 aLIQUID1, and 1,000 aLIQUID2. The 500 aISLM cannot be sold or transferred until they are unlocked according to schedule SA. If later, User C exchanges another 500 aLIQUID2, their schedule will become a combination of SA and SB, and their balance will be 1,000 aISLM, 500 aLIQUID1, and 500 aLIQUID2. Unlocking intervals apply equally regardless of the token form.

## State

### State Objects

The `x/liquidvesting` module keeps the following objects in state:

| State Object | Description           | Key                             | Value           | Store    |
|--------------|-----------------------|---------------------------------|-----------------| --- |
| `Denom`      | Liquid token bytecode | `[]byte{1} + []byte(baseDenom)` | `[]byte{denom}` | KV    |

#### Denom

Denom aka liquid token representation of locked ISLM with unlock schedule

```go
type Denom struct {
// base_denom main identifier for the denom, used to query it from store.
BaseDenom string `protobuf:"bytes,1,opt,name=base_denom,json=baseDenom,proto3" json:"base_denom,omitempty"`
// display_denom identifier used for display name for broad audience
DisplayDenom string `protobuf:"bytes,2,opt,name=display_denom,json=displayDenom,proto3" json:"display_denom,omitempty"`
// original_denom which liquid denom derived from
OriginalDenom string `protobuf:"bytes,3,opt,name=original_denom,json=originalDenom,proto3" json:"original_denom,omitempty"`
// start date
StartTime time.Time `protobuf:"bytes,4,opt,name=start_time,json=startTime,proto3,stdtime" json:"start_time"`
// end_date
EndTime time.Time `protobuf:"bytes,5,opt,name=end_time,json=endTime,proto3,stdtime" json:"end_time"`
// lockup periods
LockupPeriods github_com_cosmos_cosmos_sdk_x_auth_vesting_types.Periods `protobuf:"bytes,6,rep,name=lockup_periods,json=lockupPeriods,proto3,castrepeated=github.com/cosmos/cosmos-sdk/x/auth/vesting/types.Periods" json:"lockup_periods"`
}
```

#### Liquid token base denom

The unique identifier of a `Denom` is obtained by combining prefix `LIQUID` and numeric id which increments every time new liquid token is created e. g. `LIQUID12`

#### Original denom

Original denom is keeping track of which denom liquid token derives from. In most of the cases it will be ISLM

#### Start time

Defines start of unlock schedule bound to luqid token. Always match token creation date

#### End time
Defines the date when liquid token schedule ends

#### LockupPeriods

The main part of liquid token schedule consist of sdk vesting periods

```go
type Period struct {
	// Period duration in seconds.
	Length int64                                    `protobuf:"varint,1,opt,name=length,proto3" json:"length,omitempty"`
	Amount github_com_cosmos_cosmos_sdk_types.Coins `protobuf:"bytes,2,rep,name=amount,proto3,castrepeated=github.com/cosmos/cosmos-sdk/types.Coins" json:"amount"`
}
```

### Genesis State

The `x/liquidvesting` module's `GenesisState` defines the state necessary for initializing the chain from a previous exported height. It contains the module parameters and the existing liquid token :

```go
// GenesisState defines the module's genesis state.
type GenesisState struct {
// params defines all the paramaters of the module.
Params       Params  `protobuf:"bytes,1,opt,name=params,proto3" json:"params"`
// keeps track of denom ID
DenomCounter uint64  `protobuf:"varint,2,opt,name=denomCounter,proto3" json:"denomCounter,omitempty"`
// list of  liquid denoms
Denoms       []Denom `protobuf:"bytes,3,rep,name=denoms,proto3" json:"denoms"`
}
```

## State Transitions

### Liquidate

1. User submits `MsgLiquidate`
2. Checks if liquidation allowed for account and amount
    - tokens on target account are fully vested
    - specified amount is more than minimum liquidation amount param
    - specified amount is less or equal to locked token amount
3. Calculate new schedules for account and for liquid token
4. Update target account with new schedule
5. Escrow locked token to module account
6. Create new liquid token with previously calculated schedule and update token id counter
7. Send newly created liquid token to target account
8. Deploy erc20 contract for liquid token and register token pair with `x/erc20` module
9. Convert all liquid tokens from cosmos to erc20

### Redeem

1. User submits `MsgRedeem`
2. Checks if redeem possible
   - Specified liquid token does exist
   - Check user's account has sufficient amount of liquid token to redeem
3. Burn specified liquid token amount
4. Subtract burnt liquid token amount from liquid token schedule
5. Transfer ISLM to target account
6. Apply token unlock schedule to target account. If target account in not vesting account it will be converted to vesting one.

## Transactions

This section defines the `sdk.Msg` concrete types that result in the state transitions defined on the previous section.

### `MsgLiquidate`

A user broadcasts a `MsgLiquidate` message to liquidate locked ISLM token.

```go
type MsgLiquidate struct {
// account for liquidation of locked vesting tokens
LiquidateFrom string `protobuf:"bytes,1,opt,name=liquidate_from,json=liquidateFrom,proto3" json:"liquidate_from,omitempty"`
// account to send resulted liquid token
LiquidateTo string `protobuf:"bytes,2,opt,name=liquidate_to,json=liquidateTo,proto3" json:"liquidate_to,omitempty"`
// amount of tokens subject for liquidation
Amount types.Coin `protobuf:"bytes,3,opt,name=amount,proto3" json:"amount"`
}
```

Message stateless validation fails if:

- Amount is not positive
- LiquidateFrom bech32 address is invalid
- LiquidateTo bech32 address is invalid

### `MsgRedeem`

A user broadcasts a `MsgRedeem` message to redeem liquid token to locked ISLM.

```go
type MsgRedeem struct {
RedeemFrom string `protobuf:"bytes,1,opt,name=redeem_from,json=redeemFrom,proto3" json:"redeem_from,omitempty"`
// destination address for vesting tokens
RedeemTo string `protobuf:"bytes,2,opt,name=redeem_to,json=redeemTo,proto3" json:"redeem_to,omitempty"`
// amount of vesting tokens to redeem from liquidation module
Amount types.Coin `protobuf:"bytes,3,opt,name=amount,proto3" json:"amount"`
}
```

Message stateless validation fails if:

- Amount is not positive
- RedeemFrom bech32 address is invalid
- RedeemTo bech32 address is invalid

## Parameters

The `x/liquidvesting` module contains the following parameters:

| Key                        | Type       | Default Value       |
|----------------------------|------------|---------------------|
| `MinimumLiquidationAmount` | sdkmath.Int | `1000*10^18`        |

### Minimum liquidation amount

The `MinimumLiquidationAmount` parameter defines minimum amount of locked token which can be liquidated at once.

## Clients

### CLI

Find below a list of  `haqqd` commands added with the  `x/liquidvesting` module. You can obtain the full list by using the `haqqd -h` command. A CLI command can look like this:

```bash
haqqd query liquidvesting params
```

#### Queries

| Command                 | Subcommand | Description                    |
|-------------------------|------------|--------------------------------|
| `query` `liquidvesting` | `denom`    | Get liquid token               |
| `query` `liquidvesting` | `denoms`        | Get all existing liquid tokens |

#### Transactions

| Command  | Subcommand  | Description                                       |
|----------|-------------|---------------------------------------------------|
| `tx` `liquidvesting` | `liquidate` | Liquidates arbitrary amount of locked ISLM tokens |
| `tx` `liquidvesting` | `redeem`         | Redeem liquid token to ISLM                       |

### gRPC

#### Queries

| Verb   | Method                              | Description                   |
| ------ |-------------------------------------| ----------------------------- |
| `gRPC` | `haqq.liquidvesting.v1.Query/Denom` | Get liquid token     |
| `gRPC` | `haqq.liquidvesting.v1.Query/Denoms`            | Get all existing liquid tokens |
| `GET`  | `/haqq/liquidvesting/v1/denom`      | Get liquid token     |
| `GET`  | `/haqq/liquidvesting/v1/denom`      | Get all existing liquid tokens |

#### Transactions

| Verb   | Method                                | Description                    |
|--------|---------------------------------------| ------------------------------ |
| `gRPC` | `haqq.liquidvesting.v1.Msg/Liquidate` | Liquidates arbitrary amount of locked ISLM tokens |
| `gRPC` | `haqq.liquidvesting.v1.Msg/Redeem`     | Redeem liquid token to ISLM |
| `POST` | `/haqq/liquidvesting/v1/tx/liquidate` | Liquidates arbitrary amount of locked ISLM tokens |
| `POST` | `/haqq/liquidvesting/v1/tx/redeem`    | Redeem liquid token to ISLM |

## Shedule amount modification 

This section describes in details how `x/liquidvesting` module handles operation with schedule mutation. Examples are provided.
### Liquidation
For example we have an account this account has 3 days of vesting so each day represented as a period and has amount which be unlocked once period is passed. 
Let's imagine every period has different amount 10,20 and 30 respectively
```
10,20,30
```

So total amount locked in this schedule is 60. We want to liquidate 20 tokens from this schedule.
We will subtract portion of this amount from every period proportionally to total sum.
For the first period :
- 10 - first period amount
- 20 - liquidation amount
- 60 - total amount

Formula is 10 - 10*20/60 -> 10 - 200/60 -> 10 - 3 = 7

Important note in above calculations. We have step 200/60 and this division has a remainder. We will track this remainder but won't use it to calculate new period.

If we perform the same operation for every period we will get:
```
7,14,20
```
The sum of new periods is 41 but expected sum is 40 because we were subtracting 20 from periods with sum of 60.
So calculate diff between sum of new periods and expected sum and it is 1. Now having the diff we subtract it from last period. So we get:
```
7,14,19
```
These are our new periods. These new periods will be the new schedule of vesting account targeted by liquidation.

Now we need to know periods for newly created liquid token. and this is simply a diff between original periods and decreased periods
```
10,20,30 - original amount in periods
7,14,19 - decreased amount in periods
3,6,11 - liquid token amount in periods
```