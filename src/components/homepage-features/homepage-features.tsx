import React from 'react';
import { BigCard } from '../big-card/big-card';
import { RocketIcon } from '../icons/rocket-icon';
import { CodeIcon } from '../icons/code-icon';
import { ExploreBlock } from '../explore-block/explore-block';
import Link from '@docusaurus/Link';

export default function HomepageFeatures() {
  return (
    <section>
      <div className="container flex flex-col gap-[40px] py-[80px]">
        <div className="flex flex-col gap-[40px]">
          <h1 className="font-[500] font-serif text-5xl">HAQQ Documentation</h1>
          <p className="text-xl">
            Haqq is a scalable and interoperable Ethereum, built on
            Proof-of-Stake with fast-finality. Islamic Coin (ISLM) is a native
            currency of Haqq. Getting Started
          </p>
          <p className="text-lg">
            Read all about Haqq or dive straight into the code with guides.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-[20px] md:gap-[40px]">
          <div className="flex-1 w-full">
            <Link
              to="/intro"
              className={
                'hover:no-underline transition-colors duration-250 ease-out !text-white'
              }
            >
              <BigCard
                title="Intro"
                description="What is HAQQ?"
                icon={<RocketIcon className="ml-[-1rem] scale-[1.06]" />}
              />
            </Link>
          </div>
          <div className="flex-1 w-full">
            <Link
              to="/validators"
              className={
                'hover:no-underline transition-colors duration-250 ease-out !text-white'
              }
            >
              <BigCard
                title="Validators"
                description="Follow guides to run validators on HAQQ."
                icon={<CodeIcon className="mb-[-1rem]" />}
              />
            </Link>
          </div>
        </div>

        <div>
          <ExploreBlock />
        </div>
      </div>
    </section>
  );
}
