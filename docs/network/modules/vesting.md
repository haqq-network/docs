---
sidebar_position: 8
title: x/vesting
---

# Vesting

## Abstract

This document specifies the internal `x/vesting` module of the HAQQ Network.

The `x/vesting` module introduces the `ClawbackVestingAccount`,  a new vesting account type that implements 
the Cosmos SDK [`VestingAccount`](https://docs.cosmos.network/main/modules/auth/vesting#vesting-account-types)
interface. This account is used to allocate tokens that are subject to vesting, lockup, and clawback.

The `ClawbackVestingAccount` allows any two parties to agree on a future rewarding schedule, where tokens are granted 
permissions over time. The parties can use this account to enforce legal contracts or commit to mutual long-term interests.

In this commitment, vesting is the mechanism for gradually earning permission to transfer and delegate allocated tokens.
Additionally, the lockup provides a mechanism to prevent the right to transfer allocated tokens and perform Ethereum
transactions from the account. Both vesting and lockup are defined in schedules at account creation.
At any time, the funder of a `ClawbackVestingAccount` can perform a clawback to retrieve unvested tokens.
The circumstances under which a clawback should be performed can be agreed upon in a contract (e.g. smart contract).

For HAQQ, the `ClawbackVestingAccount` is used to allocate tokens to users via airdrops, core team members and advisors to incentivize 
long-term participation in the project.

## Contents

1. **[Concepts](#concepts)**
2. **[State](#state-transitions)**
3. **[State Transitions](#state-transitions)**
4. **[Transactions](#transactions)**
5. **[AnteHandlers](#antehandlers)**
6. **[Events](#events)**
7. **[Clients](#clients)**

## References

- SDK vesting specification: [https://docs.cosmos.network/main/modules/auth/vesting](https://docs.cosmos.network/main/modules/auth/vesting)
- SDK vesting implementation: [https://github.com/cosmos/cosmos-sdk/tree/master/x/auth/vesting](https://github.com/cosmos/cosmos-sdk/tree/master/x/auth/vesting)
- Agoric’s Vesting Clawback Account: [https://github.com/Agoric/agoric-sdk/issues/4085](https://github.com/Agoric/agoric-sdk/issues/4085)
- Agoric’s `vestcalc` tool: [https://github.com/agoric-labs/cosmos-sdk/tree/Agoric/x/auth/vesting/cmd/vestcalc](https://github.com/agoric-labs/cosmos-sdk/tree/Agoric/x/auth/vesting/cmd/vestcalc)

## Module Architecture

:::note
If you're not familiar with the overall module structure from the SDK modules, please check this
[document](https://docs.cosmos.network/main/building-modules/structure.html) as prerequisite reading.
:::

```shell
vesting/
├── client
│   └── cli
│       ├── query.go                 # CLI query commands for the module
│       ├── tx.go                    # CLI transaction commands for the module
│       └── utils.go                 # Utility functions for CLI commands of the module
├── keeper
│   ├── grpc_query.go                # gRPC state query handlers
│   ├── keeper.go                    # Store keeper that handles the business logic of the module and has access to a specific subtree of the state tree.
│   └── msg_server.go                # Tx handlers
├── types
│   ├── clawback_vesting_account.go  # Utility functions for the ClawbackVestingAccount struct 
│   ├── codec.go                     # Type registration for encoding
│   ├── errors.go                    # Module-specific errors
│   ├── events.go                    # Events exposed to the CometBFT PubSub/Websocket
│   ├── interfaces.go                # The interfaces describing the components of the required modules
│   ├── keys.go                      # Store keys and utility functions
│   ├── msg.go                       # Vesting module transaction messages
│   ├── schedule.go                  # Schedule related functions of the module
│   └── utils.go                     # Utility functions of the module
├── handler.go                       # Message routing
└── module.go                        # Module setup for the module manager & ABCI InitGenesis and ExportGenesis functionality
```

## Concepts

### Vesting

Vesting describes the process of converting `unvested` into `vested` tokens without transferring the ownership 
of those tokens. In an unvested state, tokens cannot be transferred to other accounts, delegated to validators, 
or used for governance. A vesting schedule describes the amount and time at which tokens are vested.
The duration until which the first tokens are vested is called the `cliff`.

### Lockup

The lockup describes the schedule by which tokens are converted from a `locked` to an `unlocked` state. As long as all
tokens are locked, the account cannot perform any Ethereum transactions that spend ISLM using the `x/evm` module.
However, the account can perform Ethereum transactions that don't spend ISLM tokens. Additionally, locked tokens
cannot be transferred to other accounts. In the case in which tokens are both locked and vested at the same time,
it is possible to delegate them to validators, but not transfer them to other accounts.

The following table summarizes the actions that are allowed for tokens that are subject to the combination of vesting and lockup:

| Token Status            | Transfer | Delegate | Vote | Eth Txs that spend ISLM\*\* | Eth Txs that don't spend ISLM (amount=0)\*\* |
|-------------------------|:--------:|:--------:|:----:|:---------------------------:|:--------------------------------------------:|
| `locked` & `unvested`   |    ❌     |    ❌     |  ❌   |              ❌              |                      ✅                       |
| `locked` & `vested`     |    ❌     |    ✅     |  ✅   |              ❌              |                      ✅                       |
| `unlocked` & `unvested` |    ❌     |    ❌     |  ❌   |              ❌              |                      ✅                       |
| `unlocked` & `vested`\* |    ✅     |    ✅     |  ✅   |              ✅              |                      ✅                       |

\* Staking rewards are unlocked and vested

\*\* EVM transactions only fail if they involve sending locked or unvested ISLM tokens, e.g. send ISLM to EOA or Smart Contract (fails if amount > 0 ).

### Schedules

Vesting and lockup schedules specify the amount and time at which tokens are vested or unlocked. They are defined 
as [`periods`](https://docs.cosmos.network/main/modules/auth/vesting#period) where each period has its own length and amount.
A typical vesting schedule for instance would be defined starting with a one-year period to represent the vesting cliff,
followed by several monthly vesting periods until the total allocated vesting amount is vested.

Vesting or lockup schedules can be easily created with Agoric’s 
[`vestcalc`](https://github.com/agoric-labs/cosmos-sdk/tree/Agoric/x/auth/vesting/cmd/vestcalc) tool. E.g. to calculate
a four-year vesting schedule with a one year cliff, starting in January 2022, you can run vestcalc with:

```bash
vestcalc --write --start=2022-01-01 --coins=200000000000000000000000aISLM --months=48 --cliffs=2023-01-01
```

### Clawback

In case a `ClawbackVestingAccount`'s underlying commitment or contract is breached, the clawback provides a mechanism
to return unvested funds to the original funder. The funder of the `ClawbackVestingAccount` is the address that sends
tokens to the account at account creation. Only the funder can perform the clawback to return the funds to their account.
Alternatively, they can specify a destination address to send unvested funds to.

## State

### State Objects

The `x/vesting` module does not keep objects in its own store. Instead, it uses the SDK `auth` module to store account
objects in state using the [Account Interface](https://docs.cosmos.network/main/modules/auth#account-interface).
Accounts are exposed externally as an interface and stored internally as a clawback vesting account.

### ClawbackVestingAccount

An instance that implements
the [Vesting Account](https://docs.cosmos.network/main/modules/auth/vesting#vesting-account-types) interface.
It provides an account that can hold contributions subject to lockup, or vesting which is subject to clawback 
of unvested tokens, or a combination (tokens vest, but are still locked).

```go
type ClawbackVestingAccount struct {
	// base_vesting_account implements the VestingAccount interface. It contains
	// all the necessary fields needed for any vesting account implementation
	*types.BaseVestingAccount `protobuf:"bytes,1,opt,name=base_vesting_account,json=baseVestingAccount,proto3,embedded=base_vesting_account" json:"base_vesting_account,omitempty"`
	// funder_address specifies the account which can perform clawback
	FunderAddress string `protobuf:"bytes,2,opt,name=funder_address,json=funderAddress,proto3" json:"funder_address,omitempty"`
	// start_time defines the time at which the vesting period begins
	StartTime time.Time `protobuf:"bytes,3,opt,name=start_time,json=startTime,proto3,stdtime" json:"start_time"`
	// lockup_periods defines the unlocking schedule relative to the start_time
	LockupPeriods []types.Period `protobuf:"bytes,4,rep,name=lockup_periods,json=lockupPeriods,proto3" json:"lockup_periods"`
	// vesting_periods defines the vesting schedule relative to the start_time
	VestingPeriods []types.Period `protobuf:"bytes,5,rep,name=vesting_periods,json=vestingPeriods,proto3" json:"vesting_periods"`
}
```

#### BaseVestingAccount

Implements the `VestingAccount` interface. It contains all the necessary fields needed for any vesting account implementation.

#### FunderAddress

Specifies the account which provides the original tokens and can perform clawback.

#### StartTime

Defines the time at which the vesting and lockup schedules begin.

#### LockupPeriods

Defines the unlocking schedule relative to the start time.

#### VestingPeriods

Defines the vesting schedule relative to the start time.

### Genesis State

The `x/vesting` module allows the definition of `ClawbackVestingAccounts` at genesis. In this case, the account balance 
must be logged in the SDK `bank` module balances or automatically adjusted through the `add-genesis-account` CLI command.

## State Transitions

The `x/vesting` module allows for state transitions that create and update a clawback vesting account 
with `CreateClawbackVestingAccount` or perform a clawback of unvested funds with `Clawback`.

### Create Clawback Vesting Account

A funder creates a new clawback vesting account defining the address to fund as well as the vesting/lockup schedules.
Additionally, new grants can be added to existing clawback vesting accounts with the same message.

1. Funder submits a `MsgCreateClawbackVestingAccount` through one of the clients.
2. Check if
    1. the vesting account address is not blocked
    2. there is at least one vesting or lockup schedule provided.
       If one of them is absent, default to instant vesting or unlock schedule.
    3. lockup and vesting total amounts are equal
3. Create or update a clawback vesting account and send coins from the funder to the vesting account
    1. if the clawback vesting account already exists and `--merge` is set to true,
       add a grant to the existing total vesting amount and update the vesting and lockup schedules.
    2. else create a new clawback vesting account

### Convert Into Vesting Account


### Clawback

The funding address is the only address that can perform the clawback.

1. Funder submits a `MsgClawback` through one of the clients.
2. Check if
    1. a destination address is given and default to funder address if not
    2. the destination address is not blocked
    3. the account exists and is a clawback vesting account
    4. account funder is same as in msg
3. Transfer unvested tokens from the clawback vesting account to the destination address,
   update the lockup schedule and remove future vesting events.

### Update Clawback Vesting Account Funder

The funding address of an existing clawback vesting account can be updated only by the current funder.

1. Funder submits a `MsgUpdateVestingFunder` through one of the clients.
2. Check if
    1. the new funder address is not blocked
    2. the vesting account exists and is a clawback vesting account
    3. account funder is same as in msg
3. Update the vesting account funder with the new funder address.

### Convert Vesting Account

Once all tokens are vested, the vesting account can be converted to an `ETHAccount`

1. Owner of vesting account submits a `MsgConvertVestingAccount` through one of the clients.
2. Check if
    1. the vesting account exists and is a clawback vesting account
    2. the vesting account's vesting and locked schedules have concluded
3. Convert the vesting account to an `EthAccount`

## Transactions

This section defines the concrete `sdk.Msg` types, that result in the state transitions defined on the previous section.

### `CreateClawbackVestingAccount`

```go
type MsgCreateClawbackVestingAccount struct {
	// from_address specifies the account to provide the funds and sign the
	// clawback request
	FromAddress string `protobuf:"bytes,1,opt,name=from_address,json=fromAddress,proto3" json:"from_address,omitempty"`
	// to_address specifies the account to receive the funds
	ToAddress string `protobuf:"bytes,2,opt,name=to_address,json=toAddress,proto3" json:"to_address,omitempty"`
	// start_time defines the time at which the vesting period begins
	StartTime time.Time `protobuf:"bytes,3,opt,name=start_time,json=startTime,proto3,stdtime" json:"start_time"`
	// lockup_periods defines the unlocking schedule relative to the start_time
	LockupPeriods []types.Period `protobuf:"bytes,4,rep,name=lockup_periods,json=lockupPeriods,proto3" json:"lockup_periods"`
	// vesting_periods defines thevesting schedule relative to the start_time
	VestingPeriods []types.Period `protobuf:"bytes,5,rep,name=vesting_periods,json=vestingPeriods,proto3" json:"vesting_periods"`
	// merge specifies a the creation mechanism for existing
	// ClawbackVestingAccounts. If true, merge this new grant into an existing
	// ClawbackVestingAccount, or create it if it does not exist. If false,
	// creates a new account. New grants to an existing account must be from the
	// same from_address.
	Merge bool `protobuf:"varint,6,opt,name=merge,proto3" json:"merge,omitempty"`
}
```

The msg content stateless validation fails if:

- `FromAddress` or `ToAddress` are invalid
- `LockupPeriods` and `VestingPeriods`
    - include a period with a non-positive length or amount
    - do not describe the same total amount

### `ConvertIntoVestingAccount`

```go
type MsgConvertIntoVestingAccount struct {
	// from_address specifies the account to provide the funds and sign the
	// clawback request
	FromAddress string `protobuf:"bytes,1,opt,name=from_address,json=fromAddress,proto3" json:"from_address,omitempty"`
	// to_address specifies the account to receive the funds
	ToAddress string `protobuf:"bytes,2,opt,name=to_address,json=toAddress,proto3" json:"to_address,omitempty"`
	// start_time defines the time at which the vesting period begins
	StartTime time.Time `protobuf:"bytes,3,opt,name=start_time,json=startTime,proto3,stdtime" json:"start_time"`
	// lockup_periods defines the unlocking schedule relative to the start_time
	LockupPeriods []types.Period `protobuf:"bytes,4,rep,name=lockup_periods,json=lockupPeriods,proto3" json:"lockup_periods"`
	// vesting_periods defines thevesting schedule relative to the start_time
	VestingPeriods []types.Period `protobuf:"bytes,5,rep,name=vesting_periods,json=vestingPeriods,proto3" json:"vesting_periods"`
	// merge specifies a the creation mechanism for existing
	// ClawbackVestingAccounts. If true, merge this new grant into an existing
	// ClawbackVestingAccount, or create it if it does not exist. If false,
	// creates a new account. New grants to an existing account must be from the
	// same from_address.
	Merge bool `protobuf:"varint,6,opt,name=merge,proto3" json:"merge,omitempty"`
	// Stake specifies a the post-creation flow. If true, delegate the total
    // vested amount to a specified validator. If false, do nothing.
	Stake bool `protobuf:"varint,7,opt,name=stake,proto3" json:"stake,omitempty"`
	// ValidatorAddress specifies the validator to delegate tokens to.
	ValidatorAddress string `protobuf:"bytes,8,opt,name=validator_address,json=validatorAddress,proto3" json:"validator_address,omitempty"`
}
```

The msg content stateless validation fails if:

- `FromAddress` or `ToAddress` are invalid
- `LockupPeriods` and `VestingPeriods`
    - include a period with a non-positive length or amount
    - do not describe the same total amount

### `Clawback`

```go
type MsgClawback struct {
	// funder_address is the address which funded the account
	FunderAddress string `protobuf:"bytes,1,opt,name=funder_address,json=funderAddress,proto3" json:"funder_address,omitempty"`
	// account_address is the address of the ClawbackVestingAccount to claw back from.
	AccountAddress string `protobuf:"bytes,2,opt,name=account_address,json=accountAddress,proto3" json:"account_address,omitempty"`
	// dest_address specifies where the clawed-back tokens should be transferred
	// to. If empty, the tokens will be transferred back to the original funder of
	// the account.
	DestAddress string `protobuf:"bytes,3,opt,name=dest_address,json=destAddress,proto3" json:"dest_address,omitempty"`
}
```

The msg content stateless validation fails if:

- `FunderAddress` or `AccountAddress` are invalid
- `DestAddress` is not empty and invalid

### `UpdateVestingFunder`

```go
type MsgUpdateVestingFunder struct {
	// funder_address is the current funder address of the ClawbackVestingAccount
	FunderAddress string `protobuf:"bytes,1,opt,name=funder_address,json=funderAddress,proto3" json:"funder_address,omitempty"`
	// new_funder_address is the new address to replace the existing funder_address
	NewFunderAddress string `protobuf:"bytes,2,opt,name=new_funder_address,json=newFunderAddress,proto3" json:"new_funder_address,omitempty"`
	// vesting_address is the address of the ClawbackVestingAccount being updated
	VestingAddress string `protobuf:"bytes,3,opt,name=vesting_address,json=vestingAddress,proto3" json:"vesting_address,omitempty"`
}
```

The msg content stateless validation fails if:

- `FunderAddress`, `NewFunderAddress` or `VestingAddress` are invalid

### `ConvertVestingAccount`

```go
type MsgConvertVestingAccount struct {
	// vesting_address is the address of the ClawbackVestingAccount being updated
	VestingAddress string `protobuf:"bytes,2,opt,name=vesting_address,json=vestingAddress,proto3" json:"vesting_address,omitempty"`
}
```

The msg content stateless validation fails if:

- `VestingAddress` is invalid


## AnteHandlers

The `x/vesting` module provides `AnteDecorator`s that are recursively chained together into a single 
[`Antehandler`](https://github.com/cosmos/cosmos-sdk/blob/v0.43.0-alpha1/docs/architecture/adr-010-modular-antehandler.md).
These decorators perform basic validity checks on an Ethereum or SDK transaction, such that it could be thrown 
out of the transaction Mempool.

Note that the `AnteHandler` is called on both `CheckTx` and `DeliverTx`, as CometBFT proposers presently have 
the ability to include in their proposed block transactions that fail `CheckTx`.

### Decorators

The following decorators implement the vesting logic for token delegation and performing EVM transactions.

#### `VestingDelegationDecorator`

Validates if a transaction contains a staking delegation of unvested coins. This AnteHandler decorator will fail if:

- the message is not a `MsgDelegate`
- sender account cannot be found
- sender account is not a `ClawbackVestingAccount`
- the bond amount is greater than the coins already vested

#### `EthVestingTransactionDecorator`

Validates if a clawback vesting account is permitted to perform Ethereum transactions, based on if it has its vesting
schedule has surpassed the vesting cliff and first lockup period. Also, validates if the account has sufficient 
unlocked tokens to execute the transaction. This AnteHandler decorator will fail if:

- the message is not a `MsgEthereumTx`
- sender account cannot be found
- sender account is not a `ClawbackVestingAccount`
- block time is before surpassing vesting cliff end (with zero vested coins) AND
- block time is before surpassing all lockup periods (with non-zero locked coins)
- sender account has insufficient unlocked tokens to execute the transaction

## Events

The `x/vesting` module emits the following events:

### Create Clawback Vesting Account

| Type                              | Attibute Key   | Attibute Value                    |
|-----------------------------------|----------------|-----------------------------------|
| `create_clawback_vesting_account` | `"from"`       | `{msg.FromAddress}`               |
| `create_clawback_vesting_account` | `"coins"`      | `{vestingCoins.String()}`         |
| `create_clawback_vesting_account` | `"start_time"` | `{msg.StartTime.String()}`        |
| `create_clawback_vesting_account` | `"merge"`      | `{strconv.FormatBool(msg.Merge)}` |
| `create_clawback_vesting_account` | `"amount"`     | `{msg.ToAddress}`                 |

### Clawback

| Type       | Attibute Key    | Attibute Value         |
|------------|-----------------|------------------------|
| `clawback` | `"funder"`      | `{msg.FromAddress}`    |
| `clawback` | `"account"`     | `{msg.AccountAddress}` |
| `clawback` | `"destination"` | `{msg.DestAddress}`    |

### Update Clawback Vesting Account Funder

| Type                    | Attibute Key   | Attibute Value           |
|-------------------------|----------------|--------------------------|
| `update_vesting_funder` | `"funder"`     | `{msg.FromAddress}`      |
| `update_vesting_funder` | `"account"`    | `{msg.VestingAddress}`   |
| `update_vesting_funder` | `"new_funder"` | `{msg.NewFunderAddress}` |

## Clients

A user can query the HAQQ `x/vesting` module using the CLI, gRPC, or REST.

:::note
Due to namespace conflict with native Evmos vesting module HAQQ `x/vesting` module has been implemented using 
`haqqvesting` namespace instead.
:::

### CLI

Find below a list of `haqqd` commands added with the `x/vesting` module. You can obtain the full list by using the `haqqd -h` command.

#### Genesis

The genesis configuration commands allow users to configure the genesis `vesting` account state.

`add-genesis-account`

Allows users to set up clawback vesting accounts at genesis, funded with an allocation of tokens, subject to clawback.
Must provide a lockup periods file (`--lockup`), a vesting periods file (`--vesting`), or both.

If both files are given, they must describe schedules for the same total amount. If one file is omitted,
it will default to a schedule that immediately unlocks or vests the entire amount. The described amount of coins
will be transferred from the `--from` address to the vesting account. Unvested coins may be "clawed back" 
by the funder with the clawback command. Coins may not be transferred out of the account if they are locked or unvested.
Only vested coins may be staked. For an example of how to set this see [this link](https://github.com/evmos/evmos/pull/303).

```go
haqqd add-genesis-account ADDRESS_OR_KEY_NAME COIN... [flags]
```

#### Queries

The `query` commands allow users to query `vesting` account state.

**`balances`**

Allows users to query the locked, unvested and vested tokens for a given vesting account

```go
haqqd query haqqvesting balances ADDRESS [flags]
```

#### Transactions

The `tx` commands allow users to create and clawback `vesting` account state.

**`create-clawback-vesting-account`**

Allows users to create a new vesting account funded with an allocation of tokens, subject to clawback.
Must provide a lockup periods file (`--lockup`), a vesting periods file (`--vesting`), or both.

If both files are given, they must describe schedules for the same total amount. If one file is omitted,
it will default to a schedule that immediately unlocks or vests the entire amount. The described amount of coins 
will be transferred from the `--from` address to the vesting account. Unvested coins may be "clawed back"
by the funder with the clawback command. Coins may not be transferred out of the account if they are locked or unvested.
Only vested coins may be staked. For an example of how to set this see [this link](https://github.com/evmos/evmos/pull/303).

```go
haqqd tx haqqvesting create-clawback-vesting-account TO_ADDRESS [flags]
```

**`convert-into`**

Allows users to convert the existing chain's default account into a new vesting account funded with an allocation
of tokens, subject to clawback. Must provide a lockup periods file (`--lockup`), a vesting periods file (`--vesting`), or both.
This method has an additional feature to immediately stake all vested amount on conversion to the given validator.

If both files are given, they must describe schedules for the same total amount. If one file is omitted,
it will default to a schedule that immediately unlocks or vests the entire amount. The described amount of coins
will be transferred from the `--from` address to the vesting account. Unvested coins may be "clawed back"
by the funder with the clawback command. Coins may not be transferred out of the account if they are locked or unvested.
Only vested coins may be staked. For an example of how to set this see [this link](https://github.com/evmos/evmos/pull/303).
If `--validator` address is given, all vested coins that a subject of the given msg will be delegated to the described
validator.

```go
haqqd tx haqqvesting convert-into TO_ADDRESS [flags]
```

**`clawback`**

Allows users to create a transfer unvested amount out of a `ClawbackVestingAccount`. Must be requested by the original
funder address (`--from`) and may provide a destination address (`--dest`), otherwise the coins return to the funder.
Delegated or undelegating staking tokens will be transferred in the delegated (undelegating) state. The recipient
is vulnerable to slashing, and must act to unbond the tokens if desired.

```go
haqqd tx haqqvesting clawback ADDRESS [flags]
```

**`update-vesting-funder`**

Allows users to update the funder of an existent `ClawbackVestingAccount`. Must be requested by the original
funder address (`--from`). To perform this action, the user needs to provide two arguments:

1. the new funder address
2. the vesting account address

```go
haqqd tx haqqvesting update-vesting-funder VESTING_ACCOUNT_ADDRESS NEW_FUNDER_ADDRESS --from=FUNDER_ADDRESS [flags]
```

**`convert`**

Allows users to convert their vesting account to the chain's default account (i.e `EthAccount`).
To perform this action a user needs to provide one argument:

1. the vesting account address

```go
haqqd tx haqqvesting convert VESTING_ACCOUNT_ADDRESS [flags]
```

### gRPC

#### Queries

| Verb   | Method                                | Description                            |
|--------|---------------------------------------|----------------------------------------|
| `gRPC` | `haqq.vesting.v1.Query/Balances`      | Gets locked, unvested and vested coins |
| `GET`  | `/haqq/vesting/v1/balances/{address}` | Gets locked, unvested and vested coins |

#### Transactions

| Verb   | Method                                                | Description                                            |
|--------|-------------------------------------------------------|--------------------------------------------------------|
| `gRPC` | `haqq.vesting.v1.Msg/CreateClawbackVestingAccount`    | Creates clawback vesting account                       |
| `gRPC` | `haqq.vesting.v1.Msg/ConvertIntoVestingAccount`       | Convert existing account into clawback vesting account |
| `gRPC` | `haqq.vesting.v1.Msg/Clawback`                        | Performs clawback                                      |
| `gRPC` | `haqq.vesting.v1.Msg/UpdateVestingFunder`             | Updates vesting account funder                         |
| `GET`  | `/haqq/vesting/v1/tx/create_clawback_vesting_account` | Creates clawback vesting account                       |
| `GET`  | `/haqq/vesting/v1/tx/clawback`                        | Performs clawback                                      |
| `GET`  | `/haqq/vesting/v1/tx/update_vesting_funder`           | Updates vesting account funder                         |
