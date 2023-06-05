import React from 'react';
import { SmallCard } from '../small-card/small-card';
import { IntroducionIcon } from '../icons/introduciton-icon';
import { BasicsIcon } from '../icons/basics-icon';
import { CoreConceptsIcon } from '../icons/core-concepts-icon';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

export function ExploreBlock() {
  return (
    <div className={clsx('relative px-[16px] py-[16px]')}>
      <div className="text-[24px] font-[500] leading-[2rem] md:text-[32px] md:leading-[36px] md:tracking-[.01em] font-serif">
        Explore HAQQ
      </div>
      <p className="mt-[12px]">
        Get familiar with HAQQ and explore its main concepts.
      </p>
      <div
        className={
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px] md:gap-[24px] mt-6 md:mt-8'
        }
      >
        {/* <Link
          to={`/intro/ecosystem`}
          className="hover:no-underline hover:text-inherit"
        >
          <SmallCard
            title="Introducion"
            description="Read a high-level overview of HAQQ and its architecture."
            icon={<IntroducionIcon />}
          />
        </Link> */}

        <Link to={`/develop`} className="hover:no-underline hover:text-inherit">
          <SmallCard
            title="Basics"
            description="Start with the basic concepts of HAQQ, like accounts and transactions."
            icon={<BasicsIcon />}
          />
        </Link>

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
  );
}
