import React, { ComponentProps, ComponentType } from 'react';
import clsx from 'clsx';
import styles from './index.module.css';
import { BigCard } from '../big-card/big-card';
import { RocketIcon } from '../icons/rocket-icon';
import { CodeIcon } from '../icons/code-icon';
import { SmallCard } from '../small-card/small-card';
import { IntroducionIcon } from '../icons/introduciton-icon';
import { BasicsIcon } from '../icons/basics-icon';
import { CoreConceptsIcon } from '../icons/core-concepts-icon';
import { ExploreBlock } from '../explore-block/explore-block';
import Link from '@docusaurus/Link';

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="flex flex-col md:flex-row items-center gap-[40px] mt-[40px]">
          <div className="flex-1">
            <Link to="/intro">
              <BigCard
                title="Quick start"
                description="Deploy your own node, setup your testnet and more."
                icon={<RocketIcon />}
              />
            </Link>
          </div>
          <div className="flex-1">
            <Link to="/validators">
              <BigCard
                title="Guides"
                description="Follow guides to using popular Ethereum tools with HAQQ."
                icon={<CodeIcon />}
              />
            </Link>
          </div>
        </div>

        <ExploreBlock />
      </div>
    </section>
  );
}
