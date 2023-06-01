import React, { PropsWithChildren, ReactNode } from 'react';
import Link from '@docusaurus/Link';
import styles from './big-card.module.css';
import clsx from 'clsx';

export interface BigCardProps {
  type?: 'read' | 'use';
  title: string;
  description?: string;
  className?: string;
  link?: string;
}

export function BigCard({
  type,
  title,
  description,
  className,
  link,
  children,
}: PropsWithChildren<BigCardProps>) {
  return (
    <Link to={`/${link}`} className="hover:no-underline hover:text-inherit">
      <div className={clsx(styles.big__card, className)}>
        <div className="flex items-center justify-center self-center max-h-[144px] sm:h-auto pt-[1rem] sm:pt-0">
          {children}
        </div>
        <div className="flex-1 p-[24px] sm:pt-[28px] sm:px-[32px] sm:pb-[32px] flex flex-col">
          <h2 className="text-[12px] tracking-[.2em] uppercase text-dim">
            {type}
          </h2>
          <h1 className="text-[14px] tracking-[.01em] leading-[1.75em] font-semibold mt-[4px] ">
            {title}
          </h1>
          <p className="text-[14px] tracking-[.03em] leading-[1.25em] mt-[12px]">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
