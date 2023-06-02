import React from 'react';
import styles from './explore-block.module.css';
import { SmallCard } from '../small-card/small-card';
import { IntroducionIcon } from '../icons/introduciton-icon';
import { BasicsIcon } from '../icons/basics-icon';
import { CoreConceptsIcon } from '../icons/core-concepts-icon';

export function ExploreBlock() {
  return (
    <div className={styles.wrapper}>
      <h2 className="text-[24px] font-bold leading-[2rem] md:text-[32px] md:leading-[36px] md:tracking-[.01em]">
        Explore Haqq
      </h2>
      <p className="mt-[12px]">
        Get familiar with Haqq and explore its main concepts.
      </p>
      <div className={styles.sections}>
        <SmallCard
          title="Introducion"
          description="Read a high-level overview of Haqq and its architecture."
        >
          <IntroducionIcon />
        </SmallCard>
        <SmallCard
          title="Basics"
          description="Start with the basic concepts of Haqq, like accounts and transactions."
        >
          <BasicsIcon />
        </SmallCard>
        <SmallCard
          title="Core Concepts"
          description="Read about the core concepts like encoding and events."
          className="max-[640px]:border-b-0"
        >
          <CoreConceptsIcon />
        </SmallCard>
      </div>
    </div>
  );
}
