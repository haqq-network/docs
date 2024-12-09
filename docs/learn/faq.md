---
sidebar_position: 7
---

# Frequently Asked Questions

## Wallets

<details>

<summary><b>Which wallet would you recommend for HAQQ?</b></summary>
We recommend using the HAQQ Wallet for your HAQQ Network transactions. 
It`s a mobile wallet specifically designed to work seamlessly with the HAQQ Network, enhancing your experience and ensuring secure transactions. 

You can download the HAQQ Wallet from our official website: [HAQQ Wallet](https://haqq.network/wallet/)

However, we understand the importance of flexibility and the varying needs of our users. Hence, if you prefer, you can also use [Metamask](https://metamask.io/) and [Keplr](https://www.keplr.app/) wallets with the HAQQ Network. We recommend making a choice based on your specific needs and comfort level with these platforms. As always, ensure the security of your digital assets by only using trusted wallets and keeping your private keys confidential.

</details>

<details>

<summary><b>Can I use my Ledger device?</b></summary>

Absolutely! Take a look at the [Ledger](../../user-guides/connect-your-wallet/Keplr) for more information. HAQQ Wallet, Metamask,
and Keplr all work with Ledger. Ledger setup will be required before engaging with the dApps and products on HAQQ.

</details>

<details>

<summary><b>For certain wallets, I see both bech32 and hex while others only show hex formatted addresses, which should
 I use?</b></summary>

The HAQQ Network supports both formats: bech32 and hex. Other EVM peers and its ecosystem uses hex encoding while
Cosmos-native uses bech32 formatted addresses. Keplr is unique and the EVM-compatible chains shows both formats. If you
are sending tokens (via IBC), you will use bech32 formatted addresses unless
the receiving chain support EVM (i.e. Ethermint-based chains).

</details>


## EVM compatibility.

<details>
<summary><b>Is HAQQ compatible with EVM?</b></summary>

HAQQ Network is fully compatible with the EVM version Paris. (Solidity 8.19).

Unfortunately, now we do not support the functionality of the account is abstract. (EIP-4337).
</details>

<details>
<summary><b>Can i deploy the contract written in solidity directly in the chain？</b></summary>

**Yes, you can** - HAQQ Network is fully compatible with the EVM version Paris. (Solidity 8.19).
</details>

<details>
<summary><b>What is the HD Path on the HAQQ network？</b></summary>
HAQQ HD path is **m/44'/60'/0'/0.** HAQQ Netowrk use Coin type 60 to support Ethereum type accounts. 
</details>

## Network details.

<details>
<summary><b>What is the block size?</b></summary>

Each block on HAQQ Network has a maxium block size is **40.000.000 GAS**
</details>

<details>
<summary><b>What is the block time?</b></summary>

On HAQQ Network the block time is within **5.6 - 6.2 seconds.**
</details>

<details>
<summary><b>What is Time to Finality (TTF)?</b></summary>

HAQQ has instant Time to Finality (TTF)  ** -6 sec, 1 block.** Because as a consensus mechanism HAQQ is CometBFT (formerly Tendermint).
</details>
