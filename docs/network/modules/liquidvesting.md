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
:::

## Contents

1. **[Abstract](#abstract)**
2. **[Contents](#contents)**
3. **[References](#references)**
4. **[Module Architecture](#module-architecture)**
5. **[Concepts](#concepts)**


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

Any user who holds 1,000 ISLM tokens in vesting can create `aLIQUIDX` tokens. For every token creation, an exact amount of `aISLM` (minimal denomination is 10^18 aISLM equals 1 `ISLM`) is deducted from the user's vested balance corresponding to the number of aLIQUIDX tokens created. Each creation of `aLIQUIDX` tokens generates a new denomination and a new token—such as `aLIQUID1`, `aLIQUID2`, etc. A specific schedule assigned to the module by the creator of the token is associated with each of these denominations. Thus, each `aLIQUIDX` has its own unique schedule which may differ from another `aLIQUIDY` if `X != Y`. After creation, any user can exchange their `aLIQUIDX` tokens back into aISLM according to the schedule of that specific token. The exchange can be for all tokens at once or just a portion.

aLIQUIDX tokens can be transferred across both EVM and Cosmos layers.

The minimum creation threshold of 1,000 ISLM tokens is set to reduce the number of denoms.

**The primary purpose of `aLIQUIDX` is to enable p2p market for locked ISLM tokens.**

### Example

User A with schedule SA creates 2,000 `aLIQUID1` tokens.

User B with schedule SB creates 2,000 `aLIQUID2` tokens.

User C has no schedule.

If Users A and B transfer/sell 1,000 aLIQUID1 and 1,000 aLIQUID2 to User C, then User C's balance will simply show 1,000 aLIQUID1 and 1,000 aLIQUID2. However, if User C decides to exchange 500 aLIQUID1 for 500 aISLM, the exchange will apply schedule SA, resulting in a balance of 500 aISLM, 500 aLIQUID1, and 1,000 aLIQUID2. The 500 aISLM cannot be sold or transferred until they are unlocked according to schedule SA. If later, User C exchanges another 500 aLIQUID2, their schedule will become a combination of SA and SB, and their balance will be 1,000 aISLM, 500 aLIQUID1, and 500 aLIQUID2. Unlocking intervals apply equally regardless of the token form.


