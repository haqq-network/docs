---
sidebar_position: 2
---

# Contract Addresses

This page contains a comprehensive list of all deployed contracts in both L1 and L2 networks of HAQQ with their addresses and explorer links. The contracts are based on [OP Stack v4.0.0](https://github.com/ethereum-optimism/optimism/releases/tag/op-contracts%2Fv4.0.0-rc.8) from the [Ethereum Optimism repository](https://github.com/ethereum-optimism/optimism) and deployed using [op-deployer v0.4.2](https://github.com/ethereum-optimism/optimism/releases/tag/op-deployer%2Fv0.4.2).

## L1 Sepolia Contracts

| Contract | Address | Description |
|----------|---------|-------------|
| **SuperchainConfig** | [0x7779c5b626bd93b444deee5296f1336c9a076a70](https://eth-sepolia.blockscout.com/address/0x7779c5b626bd93b444deee5296f1336c9a076a70) | Superchain configuration management |
| **ProtocolVersions** | [0x3d22989e9b049a073cb9f72cb3357367291508b6](https://eth-sepolia.blockscout.com/address/0x3d22989e9b049a073cb9f72cb3357367291508b6) | Protocol version management |
| **OptimismPortal2** | [0xcef83e2c029f1bdfefbfd4cb908ac333f420e209](https://eth-sepolia.blockscout.com/address/0xcef83e2c029f1bdfefbfd4cb908ac333f420e209) | Main portal for L1-L2 communication |
| **ETHLockbox** | [0xfe3123d5157b9d104e34cbf73a9171854244d218](https://eth-sepolia.blockscout.com/address/0xfe3123d5157b9d104e34cbf73a9171854244d218) | ETH lockbox for cross-chain transfers |
| **SystemConfig** | [0xda718df88b54460dd4834b29c01658dd976c9e09](https://eth-sepolia.blockscout.com/address/0xda718df88b54460dd4834b29c01658dd976c9e09) | System configuration parameters |
| **L1CrossDomainMessenger** | [0xf8d52efc21fe3db1c1d651ee03d19c5f5b83597f](https://eth-sepolia.blockscout.com/address/0xf8d52efc21fe3db1c1d651ee03d19c5f5b83597f) | L1 side of cross-domain messaging |
| **L1ERC721Bridge** | [0x67c74a530eab1f7b21adc441a836430a1ef792a9](https://eth-sepolia.blockscout.com/address/0x67c74a530eab1f7b21adc441a836430a1ef792a9) | L1 side of ERC721 bridge |
| **L1StandardBridge** | [0xe6260411feffbff8a38ad32484ea01cbf1658a0e](https://eth-sepolia.blockscout.com/address/0xe6260411feffbff8a38ad32484ea01cbf1658a0e) | L1 side of standard token bridge |
| **OptimismMintableERC20Factory** | [0x65df5d4aa6371f63aa4ec935ed93a99f097e4abd](https://eth-sepolia.blockscout.com/address/0x65df5d4aa6371f63aa4ec935ed93a99f097e4abd) | Factory for creating mintable ERC20 tokens |
| **DisputeGameFactory** | [0x1d15a66521bdb3043335734039d428f97bab3f7e](https://eth-sepolia.blockscout.com/address/0x1d15a66521bdb3043335734039d428f97bab3f7e) | Factory for creating dispute games |
| **AnchorStateRegistry** | [0xc7c945a172b36efc6b6165f4d70a5b93a9f109d9](https://eth-sepolia.blockscout.com/address/0xc7c945a172b36efc6b6165f4d70a5b93a9f109d9) | Registry for anchor states |
| **DelayedWETH** | [0x44c85f79783be56d7db48c060a9721a320fc57c7](https://eth-sepolia.blockscout.com/address/0x44c85f79783be56d7db48c060a9721a320fc57c7) | Delayed WETH for dispute resolution |

## L2 Testethiq Contracts (Sepolia)

| Contract | Address | Description |
|----------|---------|-------------|
| **L2ToL1MessagePasser** | [0x4200000000000000000000000000000000000016](https://explorer.testethiq.haqq.network/address/0x4200000000000000000000000000000000000016) | Passes messages from L2 to L1 |
| **L2CrossDomainMessenger** | [0x4200000000000000000000000000000000000007](https://explorer.testethiq.haqq.network/address/0x4200000000000000000000000000000000000007) | Cross-domain messenger for L1-L2 communication |
| **L2StandardBridge** | [0x4200000000000000000000000000000000000010](https://explorer.testethiq.haqq.network/address/0x4200000000000000000000000000000000000010) | Standard bridge for ERC20 tokens |
| **L2ERC721Bridge** | [0x4200000000000000000000000000000000000014](https://explorer.testethiq.haqq.network/address/0x4200000000000000000000000000000000000014) | Bridge for NFT tokens (ERC721) |
| **OptimismMintableERC20Factory** | [0x4200000000000000000000000000000000000012](https://explorer.testethiq.haqq.network/address/0x4200000000000000000000000000000000000012) | Factory for creating mintable ERC20 tokens |
| **OptimismMintableERC721Factory** | [0x4200000000000000000000000000000000000017](https://explorer.testethiq.haqq.network/address/0x4200000000000000000000000000000000000017) | Factory for creating mintable ERC721 tokens |
| **L1Block** | [0x4200000000000000000000000000000000000015](https://explorer.testethiq.haqq.network/address/0x4200000000000000000000000000000000000015) | L1 block information provider |
| **GasPriceOracle** | [0x420000000000000000000000000000000000000F](https://explorer.testethiq.haqq.network/address/0x420000000000000000000000000000000000000F) | Gas price oracle for L2 |
| **ProxyAdmin** | [0x4200000000000000000000000000000000000018](https://explorer.testethiq.haqq.network/address/0x4200000000000000000000000000000000000018) | Proxy contract administrator |
| **SequencerFeeVault** | [0x4200000000000000000000000000000000000011](https://explorer.testethiq.haqq.network/address/0x4200000000000000000000000000000000000011) | Sequencer fee collection vault |
| **BaseFeeVault** | [0x4200000000000000000000000000000000000019](https://explorer.testethiq.haqq.network/address/0x4200000000000000000000000000000000000019) | Base fee collection vault |
| **L1FeeVault** | [0x420000000000000000000000000000000000001A](https://explorer.testethiq.haqq.network/address/0x420000000000000000000000000000000000001A) | L1 fee collection vault |
| **SchemaRegistry** | [0x4200000000000000000000000000000000000020](https://explorer.testethiq.haqq.network/address/0x4200000000000000000000000000000000000020) | Schema registry for attestations |
| **EAS** | [0x4200000000000000000000000000000000000021](https://explorer.testethiq.haqq.network/address/0x4200000000000000000000000000000000000021) | Ethereum Attestation Service main contract |



## Useful Links

- [L2 Testethiq Explorer](https://explorer.testethiq.haqq.network/)
- [Ethereum Sepolia Explorer (Blockscout)](https://eth-sepolia.blockscout.com/)
- [L1 Network RPC](https://chainlist.org/chain/11155111)
- [HAQQ L2 Network Documentation](../../l2-network/)
- [Optimism Docs](https://docs.optimism.io/app-developers/get-started)
- [Development Guide](../../develop/)

## Notes

- All contract addresses are provided in checksum format
- L1 contracts are deployed on Ethereum Sepolia testnet
- L2 contracts are deployed on HAQQ L2 Testethiq (L2 base on L1 Sepolia) network
- Contracts are based on OP Stack v4.0.0 from [Ethereum Optimism](https://github.com/ethereum-optimism/optimism)
- Contracts were deployed using [op-deployer v0.4.2](https://github.com/ethereum-optimism/optimism/releases/tag/op-deployer%2Fv0.4.2)
- Contracts may be updated through the upgrade system
- Use the corresponding ABI from the project repository for contract interaction
