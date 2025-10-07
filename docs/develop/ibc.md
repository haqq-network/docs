---
sidebar_position: 9
title: Open IBC Channels
---

# Open IBC Channels

The [Inter-Blockchain Communication Protocol (IBC)](https://www.ibcprotocol.dev) is a protocol to handle authentication and transport of data between two blockchains

You can read more about IBC - [here](/l1-network/modules/ibc/)

## Mainnet - short form

| Network  | Channel from HAQQ | Network | Channel to HAQQ|
| --- | -------- | -------- | -------- |
| HAQQ    | channel-0     | GRAVITY     | channel-100     |
| HAQQ    | channel-1     | AXELAR     | channel-113     |
| HAQQ    | channel-2     | OSMOSIS   |  channel-1575    |
| HAQQ    | channel-3     | COSMOSHUB   | channel-632   |
| HAQQ    | channel-4     |  NOBLE    | channel-32     |
| HAQQ    | channel-6     |  KAVA    |  channel-135    |


## Mainnet - FULL PATH

| From Network | To Network  | FULL PATH |
| --- | --- | -------- |
|  HAQQ | GRAVITY | 07-tendermint-0 - > connection-0 - > channel-0 |
|  GRAVITY | HAQQ | 07-tendermint-192  - > connection-163 - > channel-100 |
|  |  |  |
| HAQQ | AXELAR |  07-tendermint-1 - > connection-1 - > channel-1 |
|  AXELAR | HAQQ |  07-tendermint-162  - > connection-148  - > channel-113  |
|  |  |  |
| HAQQ |  OSMOSIS | 07-tendermint-3 - > connection-2 - > channel-2 
| OSMOSIS | HAQQ | 07-tendermint-2871 - > connection-2388 - > channel-1575 |
|  |  |  |
|  HAQQ | COSMOSHUB |  07-tendermint-2 - > connection-3 - > channel-3  |
|  COSMOSHUB | HAQQ |  07-tendermint-1153 - > connection-874 - > channel-632 |
|  |  |  |
| HAQQ  |  NOBLE | 07-tendermint-4 - > connection-4 - > channel-4  |
|  NOBLE | HAQQ | 07-tendermint-58 - > connection-56 - > channel-32  | 
|  |  |  |
| HAQQ  |  KAVA | 07-tendermint-5 - > connection-7 - > channel-6 | 
| KAVA | HAQQ | 07-tendermint-149 - > connection-193 - > channel-135 |

## TestEdge2 - short form

| Network  | Channel from HAQQ | Network | Channel to HAQQ|
| --- | -------- | -------- | -------- |
| HAQQ TestEdge2 | channel-4 | AXELAR TESTNET LISBON     | channel-304    |
| HAQQ TestEdge2 | channel-0 | GRAVITY     | channel-94    |


## TestEdge2 - FULL PATH

| From Network | To Network  | FULL PATH |
| ------------ | ----------- | --------- |
| HAQQ TestEdge2 | GRAVITY |   07-tendermint-1 - >   connection-0 - > channel-0  | 
| GRAVITY | HAQQ TestEdge2 | 07-tendermint-181 - > connection-156 - > channel-94 |
|  |  |  |
| HAQQ TestEdge2 | AXELAR TESTNET LISBON |  07-tendermint-13 - >  connection-13 - > channel-4   |
| AXELAR TESTNET LISBON | HAQQ TestEdge2 | 07-tendermint-602 - > connection-602 - > channel-304 |
