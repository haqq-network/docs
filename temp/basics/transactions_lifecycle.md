---
sidebar_position: 3
---

# Transaction Lifecycle

This document describes the lifecycle of a transaction from creation to committed state changes on the EVM. {synopsis}

## Pre-requisite Readings

- [SDK transaction lifecycle](https://docs.cosmos.network/master/basics/tx-lifecycle.html) {prereq}

<!-- TODO: rewrite. This is not a lifecycle doc -->

## Routing

Haqq needs to parse and handle transactions routed for both the EVM and for Cosmos SDK modules. We
attempt to achieve this by mimicking [geth's](https://github.com/ethereum/go-ethereum) `Transaction`
structure and treat it as a unique Cosmos SDK message type. An Ethereum transaction is a single
[`sdk.Msg`](https://godoc.org/github.com/cosmos/cosmos-sdk/types#Msg). All relevant Ethereum
transaction information is contained in this message. This includes the signature, gas, payload,
amount, etc.

Being that Haqq implements the Tendermint ABCI application interface, as transactions are
consumed, they are passed through a series of handlers. Once such handler, the `AnteHandler`, is
responsible for performing preliminary message execution business logic such as fee payment,
signature verification, etc. This is particular to Cosmos SDK routed transactions. Ethereum routed
transactions will bypass this as the EVM handles the same business logic.

All EVM transactions are [RLP](./../core/encoding.md#rlp) encoded using a custom tx encoder.

## Signers

The signature processing and verification in Ethereum is performed by the `Signer` interface. The
protocol supports different signer types based on the chain configuration params and the block number.

```bash
// Signer encapsulates transaction signature handling. The name of this type is slightly
// misleading because Signers don't actually sign, they're just for validating and
// processing of signatures.
//
// Note that this interface is not a stable API and may change at any time to accommodate
// new protocol rules.
type Signer interface {
	// Sender returns the sender address of the transaction.
	Sender(tx *Transaction) (common.Address, error)

	// SignatureValues returns the raw R, S, V values corresponding to the
	// given signature.
	SignatureValues(tx *Transaction, sig []byte) (r, s, v *big.Int, err error)
	ChainID() *big.Int

	// Hash returns 'signature hash', i.e. the transaction hash that is signed by the
	// private key. This hash does not uniquely identify the transaction.
	Hash(tx *Transaction) common.Hash

	// Equal returns true if the given signer is the same as the receiver.
	Equal(Signer) bool
}
```

Haqq supports all Ethereum `Signer`s up to the latest go-ethereum version (London, Berlin,
EIP155, Homestead and Frontier). The chain will generate the latest `Signer` type depending on the
`ChainConfig`.
