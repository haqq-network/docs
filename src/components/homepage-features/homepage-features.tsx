import React from 'react';
import { BigCard } from '../big-card/big-card';
import { RocketIcon } from '../icons/rocket-icon';
import { CodeIcon } from '../icons/code-icon';
import Link from '@docusaurus/Link';
import { SmallCard } from '../small-card/small-card';
import { BasicsIcon } from '../icons/basics-icon';
import { CoreConceptsIcon } from '../icons/core-concepts-icon';
import { IntroducionIcon } from '../icons/introduciton-icon';

export default function HomepageFeatures() {
  return (
    <main aria-label="HAQQ Documentation Homepage">
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
                to="/learn"
                className={
                  'hover:no-underline transition-colors duration-250 ease-out !text-white'
                }
              >
                <BigCard
                  title="Intro"
                  description="Learn about the core concepts, mission, and vision of the Haqq Network. A great starting point for new users."
                  icon={<RocketIcon className="ml-[-1rem] scale-[1.06]" />}
                />
              </Link>
            </div>
            <div className="flex-1 w-full">
              <Link
                to="/l1-network/run-a-validator"
                className={
                  'hover:no-underline transition-colors duration-250 ease-out !text-white'
                }
              >
                <BigCard
                  title="Becoming a Validator"
                  description="Understand the validator's role and responsibilities. Learn how to become a validator and contribute to the network's security."
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] md:gap-[40px]">
            <div>
              <Link
                to={`/learn`}
                className="hover:no-underline hover:text-inherit"
              >
                <SmallCard
                  title="Learn"
                  description="Learn on the Haqq Network."
                  icon={<IntroducionIcon />}
                />
              </Link>
            </div>
            <div>
              <Link
                to={`/learn/ecosystem`}
                className="hover:no-underline hover:text-inherit"
              >
                <SmallCard
                  title="Ecosystem"
                  description="Explore our thriving ecosystem. From partners to projects, learn about how various components interact within the Haqq Network."
                  icon={<IntroducionIcon/>}
                />
              </Link>
            </div>
            <div>
              <Link
                to={`/develop`}
                className="hover:no-underline hover:text-inherit"
              >
                <SmallCard
                  title="Develop"
                  description=" A comprehensive guide for developers. Understand the tools, APIs, and SDKs available to build applications on top of the Haqq Network."
                  icon={<BasicsIcon />}
                />
              </Link>
            </div>
            <div>
              <Link
                to={`/l1-network`}
                className="hover:no-underline hover:text-inherit"
              >
                <SmallCard
                  title="Network"
                  description="Answers to questions - How HAQQ Network is organized? blockchain modules? how to run your node or validator?"
                  icon={<CoreConceptsIcon/>}
                />
              </Link>
            </div>
            <div>
              <Link
                to={`/user-guides`}
                className="hover:no-underline hover:text-inherit"
              >
                <SmallCard
                  title="User Guides"
                  description="How to on HAQQ Network"
                  icon={<BasicsIcon/>}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
    </main>
  );
}
