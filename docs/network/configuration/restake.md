---
sidebar_position: 8
---

# ReStake Config

:::note
Learn about ReStake on [restake.app](https://restake.app) and [github](https://github.com/eco-stake/restake)
:::

## About REStake

> REStake allows delegators to grant permission for a validator to compound their rewards, and provides a script validators can run to find their granted delegators and send the compounding transactions automatically.
>
> REStake is also a convenient staking tool, allowing you to claim and compound your rewards individually or in bulk. This can save transaction fees and time, and many more features are planned.

REStake allows users to automatically stack rewards received on stacking back to the validator - this allows users to invest in stacking as an asset with compound interest, and validators not only increase their attractiveness in the eyes of the user, but also to increase the number of stacked tokens on a regular basis

## Setup local

:::info
We recommend running ReStake on a separate machine not associated with the validator.
:::

### 1. Download the repository, and prepare environment variables.

```bash
git clone https://github.com/eco-stake/restake
cd restake
cp .env.sample .env
nano .env
```

:::warning
Categorically **DO NOT** use the validator mnemonic for the ReStake operator
:::
:::info
We recommend creating a new mnemonic, and transferring a small balance in ISLM to it
:::

In environment variables - instert your mnemonic - MNEMONIC=my hot wallet seed words here that has minimal funds

Since the HAQQ network is still in experimental mode at the moment - you need to write your config, and specify the path to it in your environment variables.
NETWORKS_OVERRIDE_PATH=src/networks.local.json

An example of the contents of the .env file.

```environment
MNEMONIC=my hot wallet seed words here that has minimal funds
NETWORKS_OVERRIDE_PATH=src/networks.local.json
```

### 2. Add HAQQ Config

Open/Create networks.local.json

```bash
cd src
nano networks.local.json
```

Write your config:

- ownerAddress - address your validator in haqqvaloper..... format.
- healthCheck - your id from [healthchecks](https://healthchecks.io)
- restUrl - haqq node rest url.

```
{
  "haqq": {
    "prettyName": "haqq",
    "restUrl": [
      "https://sdk.haqq.sh"
    ],
    "ownerAddress": "haqqvaloper.....",
    "default": true,
    "gasPrice": "27500000000aISLM",
    "healthCheck": {
      "uuid": "e249642f-....-386457dbba2c"
    }
  }
}
```

### 3. Create container

```bash
git pull
docker compose run --rm app npm install
docker compose build --no-cache
```

### 4. Setup Cron

```bash
crontab -e
```

Add new cron task

```
0 */1 * * * /bin/bash -c "cd /...yourpath.../restake && docker compose run --rm app npm run autostake haqq" > ./restake.log 2>&1
```

## Add your validator to ReStake App

### 1. Create your fork

FORK - https://github.com/eco-stake/validator-registry

### 2. Add your validator

```bash
cd validator-registry
mkdir your_validator
```

### 3. Create your chains.json

```bash
nano chains.json
```

```
{
  "$schema": "../chains.schema.json",
  "name": "Your validator name",
  "chains": [
    {
      "name": "haqq",
      "address": "haqqvaloper.....",
      "restake": {
        "address": "haqq1....",
        "run_time": "every 1 hour",
        "minimum_reward": 1000000000000000000
      }
    }
  ]
}
```

### 4. Create your profile.json

```bash
nano profile.json
```

```
{
  "$schema": "../profile.schema.json",
  "name": "Your validator name",
  "identity": "YourID"
}
```

### 5. Create your services.json

```bash
nano services.json
```

```
{
  "$schema": "../services.schema.json",
  "name": "Your validator name",
  "services": [
    {
      "title": "Your validator name",
      "description": "Join us.",
      "url": "https://"
    }
  ]
}
```
