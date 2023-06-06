import React from 'react';
import { BigCard } from '../big-card/big-card';
import { RocketIcon } from '../icons/rocket-icon';
import { CodeIcon } from '../icons/code-icon';
import Link from '@docusaurus/Link';
import { SmallCard } from '../small-card/small-card';
import { BasicsIcon } from '../icons/basics-icon';
import { CoreConceptsIcon } from '../icons/core-concepts-icon';

export default function HomepageFeatures() {
  return (
    <section>
      <div className="container flex flex-col gap-[80px] py-[80px]">
        <div className="flex flex-col gap-[30px]">
          <h1 className="font-[500] font-serif text-5xl">HAQQ Documentation</h1>
          <p className="text-xl">
            HAQQ is a scalable and interoperable Ethereum, built on
            Proof-of-Stake with fast-finality.
          </p>
        </div>

        <div className="flex flex-col gap-[30px]">
          <div className="text-[24px] font-[500] leading-[2rem] md:text-[32px] md:leading-[36px] md:tracking-[.01em] font-serif">
            Getting Started
          </div>
          <p className="text-base">
            Read all about HAQQ or dive straight into the code with guides.
          </p>

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
        </div>

        <div className="flex flex-col gap-[30px]">
          <div className="text-[24px] font-[500] leading-[2rem] md:text-[32px] md:leading-[36px] md:tracking-[.01em] font-serif">
            Explore HAQQ
          </div>
          <p className="text-base">
            Get familiar with HAQQ and explore its main concepts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] md:gap-[40px]">
            <div>
              <Link
                to={`/develop`}
                className="hover:no-underline hover:text-inherit"
              >
                <SmallCard
                  title="Basics"
                  description="Start with the basic concepts of HAQQ, like accounts and transactions."
                  icon={<BasicsIcon />}
                />
              </Link>
            </div>
            <div>
              <Link
                to={`/explorers`}
                className="hover:no-underline hover:text-inherit"
              >
                <SmallCard
                  title="Explorers"
                  description="Links on chain explorers."
                  className="max-[640px]:border-b-0"
                  icon={<CoreConceptsIcon />}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
