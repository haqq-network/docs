---
sidebar_position: 9
title: Open IBC Channels
---

# Open IBC Channels

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

| Network  | FULL PATH |
| --- | -------- |
|  GRAVITY | HAQQ 07-tendermint-0 - > connection-0 - > channel-0 < - > channel-100 < - connection-163 < - GRAVITY 07-tendermint-192 |
|  AXELAR | HAQQ 07-tendermint-1 - > connection-1 - > channel-1 < - > channel-113 < - connection-148 < - AXELAR 07-tendermint-162 |
|  OSMOSIS |HAQQ 07-tendermint-3 - > connection-2 - > channel-2 < - > channel-1575 < - connection-2388 < - OSMOSIS 07-tendermint-2871 |
|  COSMOSHUB | HAQQ 07-tendermint-2 - > connection-3 - > channel-3 < - > channel-632 < - connection-874 < - COSMOSHUB 07-tendermint-1153 |
|  NOBLE | HAQQ 07-tendermint-4 - > connection-4 - > channel-4 < - > channel-32 < - connection-56 < - NOBLE 07-tendermint-58 |
| KAVA | HAQQ 07-tendermint-5 - > connection-7 - > channel-6 < - > channel-135 < - connection-193 < - KAVA 07-tendermint-149 |

## TestEdge2 - short form

| Network  | Channel from HAQQ | Network | Channel to HAQQ|
| --- | -------- | -------- | -------- |
| HAQQ TestEdge2     | channel-3     | AXELAR TESTNET LISBON     | channel-230    |


## TestEdge2 - FULL PATH


| Network  | FULL PATH |
| --- | -------- |
|  GRAVITY | HAQQ TestEdge2  07-tendermint-12 - > connection-11 - > channel-3 < - > channel-230 < - connection-334 < - AXELAR TESTNET LISBON 07-tendermint-253 |
