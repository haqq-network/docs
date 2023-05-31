// // @ts-check
// // Note: type annotations allow type checking and IDEs autocompletion

// const lightCodeTheme = require('prism-react-renderer/themes/vsLight');
// const darkCodeTheme = require('prism-react-renderer/themes/vsDark');

// function defineSection(section, options = {}) {
//   return [
//     '@docusaurus/plugin-content-docs',
//     /** @type {import('@docusaurus/plugin-content-docs').Options} */
//     ({
//       path: `docs/${section}`,
//       routeBasePath: section,
//       id: section,
//       sidebarPath: require.resolve('./sidebars.ts'),
//       breadcrumbs: true,
//       editUrl: 'https://github.com/haqq-network/docs/tree/master',
//       ...options,
//     }),
//   ];
// }

// const SECTIONS = [
//   defineSection('intro'),
//   defineSection('validators'),
//   defineSection('develop'),
//   defineSection('explorers'),
// ];

// /** @type {import('@docusaurus/types').Config} */
// const config = {
//   title: 'HAQQ Docs',
//   tagline:
//     'Haqq is a scalable and interoperable Ethereum, built on Proof-of-Stake with fast-finality. Islamic Coin (ISLM) is a native currency of Haqq.',
//   favicon: 'img/favicon.ico',

//   // Set the production url of your site here
//   url: 'https://docs.haqq.network/',
//   // Set the /<baseUrl>/ pathname under which your site is served
//   // For GitHub pages deployment, it is often '/<projectName>/'
//   baseUrl: '/',

//   // GitHub pages deployment config.
//   // If you aren't using GitHub pages, you don't need these.
//   organizationName: 'HAQQ-network', // Usually your GitHub org/user name.
//   projectName: 'docs', // Usually your repo name.

//   onBrokenLinks: 'throw',
//   onBrokenMarkdownLinks: 'warn',

//   // Even if you don't use internalization, you can use this field to set useful
//   // metadata like html lang. For example, if your site is Chinese, you may want
//   // to replace "en" with "zh-Hans".
//   i18n: {
//     defaultLocale: 'en',
//     locales: ['en'],
//   },

//   presets: [
//     [
//       'classic',
//       /** @type {import('@docusaurus/preset-classic').Options} */
//       ({
//         path: 'docs/home',
//         docs: {
//           sidebarPath: require.resolve('./sidebars.ts'),
//           // Please change this to your repo.
//           // Remove this to remove the "edit this page" links.
//           // editUrl:
//           // 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
//         },
//         blog: false,
//         theme: {
//           customCss: require.resolve('./src/css/custom.css'),
//         },
//       }),
//     ],
//   ],

//   plugins: [...SECTIONS],

//   themeConfig:
//     /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
//     ({
//       // Replace with your project's social card
//       image: 'img/docusaurus-social-card.jpg',
//       navbar: {
//         title: '',
//         logo: {
//           alt: 'HAQQ Network',
//           src: 'img/haqq-logo.svg',
//           srcDark: 'img/haqq-logo-white.svg',
//         },
//         items: [
//           {
//             href: '/intro',
//             position: 'left',
//             label: 'Intro',
//           },
//           {
//             href: '/validators',
//             position: 'left',
//             label: 'Validators',
//           },
//           {
//             href: '/develop',
//             position: 'left',
//             label: 'Develop',
//           },
//           {
//             href: '/explorers',
//             position: 'left',
//             label: 'Explorers',
//           },
//           {
//             href: 'https://github.com/haqq-network/haqq',
//             label: 'GitHub',
//             position: 'right',
//           },
//         ],
//       },
//       footer: {
//         links: [
//           {
//             title: 'Docs',
//             items: [
//               {
//                 label: 'Intro',
//                 to: '/intro',
//               },
//             ],
//           },
//           {
//             title: 'Community',
//             items: [
//               {
//                 label: 'Stack Overflow',
//                 href: 'https://stackoverflow.com/questions/tagged/docusaurus',
//               },
//               {
//                 label: 'Discord',
//                 href: 'https://discordapp.com/invite/docusaurus',
//               },
//               {
//                 label: 'Twitter',
//                 href: 'https://twitter.com/docusaurus',
//               },
//             ],
//           },
//           // {
//           //   title: "More",
//           //   items: [
//           //     {
//           //       label: "Blog",
//           //       to: "/blog",
//           //     },
//           //     {
//           //       label: "GitHub",
//           //       href: "https://github.com/facebook/docusaurus",
//           //     },
//           //   ],
//           // },
//         ],
//         copyright: `Copyright © ${new Date().getFullYear()} HAQQ Network`,
//       },
//       prism: {
//         theme: lightCodeTheme,
//         darkTheme: darkCodeTheme,
//       },
//       algolia: {
//         appId: 'T5OEVED57K',
//         apiKey: '12309afa621f617e25de57d1503d5ff3',
//         indexName: 'my_first_index',
//         contextualSearch: true,
//         searchPagePath: 'search',
//       },
//     }),
// };

