---
sidebar_position: 3
---

# Module Accounts

Some modules have their own module account. Think of this as a wallet that can only be controlled by that module. 
Below is a table of modules, their respective wallet addresses and permissions:

## List of Module Accounts

| Name                     | Address                                                                                                                  | Permissions        |
|:-------------------------|:-------------------------------------------------------------------------------------------------------------------------|:-------------------|
| `coinomics`              | [haqq13lmzrazlsjzca7ugqtpwe6xyy3553ghlh5hupc](https://ping.pub/haqq/account/haqq13lmzrazlsjzca7ugqtpwe6xyy3553ghlh5hupc) | `minter`           |
| `distribution`           | [haqq1jv65s3grqf6v6jl3dp4t6c9t9rk99cd89c30hf](https://ping.pub/haqq/account/haqq1jv65s3grqf6v6jl3dp4t6c9t9rk99cd89c30hf) | `none`             |
| `erc20`                  | [haqq1glht96kr2rseywuvhhay894qw7ekuc4qgrxfhs](https://ping.pub/haqq/account/haqq1glht96kr2rseywuvhhay894qw7ekuc4qgrxfhs) | `minter` `burner`  |
| `evm`                    | [haqq1vqu8rska6swzdmnhf90zuv0xmelej4lq04s827](https://ping.pub/haqq/account/haqq1vqu8rska6swzdmnhf90zuv0xmelej4lq04s827) | `minter` `burner`  |
| `fee_collector`          | [haqq17xpfvakm2amg962yls6f84z3kell8c5lj7kn4t](https://ping.pub/haqq/account/haqq17xpfvakm2amg962yls6f84z3kell8c5lj7kn4t) | `none`             |
| `gov`                    | [haqq10d07y265gmmuvt4z0w9aw880jnsr700jc9xkg9](https://ping.pub/haqq/account/haqq10d07y265gmmuvt4z0w9aw880jnsr700jc9xkg9) | `burner`           |
| `bonded_tokens_pool`     | [haqq1fl48vsnmsdzcv85q5d2q4z5ajdha8yu3huuu8p](https://ping.pub/haqq/account/haqq1fl48vsnmsdzcv85q5d2q4z5ajdha8yu3huuu8p) | `burner` `staking` |
| `not_bonded_tokens_pool` | [haqq1tygms3xhhs3yv487phx3dw4a95jn7t7lruqd34](https://ping.pub/haqq/account/haqq1tygms3xhhs3yv487phx3dw4a95jn7t7lruqd34) | `burner` `staking` |
| `transfer`               | [haqq1yl6hdjhmkf37639730gffanpzndzdpmhvcr6f4](https://ping.pub/haqq/account/haqq1yl6hdjhmkf37639730gffanpzndzdpmhvcr6f4) | `minter` `burner`  |
| `liquidvesting`          | [haqq102lq49sg6lmw2e0mw740tjldzq68v0yfylw05s](https://ping.pub/haqq/account/haqq102lq49sg6lmw2e0mw740tjldzq68v0yfylw05s) | `minter` `burner`  |


## Account Permissions

* The `burner` permission means this account has the permission to burn or destroy tokens.
* The `minter` permission means this account has permission to mint or create new tokens.
* The `staking` permission means this account has permission to stake tokens on behalf of its owner.