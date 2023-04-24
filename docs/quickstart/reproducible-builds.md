---
sidebar_position: 5
---

# Deterministic builds

🚧 `In developing...` 🏗

## Introduction

The [Tendermint rbuilder Docker image](https://github.com/tendermint/images/tree/master/rbuilder) provides a deterministic build environment that is used to build Cosmos SDK applications. It provides a way to be reasonably sure that the executables are really built from the git source. It also makes sure that the same, tested dependencies are used and statically built into the executable.

:::tip
All the following instructions have been tested on _Ubuntu 18.04.2 LTS_ with _Docker 20.10.2_.
:::

## Build with Docker

Docker build instructions available [here](https://hub.docker.com/r/alhaqq/haqq)