// module.exports = config;

// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/vsDark');

function defineSection(section, options = {}) {
  return [
    '@docusaurus/plugin-content-docs',
    /** @type {import('@docusaurus/plugin-content-docs').Options} */
    ({
      path: `docs/${section}`,
      routeBasePath: section,
      id: section,
      sidebarPath: require.resolve('./sidebars.ts'),
      breadcrumbs: true,
      editUrl: 'https://github.com/evmos/docs/tree/main/',
      ...options,
    }),
  ];
}

const SECTIONS = [
  defineSection('intro'),
  defineSection('validators'),
  defineSection('develop'),
  defineSection('explorers'),
];

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Evmos Docs',
  tagline: 'Develop on Evmos',
  url: 'https://docs.evmos.org',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'evmos', // Usually your GitHub org/user name.
  projectName: 'Docs', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  customFields: {
    project: {
      name: 'Evmos',
      denom: 'Evmos',
      ticker: 'EVMOS',
      binary: 'evmosd',
      testnet_denom: 'tEvmos',
      testnet_ticker: 'tEVMOS',
      rpc_url: 'https://eth.bd.evmos.org:8545',
      rpc_url_testnet: 'https://eth.bd.evmos.dev:8545',
      rpc_url_local: 'http://localhost:8545/',
      chain_id: '9001',
      testnet_chain_id: '9000',
      latest_version: 'v11.0.1',
      mainnet_version: 'v11.0.1',
      testnet_version: 'v11.0.1',
      version_number: '2',
      testnet_version_number: '4',
      testnet_evm_explorer_url: 'https://evm.evmos.dev',
      evm_explorer_url: 'https://escan.live',
      testnet_cosmos_explorer_url: 'https://testnet.mintscan.io/evmos-testnet',
      cosmos_explorer_url: 'https://www.mintscan.io/evmos',
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs/home',
          // routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.ts'),
          breadcrumbs: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'G-3JSJBBPS3L',
          anonymizeIP: false,
        },
      }),
    ],
  ],
  plugins: [
    ...SECTIONS,
    // [
    //   '@docusaurus/plugin-ideal-image',
    //   {
    //     quality: 80,
    //     max: 1030, // max resized image's size.
    //     min: 640, // min resized image's size. if original is lower, use that size.
    //     steps: 2, // the max number of images generated between min and max (inclusive)
    //     disableInDev: false,
    //   },
    // ],
    async function myPlugin(context, options) {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
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
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: '',
        logo: {
          alt: 'HAQQ Network',
          src: 'img/haqq-logo.svg',
          srcDark: 'img/haqq-logo-white.svg',
        },
        items: [
          {
            href: '/intro',
            position: 'left',
            label: 'Intro',
          },
          {
            href: '/validators',
            position: 'left',
            label: 'Validators',
          },
          {
            href: '/develop',
            position: 'left',
            label: 'Develop',
          },
          {
            href: '/explorers',
            position: 'left',
            label: 'Explorers',
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
                href: '/intro',

                label: 'Intro',
              },
              {
                href: '/validators',

                label: 'Validators',
              },
              {
                href: '/develop',

                label: 'Develop',
              },
              {
                href: '/explorers',

                label: 'Explorers',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
              {
                href: 'https://github.com/haqq-network/haqq',
                label: 'GitHub',
              },
            ],
          },
          // {
          //   title: "More",
          //   items: [
          //     {
          //       label: "Blog",
          //       to: "/blog",
          //     },
          //     {
          //       label: "GitHub",
          //       href: "https://github.com/facebook/docusaurus",
          //     },
          //   ],
          // },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} HAQQ Network`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        appId: 'T5OEVED57K',
        apiKey: '12309afa621f617e25de57d1503d5ff3',
        indexName: 'my_first_index',
        contextualSearch: true,
        searchPagePath: 'search',
      },
    }),
};

module.exports = config;
