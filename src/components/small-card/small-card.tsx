import React, { ReactNode } from 'react';
import styles from './small-card.module.css';
import clsx from 'clsx';

interface SmallCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function SmallCard({ title, description, icon }: SmallCardProps) {
  return (
    <div className={styles.small__card}>
      <div className="absolute top-[16px] left-[20px] text-[24px] flex items-center justify-center w-[48px] h-[48px]">
        {icon}
      </div>

      <div
        className={clsx(
          'pb-[20px] sm:pb-0 border-b border-b-[#8c91b152] sm:border-b-0',
        )}
      >
        <div className="font-semibold dark:text-white/50">{title}</div>
        <div className="leading-[20px] text-[14px] dark:text-white/80">
          {description}
        </div>
      </div>
    </div>
  );
}
