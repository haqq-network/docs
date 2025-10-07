// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.vsDark;

function defineSection(section, options = {}) {
  return [
    '@docusaurus/plugin-content-docs',
    /** @type {import('@docusaurus/plugin-content-docs').Options} */
    ({
      path: `docs/${section}`,
      routeBasePath: section,
      id: section,
      sidebarPath: require.resolve('./sidebars.js'),
      breadcrumbs: true,
      editUrl: 'https://github.com/haqq-network/docs/tree/master/',
      ...options,
    }),
  ];
}

const SECTIONS = [
  defineSection('learn'),
  defineSection('develop'),
  defineSection('user-guides'),
  defineSection('l1-network'),
  defineSection('l2-network'),
];

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'HAQQ Documentation',
  tagline:
    'HAQQ is a scalable and interoperable Ethereum, built on Proof-of-Stake with fast-finality.',
  url: 'https://docs.haqq.network',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  trailingSlash: true,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  customFields: {
    project: {
      name: 'HAQQ Network',
      short_name: 'HAQQ',
      denom: 'ISLM',
      ticker: 'ISLM',
      binary: 'haqqd',
      testnet_denom: 'ISLM',
      testnet_ticker: 'ISLM',
      rpc_url: 'https://rpc.eth.haqq.network',
      rpc_url_testnet: 'https://rpc.eth.testedge2.haqq.network',
      rpc_url_local: 'http://localhost:8545/',
      chain_id: '11235',
      testnet_chain_id: '54211',
      // version_number: '2',
      // testnet_version_number: '4',
      // testnet_evm_explorer_url: 'https://evm.evmos.dev',
      // evm_explorer_url: 'https://escan.live',
      // testnet_cosmos_explorer_url: 'https://testnet.mintscan.io/evmos-testnet',
      // cosmos_explorer_url: 'https://www.mintscan.io/evmos',
      latest_version: 'v1.8.5',
      mainnet_version: 'v1.8.5',
      testnet_version: 'v1.8.5',
      block_explorer_url: 'https://explorer.haqq.network',
      eth_name: 'Main Ethereum Network',
      unbonding_period: '21 days',
      active_set: '150',
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        // NOTE: Docs enabled separate in plugins section
        docs: {
          path: 'docs/home',
          // routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          breadcrumbs: true,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          lastmod: 'datetime',
          changefreq: 'weekly',
          priority: 0.5,
        },
      }),
    ],
  ],
  plugins: [
    ...SECTIONS,
    [
      'posthog-docusaurus',
      {
        apiKey: 'phc_S8yvZufvPSBgyfXwjP2nIzndGES4HV8i0yOxMecUkLE',
        appUrl: 'https://eu.posthog.com',
        enableInDevelopment: false,
      },
    ],
    async function tailwindPlugin() {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(require('tailwindcss'));
          postcssOptions.plugins.push(require('autoprefixer'));
          return postcssOptions;
        },
      };
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        {
          name: 'keywords',
          content:
            'HAQQ, blockchain, ethereum, proof of stake, validator, documentation, islamic blockchain',
        },
        {
          name: 'description',
          content:
            'HAQQ is a scalable and interoperable Ethereum blockchain, built on Proof-of-Stake with fast-finality. Explore our comprehensive documentation.',
        },
        {
          property: 'og:title',
          content:
            'HAQQ Network Documentation - Ethereum Compatible Blockchain Platform',
        },
        {
          property: 'og:description',
          content:
            'HAQQ is a scalable and interoperable Ethereum blockchain, built on Proof-of-Stake with fast-finality. Explore our comprehensive documentation.',
        },
        {
          name: 'sitemap',
          content: '/sitemap.xml',
        },
      ],
      // Replace with your project's social card
      // image: 'img/haqq-social-card.jpg',
      navbar: {
        title: '',
        logo: {
          alt: 'HAQQ Network',
          src: 'img/haqq-logo.svg',
          srcDark: 'img/haqq-logo-white.svg',
        },
        items: [
          {
            href: '/learn',
            position: 'left',
            label: 'Learn',
          },
          {
            href: '/l1-network',
            position: 'left',
            label: 'L1 Network',
          },
          {
            href: '/develop',
            position: 'left',
            label: 'Develop',
          },
          {
            href: '/user-guides',
            position: 'left',
            label: 'User Guides',
          },
          {
            href: '/l2-network',
            position: 'left',
            label: 'L2 Network',
          },
          {
            href: 'https://github.com/haqq-network/haqq',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        links: [
          {
            title: 'Docs',
            items: [
              {
                href: '/learn',

                label: 'Learn',
              },
              {
                href: '/l1-network',

                label: 'L1 Network',
              },
              {
                href: '/develop',

                label: 'Develop',
              },
              {
                href: '/user-guides',

                label: 'User Guides',
              },
              {
                href: '/l2-network',

                label: 'L2 Network',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'HAQQ Network Discord',
                href: 'https://discord.gg/CDtXuQG3Vd',
              },
              {
                label: 'Islamic Coin Discord',
                href: 'https://discord.gg/islamiccoin',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/The_HaqqNetwork',
              },
              {
                href: 'https://github.com/haqq-network/haqq',
                label: 'GitHub',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} HAQQ Network`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: [
          'powershell',
          'shell-session',
          'bash',
          'solidity',
          'typescript',
          'toml',
          'yaml',
          'json',
        ],
      },
      algolia: {
        appId: 'T5OEVED57K',
        apiKey: '33a0821aee656a275399c5151aa06a9e',
        indexName: 'docusaurus',
        contextualSearch: true,
        searchParameters: {},
      },
    }),
};

module.exports = config;
