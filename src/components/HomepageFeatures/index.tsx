import React from 'react';
import { BigCard } from '../big-card/big-card';
import { RocketIcon } from '../icons/rocket-icon';
import { CodeIcon } from '../icons/code-icon';
import { ExploreBlock } from '../explore-block/explore-block';
import Link from '@docusaurus/Link';

export default function HomepageFeatures() {
  return (
    <section>
      <div className="container">
        <div className="flex flex-col md:flex-row items-center gap-[40px] mt-[80px] mb-[40px]">
          <div className="flex-1">
            <Link to="/intro" className={'hover:no-underline'}>
              <BigCard
                title="Quick start"
                description="Deploy your own node, setup your testnet and more."
                icon={<RocketIcon />}
              />
            </Link>
          </div>
          <div className="flex-1">
            <Link to="/validators" className={'hover:no-underline'}>
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
