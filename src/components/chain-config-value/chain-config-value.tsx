import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { MainnetConfig, TestnetConfig } from '@site/src/utils/chain-config';

export function ChainConfigValue({ chain, keyword }: { chain: string, keyword: string }) {
  switch (chain) {
    case 'main':
      return MainnetConfig[keyword] ? <span>{MainnetConfig[keyword]}</span> : null;
    case 'test':
      return TestnetConfig[keyword] ? <span>{TestnetConfig[keyword]}</span> : null;
    default:
      return null;
  }
}
