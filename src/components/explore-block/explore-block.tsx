import React from 'react';
import styles from './explore-block.module.css';
import { SmallCard } from '../small-card/small-card';
import { IntroducionIcon } from '../icons/introduciton-icon';
import { BasicsIcon } from '../icons/basics-icon';
import { CoreConceptsIcon } from '../icons/core-concepts-icon';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

export function ExploreBlock() {
  return (
    <div
      className={clsx(
        styles.wrapper,
        'relative pt-[72px] px-[16px] pb-[16px] bg-white rounded-[8px] md:rounded-none md:bg-transparent sm:mt-[40px] md:px-0 md:pb-0',
      )}
    >
      <div className="text-[24px] font-bold leading-[2rem] md:text-[32px] md:leading-[36px] md:tracking-[.01em]">
        Explore HAQQ
      </div>
      <p className="mt-[12px]">
        Get familiar with HAQQ and explore its main concepts.
      </p>
      <div
        className={
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:gap-[12px] md:gap-[24px] mt-[32px] mx-[-16px] sm:mx-0 md:mt-[48px] md:mb-[80px]'
        }
      >
        <Link
          to={`/intro/ecosystem`}
          className="hover:no-underline hover:text-inherit"
        >
          <SmallCard
            title="Ecosystem"
            description="Read a high-level overview of HAQQ and its architecture."
            icon={<IntroducionIcon />}
          />
        </Link>

        <Link to={`/develop`} className="hover:no-underline hover:text-inherit">
          <SmallCard
            title="Develop"
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
            description="Read about the core concepts like encoding and events."
            className="max-[640px]:border-b-0"
            icon={<CoreConceptsIcon />}
          />
        </Link>
      </div>
    </div>
  );
}
