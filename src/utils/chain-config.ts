import Swal from 'sweetalert2';

export const chainConfig = {
  stakeCurrency: {
    coinDenom: 'Islamic Coin',
    coinMinimalDenom: 'ISLM',
    coinDecimals: 18,
  },
  bech32Config: {
    bech32PrefixAccAddr: 'evmos',
    bech32PrefixAccPub: 'evmospub',
    bech32PrefixValAddr: 'evmosvaloper',
    bech32PrefixValPub: 'evmosvaloperpub',
    bech32PrefixConsAddr: 'evmosvalcons',
    bech32PrefixConsPub: 'evmosvalconspub',
  },
  currencies: [
    {
      coinDenom: 'Islamic Coin',
      coinMinimalDenom: 'ISLM',
      coinDecimals: 18,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'Islamic Coin',
      coinMinimalDenom: 'ISLM',
      coinDecimals: 18,
      gasPriceStep: {
        low: 25000000000,
        average: 25000000000,
        high: 40000000000,
      },
    },
  ],
  bip44: {
    coinType: 60,
  },
  chainId: 'evmos_9000-4',
  chainName: 'Evmos Testnet',
  rpc: 'https://tendermint.bd.evmos.dev:26657',
  rest: 'https://rest.bd.evmos.dev:1317',
  beta: true,
  features: ['ibc-transfer', 'ibc-go', 'eth-address-gen', 'eth-key-sign'],
};

export const handler = async () => {
  if ((window as any).keplr) {
    try {
      await (window as any).keplr.enable(chainConfig.chainId);
      Swal.fire({
        title: 'Note',
        text: `Testnet ${chainConfig.chainId} has already added`,
        icon: 'info',
        confirmButtonText: 'Awesome',
      });
    } catch (e) {
      try {
        await (window as any).keplr.experimentalSuggestChain(chainConfig);
        await (window as any).keplr.enable(chainConfig.chainId);
      } catch (e2) {
        Swal.fire({
          title: 'Error',
          text: e2?.message,
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
    }
  } else {
    Swal.fire({
      title: 'Error',
      text: 'Keplr Wallet Extension could not be found. Please check browser compatibility or try again later.',
      icon: 'error',
      confirmButtonText: 'Ok',
    });
  }
};
