---
sidebar_position: 4
title: x/erc20
---

# ERC-20

## Abstract

This document specifies the internal `x/erc20` module of the HAQQ Network.

The `x/erc20` module enables the HAQQ Network to support a trustless, on-chain bidirectional internal conversion of tokens
between HAQQ EVM and Cosmos runtimes, specifically the [`x/evm`](../modules/evm) and [`x/bank`](../modules/bank) modules.
This allows token holders on HAQQ to instantaneously convert their native Cosmos `sdk.Coins` (in this document
referred to as "Coin(s)") to ERC-20 (aka "Token(s)") and vice versa, while retaining fungibility with the original
asset on the issuing environment/runtime (EVM or Cosmos) and preserving ownership of the ERC-20 contract.

This conversion functionality is fully governed by native ISLM token holders who manage the canonical `TokenPair`
registrations (ie, ERC20 ←→ Coin mappings). This governance functionality is implemented using the Cosmos-SDK
`gov` module with custom proposal types for registering and updating the canonical mappings respectively.

Why is this important? Cosmos and the EVM are two runtimes that are not compatible by default. The native Cosmos Coins
cannot be used in applications that require the ERC-20 standard. Cosmos coins are held on the `x/bank` module
(with access to module methods like querying the supply or balances) and ERC-20 Tokens live on smart contracts.
This problem is similar to [wETH](https://coinmarketcap.com/alexandria/article/what-is-wrapped-ethereum-weth),
with the difference, that it not only applies to gas tokens (like ISLM), but to all Cosmos Coins (IBC vouchers,
staking and gov coins, etc.) as well.

With the `x/erc20` users on HAQQ can

- use existing native cosmos assets (like OSMO or ATOM) on EVM-based chains, e.g. for Trading IBC tokens on DeFi protocols, buying NFT, etc.
- transfer existing tokens on Ethereum and other EVM-based chains to HAQQ to take advantage of application-specific chains in the Cosmos ecosystem
- build new applications that are based on ERC-20 smart contracts and have access to the Cosmos ecosystem.

## Contents

1. **[Concepts](#concepts)**
2. **[State](#state)**
3. **[State Transitions](#state-transitions)**
4. **[Transactions](#transactions)**
5. **[Hooks](#hooks)**
6. **[Events](#events)**
7. **[Parameters](#parameters)**
8. **[Clients](#clients)**

## Module Architecture

:::note
If you're not familiar with the overall module structure from the SDK modules, please check this
[document](https://docs.cosmos.network/main/building-modules/structure.html) as prerequisite reading.
:::

```shell
erc20/
├── client
│   ├── cli
│   │   ├── query.go         # CLI query commands for the module
│   │   ├── tx.go            # CLI tx commands for the module
│   │   └── utils.go         # Utility functions for CLI commands of the module
│   └── proposal_handler.go  # Registration of Governance proposal handlers
├── keeper
│   ├── evm.go               # EVM-related functions (eg. DeployERC20Contract, QueryERC20, etc.)
│   ├── evm_hooks.go         # EVM hooks that handles coin/token conversion
│   ├── grpc_query.go        # gRPC state query handlers
│   ├── ibc_callbacks.go     # Implements ICS20 middleware interface to handle coin/token conversion on IBC transfers
│   ├── keeper.go            # Store keeper that handles the business logic of the module and has access to a specific subtree of the state tree.
│   ├── migrations.go        # The module migration handler
│   ├── mint.go              # Checks if mint enabled or not
│   ├── msg_server.go        # Tx handlers
│   ├── params.go            # Parameter getter and setter
│   ├── proposals.go         # Governance proposal handlers
│   └── token_pairs.go       # Store state handlers (setters and getters) of the module
├── migrations
│   └── v3
│       ├── types
│       │   └── params.go    # Params struct for consensus version 3 of the module
│       └── migration.go     # Migration handler from consensus version 2 to 3
├── spec
│   └── *.md                 # The specifications of the module
├── types
│   ├── codec.go             # Type registration for encoding
│   ├── errors.go            # Module-specific errors
│   ├── events.go            # Events exposed to the CometBFT PubSub/Websocket
│   ├── evm.go               # Go struct representations for related EVM responses
│   ├── genesis.go           # Genesis state for the module
│   ├── interfaces.go        # The interfaces describing the components of the required modules
│   ├── keys.go              # Store keys and utility functions
│   ├── msg.go               # Module transaction messages
│   ├── params.go            # Module parameters that can be customized with governance parameter change proposals
│   ├── proposal.go          # Utility functions for Governance proposals
│   ├── token_pair.go        # Utility functions for TokenPair struct
│   └── utils.go             # Utility functions for the module
├── genesis.go               # ABCI InitGenesis and ExportGenesis functionality
├── handler.go               # Message routing
├── ibc_middleware.go        # IBC Middleware, handles ICS20 callbacks
├── module.go                # Module setup for the module manager
└── proposal_handler.go      # Proposals routing
```

## Concepts

### Token Pair

The `x/erc20` module maintains a canonical one-to-one mapping of native Cosmos Coin denomination to ERC20 Token contract
addresses (i.e `sdk.Coin` ←→ ERC20), called `TokenPair`.
The conversion of the ERC20 tokens ←→ Coin of a given pair can be enabled or disabled via governance.

### Token Pair Registration

Users can register a new token pair proposal through the governance module and initiate a vote to include the token pair in the module.
Depending on which exists first, the coin or the token, you can either register a Cosmos Coin or a ERC20 Token to create a token pair.
One proposal can inculde several token pairs.

When the proposal passes, the `erc20` module registers the Cosmos Coin and ERC20 Token mapping on the application's store.

#### Registration of a Cosmos Coin

A native Cosmos Coin corresponds to an `sdk.Coin` that is native to the bank module.
It can be either the native staking/gas denomination (e.g. ISLM, ATOM, etc) or an IBC fungible token voucher
(i.e. with denom format of `ibc/{hash}`).

When a proposal is initiated for an existing native Cosmos Coin, the erc20 module will deploy a factory ERC20 contract,
representing the ERC20 token for the token pair, giving the module ownership of that contract.

#### Registration of an ERC20 token

A proposal for an existing (i.e already deployed) ERC20 contract can be initiated too.
In this case, the ERC20 maintains the original owner of the contract and uses an escrow & mint / burn & unescrow
mechanism similar to the one defined by the
[ICS20 - Fungible Token Transfer](https://github.com/cosmos/ibc/blob/master/spec/app/ics-020-fungible-token-transfer)
specification.
The token pair is composed of the original ERC20 token and a corresponding native Cosmos coin denomination.

#### Token details and metadata

Coin metadata is derived from the ERC20 token details (name, symbol, decimals) and vice versa.
A special case is also described below that for the ERC20 representation of IBC fungible token (ICS20) vouchers.

#### Coin Metadata to ERC20 details

During the registration of a Cosmos Coin the following bank `Metadata` is used to deploy a ERC20 contract:

- **Name**
- **Symbol**
- **Decimals**

The native Cosmos Coin contains a more extensive metadata than the ERC20 and includes all necessary details
for the conversion into a ERC20 Token, which requires no additional population of data.

#### IBC voucher Metadata to ERC20 details

IBC vouchers should comply to the following standard:

- **Name**: `{NAME} channel-{channel}`
- **Symbol**: `ibc{NAME}-{channel}`
- **Decimals**: derived from bank `Metadata`

#### ERC20 details to Coin Metadata

During the Registration of an ERC20 Token the Coin metadata is derived from the ERC20 metadata and the bank metadata:

- **Description**: `Cosmos coin token representation of {contractAddress}`
- **DenomUnits**:
  - Coin: `0`
  - ERC20: `{uint32(erc20Data.Decimals)}`
- **Base**: `{"erc20/%s", address}`
- **Display**: `{erc20Data.Name}`
- **Name**: `{types.CreateDenom(strContract)}`
- **Symbol:** `{erc20Data.Symbol}`

### Token Pair Modifiers

A valid token pair can be modified through several governance proposals. The internal conversion of a token pair
can be toggled with `ToggleTokenConversionProposal`, so that the conversions between the token pair's tokens
can be enabled or disabled.

### Token Conversion

Once a token pair proposal passes, the module allows for the conversion of that token pair.
Holders of native Cosmos coins and IBC vouchers on the HAQQ Network can convert their Coin into ERC20 Tokens,
which can then be used in HAQQ EVM, by creating a `ConvertCoin` Tx.
Vice versa, the `ConvertERC20` Tx allows holders of ERC20 tokens on the HAQQ Network to convert ERC-20 tokens
back to their native Cosmos Coin representation.

Depending on the ownership of the ERC20 contract, the ERC20 tokens either follow a burn/mint or a transfer/escrow
mechanism during conversion.

### Malicious Contracts

The ERC20 standard is an interface that defines a set of method signatures (name, arguments and output) without defining
its methods' internal logic. Therefore it is possible for developers to deploy contracts that contain hidden
malicious behaviour within those methods. For instance, the ERC20 `transfer` method, which is responsible for
sending an `amount` of tokens to a given `recipient` could include code to siphon some amount of tokens intended
for the recipient into a different predefined account, which is owned by the malicious contract deployer.

More sophisticated malicious implementations might also inherit code from customized ERC20 contracts that
include malicous behaviour. For an overview of more extensive examples, please review the `x/erc20` audit,
section `IF-EVMOS-06: IERC20 Contracts may execute arbitrary code`.

As the `x/erc20` module allows any arbitrary ERC20 contract to be registered through governance, it is essential
that the proposer or the voters manually verify during voting phase that the proposed contract uses
the default `ERC20.sol` implementation.

Here are our recommendations for the reviewing process:

- contract solidity code should be verified and accessable (e.g. using an explorer)
- contract should be audited by a reputable auditor
- inherited contracts need to be verified for correctness

## State

### State Objects

The `x/erc20` module keeps the following objects in state:

| State Object       | Description                                    | Key                         | Value               | Store |
| ------------------ | ---------------------------------------------- | --------------------------- | ------------------- | ----- |
| `TokenPair`        | Token Pair bytecode                            | `[]byte{1} + []byte(id)`    | `[]byte{tokenPair}` | KV    |
| `TokenPairByERC20` | Token Pair id bytecode by erc20 contract bytes | `[]byte{2} + []byte(erc20)` | `[]byte(id)`        | KV    |
| `TokenPairByDenom` | Token Pair id bytecode by denom string         | `[]byte{3} + []byte(denom)` | `[]byte(id)`        | KV    |

#### Token Pair

One-to-one mapping of native Cosmos coin denomination to ERC20 token contract addresses (i.e `sdk.Coin` ←→ ERC20).

```go
type TokenPair struct {
	// address of ERC20 contract token
	Erc20Address string `protobuf:"bytes,1,opt,name=erc20_address,json=erc20Address,proto3" json:"erc20_address,omitempty"`
	// cosmos base denomination to be mapped to
	Denom string `protobuf:"bytes,2,opt,name=denom,proto3" json:"denom,omitempty"`
	// shows token mapping enable status
	Enabled bool `protobuf:"varint,3,opt,name=enabled,proto3" json:"enabled,omitempty"`
	// ERC20 owner address ENUM (0 invalid, 1 ModuleAccount, 2 external address
	ContractOwner Owner `protobuf:"varint,4,opt,name=contract_owner,json=contractOwner,proto3,enum=evmos.erc20.v1.Owner" json:"contract_owner,omitempty"`
}
```

#### Token pair ID

The unique identifier of a `TokenPair` is obtained by obtaining the SHA256 hash of the ERC20 hex contract address
and the Coin denomination using the following function:

```tsx
tokenPairId = sha256(erc20 + '|' + denom);
```

#### Token Origin

The `ConvertCoin` and `ConvertERC20` functionalities use the owner field to check whether the token being
used is a native Coin or a native ERC20. The field is based on the token registration proposal
type (`RegisterCoinProposal` = 1, `RegisterERC20Proposal` = 2).

The `Owner` enumerates the ownership of a ERC20 contract.

```go
type Owner int32

const (
	// OWNER_UNSPECIFIED defines an invalid/undefined owner.
	OWNER_UNSPECIFIED Owner = 0
	// OWNER_MODULE erc20 is owned by the erc20 module account.
	OWNER_MODULE Owner = 1
	// EXTERNAL erc20 is owned by an external account.
	OWNER_EXTERNAL Owner = 2
)
```

The `Owner` can be checked with the following helper functions:

```go
// IsNativeCoin returns true if the owner of the ERC20 contract is the
// erc20 module account
func (tp TokenPair) IsNativeCoin() bool {
	return tp.ContractOwner == OWNER_MODULE
}

// IsNativeERC20 returns true if the owner of the ERC20 contract not the
// erc20 module account
func (tp TokenPair) IsNativeERC20() bool {
	return tp.ContractOwner == OWNER_EXTERNAL
}
```

#### Token Pair by ERC20 and by Denom

`TokenPairByERC20` and `TokenPairByDenom` are additional state objects for querying a token pair id.

### Genesis State

The `x/erc20` module's `GenesisState` defines the state necessary for initializing the chain from a previous exported height.
It contains the module parameters and the registered token pairs:

```go
// GenesisState defines the module's genesis state.
type GenesisState struct {
	// module parameters
	Params Params `protobuf:"bytes,1,opt,name=params,proto3" json:"params"`
	// registered token pairs
	TokenPairs []TokenPair `protobuf:"bytes,2,rep,name=token_pairs,json=tokenPairs,proto3" json:"token_pairs"`
}
```

## State Transitions

The `x/erc20` module allows for two types of registration state transitions.
Depending on how token pairs are registered, with `RegisterCoinProposal` or `RegisterERC20Proposal`,
there are four possible conversion state transitions.

### Token Pair Registration

Both the Cosmos coin and the ERC20 token registration allow for registering several token pairs with one proposal.
For simplicity, the following description describes the registration of only one token pair per proposal.

#### 1. Register Coin

A user registers a native Cosmos Coin. Once the proposal passes (i.e is approved by governance),
the ERC20 module uses a factory pattern to deploy an ERC20 token contract representation of the Cosmos Coin.
Note that the native ISLM coin cannot be registered, as any coin including "evm" in its denomination cannot be registered.

1. User submits a `RegisterCoinProposal`
2. Validators of the HAQQ Network vote on the proposal using `MsgVote` and proposal passes
3. If Cosmos coin or IBC voucher exist on the bank module supply,
   create the [ERC20 token contract](https://github.com/haqq-network/haqq/blob/master/contracts/ERC20MinterBurnerDecimals.sol)
   on the EVM based on the ERC20Mintable
   ([ERC20Mintable by openzeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/ERC20))
   interface
   - Initial supply: 0
   - Token details (Name, Symbol, Decimals, etc) are derived from the bank module `Metadata` field on the proposal content.

#### 2. Register ERC20

A user registers a ERC20 token contract that is already deployed on the EVM module.
Once the proposal passes (i.e. is approved by governance), the ERC20 module creates a Cosmos coin representation of the ERC20 token.

1. User submits a `RegisterERC20Proposal`
2. Validators of the HAQQ Network vote on the proposal using `MsgVote` and proposal passes
3. If ERC-20 contract is deployed on the EVM module, create a bank coin `Metadata` from the ERC20 details.

### Token Pair Conversion

Conversion of a registered `TokenPair` can be done via:

- Cosmos transaction (`ConvertCoin` and `ConvertERC20)`
- Ethereum transaction (i.e sending a `MsgEthereumTx` that leverages the EVM hook)

#### 1. Registered Coin

:::tip
👉 **Context:** A `TokenPair` has been created through a `RegisterCoinProposal` governance proposal.
The proposal created an `ERC20` contract
([ERC20Mintable by openzeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/ERC20))
of the ERC20 token representation of the Coin from the `ModuleAccount`,
assigning it as the `owner` of the contract
and thus granting it the permission to call the `mint()` and `burnFrom()` methods of the ERC20.
:::

##### Invariants

- Only the `ModuleAccount` should have the Minter Role on the ERC20. Otherwise, the user could unilaterally mint
  an infinite supply of the ERC20 token and then convert them to the native Coin
- The user and the `ModuleAccount` (owner) should be the only ones that have the Burn Role for a Cosmos Coin
- There shouldn't exist any native Cosmos Coin ERC20 Contract (eg ISLM, Atom,
  Osmo ERC20 contracts) that is not owned by the governance
- Token/Coin supply is maintained at all times:
  - Total Coin supply = Coins + Escrowed Coins
  - Total Token supply = Escrowed Coins = Minted Tokens

##### 1.1 Coin to ERC20

1. User submits `ConvertCoin` Tx
2. Check if conversion is allowed for the pair, sender and recipient
   - global parameter is enabled
   - token pair is enabled
   - sender tokens are not vesting (checked in the bank module)
   - recipient address is not blacklisted
3. If Coin is a native Cosmos Coin and Token Owner is `ModuleAccount`
   1. Escrow Cosmos coin by sending them to the `erc20` module account
   2. Call `mint()` ERC20 tokens from the `ModuleAccount` address and send minted tokens to recipient address
4. Check if token balance increased by amount

##### 1.2 ERC20 to Coin

1. User submits a `ConvertERC20` Tx
2. Check if conversion is allowed for the pair, sender and recipient (see [1.1 Coin to ERC20](#11-coin-to-erc20))
3. If token is a ERC20 and Token Owner is `ModuleAccount`
   1. Call `burnCoins()` on ERC20 to burn ERC20 tokens from the user balance
   2. Send Coins (previously escrowed, see [1.1 Coin to ERC20](#11-coin-to-erc20)) from module to the recipient address.
4. Check if
   - Coin balance increased by amount
   - Token balance decreased by amount

#### 2. Registered ERC20

:::tip
👉 **Context:** A `TokenPair` has been created through a `RegisterERC20Proposal` governance proposal.
The `ModuleAccount` is not the owner of the contract, so it can't mint new tokens or burn on behalf of the user.
The mechanism described below follows the same model as the ICS20 standard, by using escrow & mint / burn & unescrow logic.
:::

##### Invariants

- ERC20 Token supply on the EVM runtime is maintained at all times:
  - Escrowed ERC20 + Minted Cosmos Coin representation of ERC20 = Burned Cosmos Coin representation of ERC20 +
    Unescrowed ERC20
    - Convert 10 ERC20 → Coin, the total supply increases by 10. Mint on Cosmos side, no changes on EVM
    - Convert 10 Coin → ERC20, the total supply decreases by 10. Burn on Cosmos side , no changes of supply on EVM
  - Total ERC20 token supply = Non Escrowed Tokens + Escrowed Tokens (on Module account address)
  - Total Coin supply for the native ERC20 = Escrowed ERC20 Tokens on module account (i.e balance) = Minted Coins

##### 2.1 ERC20 to Coin

1. User submits a `ConvertERC20` Tx
2. Check if conversion is allowed for the pair, sender and recipient (See [1.1 Coin to ERC20](#11-coin-to-erc20))
3. If token is a ERC20 and Token Owner is **not** `ModuleAccount`
   1. Escrow ERC20 token by sending them to the `erc20` module account
   2. Mint Cosmos coins of the corresponding token pair denomination and send coins to the recipient address
4. Check if
   - Coin balance increased by amount
   - Token balance decreased by amount
5. Fail if unexpected `Approval` event found in logs to prevent malicious contract behaviour

##### 2.2 Coin to ERC20

1. User submits `ConvertCoin` Tx
2. Check if conversion is allowed for the pair, sender and recipient
3. If coin is a native Cosmos coin and Token Owner is **not** `ModuleAccount`
   1. Escrow Cosmos Coins by sending them to the `erc20` module account
   2. Unlock escrowed ERC20 from the module address by sending it to the recipient
   3. Burn escrowed Cosmos coins
4. Check if token balance increased by amount
5. Fail if unexpected `Approval` event found in logs to prevent malicious contract behaviour

## Transactions

This section defines the `sdk.Msg` concrete types that result in the state transitions defined on the previous section.

### `RegisterCoinProposal`

A gov `Content` type to register a token pair from a Cosmos Coin. Governance users vote on this proposal
and it automatically executes the custom handler for `RegisterCoinProposal` when the vote passes.

```go
type RegisterCoinProposal struct {
	// title of the proposal
	Title string `protobuf:"bytes,1,opt,name=title,proto3" json:"title,omitempty"`
	// proposal description
	Description string `protobuf:"bytes,2,opt,name=description,proto3" json:"description,omitempty"`
	// metadata slice of the native Cosmos coins
	Metadata []types.Metadata `protobuf:"bytes,3,rep,name=metadata,proto3" json:"metadata"`
}
```

The proposal content stateless validation fails if:

- Title is invalid (length or char)
- Description is invalid (length or char)
- Metadata is invalid
  - Name and Symbol are not blank
  - Base and Display denominations are valid coin denominations
  - Base and Display denominations are present in the `DenomUnit` slice
  - Base denomination has exponent 0
  - Denomination units are sorted in ascending order
  - Denomination units not duplicated

### `RegisterERC20Proposal`

A gov `Content` type to register a token pair from an ERC20 Token. Governance users vote on this proposal
and it automatically executes the custom handler for `RegisterERC20Proposal` when the vote passes.

```go
type RegisterERC20Proposal struct {
	// title of the proposal
	Title string `protobuf:"bytes,1,opt,name=title,proto3" json:"title,omitempty"`
	// proposal description
	Description string `protobuf:"bytes,2,opt,name=description,proto3" json:"description,omitempty"`
	// contract addresses of ERC20 tokens
	Erc20Addresses []string `protobuf:"bytes,3,rep,name=erc20addresses,proto3" json:"erc20addresses,omitempty"`
}
```

The proposal Content stateless validation fails if:

- Title is invalid (length or char)
- Description is invalid (length or char)
- ERC20Addresses is invalid

### `MsgConvertCoin`

A user broadcasts a `MsgConvertCoin` message to convert a Cosmos Coin to a ERC20 token.

```go
type MsgConvertCoin struct {
	// Cosmos coin which denomination is registered on erc20 bridge.
	// The coin amount defines the total ERC20 tokens to convert.
	Coin types.Coin `protobuf:"bytes,1,opt,name=coin,proto3" json:"coin"`
	// recipient hex address to receive ERC20 token
	Receiver string `protobuf:"bytes,2,opt,name=receiver,proto3" json:"receiver,omitempty"`
	// cosmos bech32 address from the owner of the given ERC20 tokens
	Sender string `protobuf:"bytes,3,opt,name=sender,proto3" json:"sender,omitempty"`
}
```

Message stateless validation fails if:

- Coin is invalid (invalid denom or non-positive amount)
- Receiver hex address is invalid
- Sender bech32 address is invalid

### `MsgConvertERC20`

A user broadcasts a `MsgConvertERC20` message to convert a ERC20 token to a native Cosmos coin.

```go
type MsgConvertERC20 struct {
	// ERC20 token contract address registered on erc20 bridge
	ContractAddress string `protobuf:"bytes,1,opt,name=contract_address,json=contractAddress,proto3" json:"contract_address,omitempty"`
	// amount of ERC20 tokens to mint
	Amount github_com_cosmos_cosmos_sdk_types.Int `protobuf:"bytes,2,opt,name=amount,proto3,customtype=github.com/cosmos/cosmos-sdk/types.Int" json:"amount"`
	// bech32 address to receive SDK coins.
	Receiver string `protobuf:"bytes,3,opt,name=receiver,proto3" json:"receiver,omitempty"`
	// sender hex address from the owner of the given ERC20 tokens
	Sender string `protobuf:"bytes,4,opt,name=sender,proto3" json:"sender,omitempty"`
}
```

Message stateless validation fails if:

- Contract address is invalid
- Amount is not positive
- Receiver bech32 address is invalid
- Sender hex address is invalid

### `ToggleTokenConversionProposal`

A gov Content type to toggle the internal conversion of a token pair.

```go
type ToggleTokenConversionProposal struct {
	// title of the proposal
	Title string `protobuf:"bytes,1,opt,name=title,proto3" json:"title,omitempty"`
	// proposal description
	Description string `protobuf:"bytes,2,opt,name=description,proto3" json:"description,omitempty"`
	// token identifier can be either the hex contract address of the ERC20 or the
	// Cosmos base denomination
	Token string `protobuf:"bytes,3,opt,name=token,proto3" json:"token,omitempty"`
}
```

## Hooks

The `erc20` module implements transaction hooks from the EVM in order to trigger token pair conversion.

### EVM Hooks

The EVM hooks allows users to convert ERC20s to Cosmos Coins by sending an Ethereum tx transfer
to the module account address. This enables native conversion of tokens via Metamask and EVM-enabled wallets
for both token pairs that have been registered through a native Cosmos coin or an ERC20 token.
Note that additional coin/token balance checks for sender and receiver to prevent malicious contract behaviour
(as performed in the [`ConvertERC20` msg](#state-transitions)) cannot be done here, as the balance prior
to the transaction is not available in the hook.

#### Registered Coin: ERC20 to Coin

1. User transfers ERC20 tokens to the `ModuleAccount` address to escrow them
2. Check if the ERC20 Token that was transferred from the sender is a native ERC20 or a native Cosmos Coin by looking at the
   [Ethereum event logs](https://medium.com/mycrypto/understanding-event-logs-on-the-ethereum-blockchain-f4ae7ba50378#:~:text=A%20log%20record%20can%20be,or%20a%20change%20of%20ownership.&text=Each%20log%20record%20consists%20of,going%20on%20in%20an%20event)
3. If the token contract address corresponds to the ERC20 representation of a native Cosmos Coin
   1. Call `burn()` ERC20 method from the `ModuleAccount`.
      Note that this is the same as 1.2, but since the tokens are already on the ModuleAccount balance,
      we burn the tokens from the module address instead of calling `burnFrom()`.
      Also note that we don't need to mint because [1.1 coin to erc20](#state-transitions) escrows the coin
   2. Transfer Cosmos Coin to the bech32 account address of the sender hex address

#### Registered ERC20: ERC20 to Coin

1. User transfers coins to the`ModuleAccount` to escrow them
2. Check if the ERC20 Token that was transferred is a native ERC20 or a native cosmos coin
3. If the token contract address is a native ERC20 token
   1. Mint Cosmos Coin
   2. Transfer Cosmos Coin to the bech32 account address of the sender hex

## Events

The `x/erc20` module emits the following events:

### Register Coin Proposal

| Type            | Attribute Key   | Attribute Value   |
| --------------- | --------------- | ----------------- |
| `register_coin` | `"cosmos_coin"` | `{denom}`         |
| `register_coin` | `"erc20_token"` | `{erc20_address}` |

### Register ERC20 Proposal

| Type             | Attribute Key   | Attribute Value   |
| ---------------- | --------------- | ----------------- |
| `register_erc20` | `"cosmos_coin"` | `{denom}`         |
| `register_erc20` | `"erc20_token"` | `{erc20_address}` |

### Toggle Token Conversion

| Type                      | Attribute Key   | Attribute Value   |
| ------------------------- | --------------- | ----------------- |
| `toggle_token_conversion` | `"erc20_token"` | `{erc20_address}` |
| `toggle_token_conversion` | `"cosmos_coin"` | `{denom}`         |

### Convert Coin

| Type           | Attribute Key   | Attribute Value              |
| -------------- | --------------- | ---------------------------- |
| `convert_coin` | `"sender"`      | `{msg.Sender}`               |
| `convert_coin` | `"receiver"`    | `{msg.Receiver}`             |
| `convert_coin` | `"amount"`      | `{msg.Coin.Amount.String()}` |
| `convert_coin` | `"cosmos_coin"` | `{denom}`                    |
| `convert_coin` | `"erc20_token"` | `{erc20_address}`            |

### Convert ERC20

| Type            | Attribute Key   | Attribute Value         |
| --------------- | --------------- | ----------------------- |
| `convert_erc20` | `"sender"`      | `{msg.Sender}`          |
| `convert_erc20` | `"receiver"`    | `{msg.Receiver}`        |
| `convert_erc20` | `"amount"`      | `{msg.Amount.String()}` |
| `convert_erc20` | `"cosmos_coin"` | `{denom}`               |
| `convert_erc20` | `"erc20_token"` | `{msg.ContractAddress}` |

## Parameters

The erc20 module contains the following parameters:

| Key             | Type | Default Value |
| --------------- | ---- | ------------- |
| `EnableErc20`   | bool | `true`        |
| `EnableEVMHook` | bool | `true`        |

### Enable ERC20

The `EnableErc20` parameter toggles all state transitions in the module.
When the parameter is disabled, it will prevent all token pair registration and conversion functionality.

### Enable EVM Hook

The `EnableEVMHook` parameter enables the EVM hook to convert an ERC20 token to a Cosmos Coin by transferring
the Tokens through a `MsgEthereumTx` to the `ModuleAddress` Ethereum address.

## Clients

### CLI

Find below a list of `haqqd` commands added with the `x/erc20` module.
You can obtain the full list by using the `haqqd -h` command.
A CLI command can look like this:

```bash
haqqd query erc20 params
```

#### Queries

| Command         | Subcommand    | Description                    |
| --------------- | ------------- | ------------------------------ |
| `query` `erc20` | `params`      | Get erc20 params               |
| `query` `erc20` | `token-pair`  | Get registered token pair      |
| `query` `erc20` | `token-pairs` | Get all registered token pairs |

#### Transactions

| Command      | Subcommand      | Description                    |
| ------------ | --------------- | ------------------------------ |
| `tx` `erc20` | `convert-coin`  | Convert a Cosmos Coin to ERC20 |
| `tx` `erc20` | `convert-erc20` | Convert a ERC20 to Cosmos Coin |

#### Proposals

The `tx gov submit-legacy-proposal` commands allow users to query create a proposal using the governance module CLI:

**`register-coin`**

Allows users to submit a `RegisterCoinProposal`.
Submit a proposal to register a Cosmos coin to the erc20 along with an initial deposit.
Upon passing, the proposal details must be supplied via a JSON file.

```bash
haqqd tx gov submit-legacy-proposal register-coin METADATA_FILE [flags]
```

Where METADATA_FILE contains (example):

```json
{
  "metadata": [
    {
      "description": "The native staking and governance token of the Osmosis chain",
      "denom_units": [
        {
          "denom": "ibc/<HASH>",
          "exponent": 0,
          "aliases": ["ibcuosmo"]
        },
        {
          "denom": "OSMO",
          "exponent": 6
        }
      ],
      "base": "ibc/<HASH>",
      "display": "OSMO",
      "name": "Osmo",
      "symbol": "OSMO"
    }
  ]
}
```

**`register-erc20`**

Allows users to submit a `RegisterERC20Proposal`. Submit a proposal to register ERC20 tokens along with an initial deposit.
To register multiple tokens in one proposal pass them after each other e.g. `register-erc20 <contract-address1> <contract-address2>`.

```bash
haqqd tx gov submit-legacy-proposal register-erc20 ERC20_ADDRESS... [flags]
```

**`toggle-token-conversion`**

Allows users to submit a `ToggleTokenConversionProposal`.

```bash
haqqd tx gov submit-legacy-proposal toggle-token-conversion TOKEN [flags]
```

**`param-change`**

Allows users to submit a `ParameterChangeProposal`.

```bash
haqqd tx gov submit-legacy-proposal param-change PROPOSAL_FILE [flags]
```

### gRPC

#### Queries

| Verb   | Method                            | Description                    |
| ------ | --------------------------------- | ------------------------------ |
| `gRPC` | `evmos.erc20.v1.Query/Params`     | Get erc20 params               |
| `gRPC` | `evmos.erc20.v1.Query/TokenPair`  | Get registered token pair      |
| `gRPC` | `evmos.erc20.v1.Query/TokenPairs` | Get all registered token pairs |
| `GET`  | `/evmos/erc20/v1/params`          | Get erc20 params               |
| `GET`  | `/evmos/erc20/v1/token_pair`      | Get registered token pair      |
| `GET`  | `/evmos/erc20/v1/token_pairs`     | Get all registered token pairs |

#### Transactions

| Verb   | Method                             | Description                    |
| ------ | ---------------------------------- | ------------------------------ |
| `gRPC` | `evmos.erc20.v1.Msg/ConvertCoin`   | Convert a Cosmos Coin to ERC20 |
| `gRPC` | `evmos.erc20.v1.Msg/ConvertERC20`  | Convert a ERC20 to Cosmos Coin |
| `GET`  | `/evmos/erc20/v1/tx/convert_coin`  | Convert a Cosmos Coin to ERC20 |
| `GET`  | `/evmos/erc20/v1/tx/convert_erc20` | Convert a ERC20 to Cosmos Coin |
