import Swal from 'sweetalert2';

export const chainConfig = {
  stakeCurrency: {
    coinDenom: 'ISLM',
    coinMinimalDenom: 'aISLM',
    coinDecimals: 18,
  },
  bech32Config: {
    bech32PrefixAccAddr: 'haqq',
    bech32PrefixAccPub: 'haqq' + 'pub',
    bech32PrefixValAddr: 'haqq' + 'valoper',
    bech32PrefixValPub: 'haqq' + 'valoperpub',
    bech32PrefixConsAddr: 'haqq' + 'valcons',
    bech32PrefixConsPub: 'haqq' + 'valconspub',
  },
  currencies: [
    {
      coinDenom: 'ISLM',
      coinMinimalDenom: 'aISLM',
      coinDecimals: 18,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'ISLM',
      coinMinimalDenom: 'aISLM',
      coinDecimals: 18,
      gasPriceStep: {
        low: 10000000000,
        average: 25000000000,
        high: 40000000000,
      },
    },
  ],
  bip44: {
    coinType: 60,
  },
  chainId: 'haqq_11235-1',
  chainName: 'Haqq Network',
  rpc: 'https://rpc.tm.haqq.network',
  rest: 'https://rest.cosmos.haqq.network',
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
