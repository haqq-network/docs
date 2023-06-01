import React, { PropsWithChildren } from 'react';
import { BigCardProps } from '../big-card/big-card';
import Link from '@docusaurus/Link';
import styles from './small-card.module.css';
import clsx from 'clsx';

type SmallCardProps = Omit<BigCardProps, 'type'>;

export function SmallCard({
  title,
  description,
  className,
  link,
  children,
}: PropsWithChildren<SmallCardProps>) {
  return (
    <Link to={`/${link}`} className="hover:no-underline hover:text-inherit">
      <div className={styles.small__card}>
        <div className="absolute top-[16px] left-[20px] text-[24px] flex items-center justify-center w-[48px] h-[48px]">
          {children}
        </div>

        <div
          className={clsx(
            'pb-[20px] sm:pb-0 border-b border-b-[#8c91b152] sm:border-b-0',
            className,
          )}
        >
          <div className="font-semibold">{title}</div>
          <div className="text-dim leading-[20px] text-[14px]">
            {description}
          </div>
        </div>
      </div>
    </Link>
  );
}
