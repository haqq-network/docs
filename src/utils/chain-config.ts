import Swal from 'sweetalert2';

const MAINNET_ID = 'haqq_11235-1';
const TESTNET_ID = 'haqq_54211-3';
const HAQQ_COIN_DENOM = 'ISLM';
const HAQQ_COIN_MINIMAL_DENOM = 'aISLM';

type HAQQChainIds = typeof MAINNET_ID | typeof TESTNET_ID;

interface ChainConfig {
  chainId: HAQQChainIds;
  chainName: string;
  rpc: string;
  rest: string;
  features: string[];
  stakeCurrency: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
  };
  bech32Config: {
    bech32PrefixAccAddr: string;
    bech32PrefixAccPub: string;
    bech32PrefixValAddr: string;
    bech32PrefixValPub: string;
    bech32PrefixConsAddr: string;
    bech32PrefixConsPub: string;
  };
  currencies: Currency[];
  feeCurrencies: FeeCurrency[];
  bip44: {
    coinType: number;
  };
}

interface Currency {
  coinDenom: string;
  coinMinimalDenom: string;
  coinDecimals: number;
}

interface FeeCurrency extends Currency {
  gasPriceStep: {
    low: number;
    average: number;
    high: number;
  };
}

export const MainnetConfig: ChainConfig = {
  chainId: MAINNET_ID,
  chainName: 'HAQQ Mainnet',
  rpc: 'https://rpc.tm.haqq.network',
  rest: 'https://rest.cosmos.haqq.network',
  features: ['ibc-transfer', 'ibc-go', 'eth-address-gen', 'eth-key-sign'],
  stakeCurrency: {
    coinDenom: HAQQ_COIN_DENOM,
    coinMinimalDenom: HAQQ_COIN_MINIMAL_DENOM,
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
      coinDenom: HAQQ_COIN_DENOM,
      coinMinimalDenom: HAQQ_COIN_MINIMAL_DENOM,
      coinDecimals: 18,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: HAQQ_COIN_DENOM,
      coinMinimalDenom: HAQQ_COIN_MINIMAL_DENOM,
      coinDecimals: 18,
      gasPriceStep: {
        low: 20000000000,
        average: 25000000000,
        high: 40000000000,
      },
    },
  ],
  bip44: {
    coinType: 60,
  },
};

export const TestnetConfig: ChainConfig = {
  chainId: TESTNET_ID,
  chainName: 'HAQQ Testnet',
  rpc: 'https://rpc.tm.testedge2.haqq.network',
  rest: 'https://rest.cosmos.testedge2.haqq.network',
  features: ['ibc-transfer', 'ibc-go', 'eth-address-gen', 'eth-key-sign'],
  stakeCurrency: {
    coinDenom: HAQQ_COIN_DENOM,
    coinMinimalDenom: HAQQ_COIN_MINIMAL_DENOM,
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
      coinDenom: HAQQ_COIN_DENOM,
      coinMinimalDenom: HAQQ_COIN_MINIMAL_DENOM,
      coinDecimals: 18,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: HAQQ_COIN_DENOM,
      coinMinimalDenom: HAQQ_COIN_MINIMAL_DENOM,
      coinDecimals: 18,
      gasPriceStep: {
        low: 20000000000,
        average: 25000000000,
        high: 40000000000,
      },
    },
  ],
  bip44: {
    coinType: 60,
  },
};

export const handler = async (config: ChainConfig) => {
  if ((window as any).keplr) {
    try {
      await (window as any).keplr.enable(config.chainId);
      Swal.fire({
        title: 'Note',
        text: `Testnet ${config.chainId} has already added`,
        icon: 'info',
        confirmButtonText: 'Awesome',
      });
    } catch (e) {
      try {
        await (window as any).keplr.experimentalSuggestChain(config);
        await (window as any).keplr.enable(config.chainId);
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
