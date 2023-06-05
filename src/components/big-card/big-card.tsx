import React, { ReactNode } from 'react';
import clsx from 'clsx';

export function BigCard({
  title,
  description,
  className,
  icon,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'big-card',
        'w-full rounded-[8px] shadow-sm hover:shadow-xl',
        'transition-all duration-250 ease-out',
        'hover:translate-y-[-3px]',
        'md:min-h-[184px] flex flex-col',
        'bg-gradient-to-r from-transparent via-transparent to-[rgba(236,87,40,0.3)]',
        'py-4 px-6',
        className,
      )}
    >
      <div className="flex flex-col md:flex-row items-center justify-center flex-1 gap-[24px]">
        <div className="flex items-center justify-center self-center max-h-[144px] sm:h-auto pt-[1rem] sm:pt-0">
          {icon}
        </div>
        <div className="flex-1 flex flex-col gap-[12px] w-full">
          <div className="text-[24px] tracking-[.01em] leading-[1.05em] font-[500] font-serif">
            {title}
          </div>
          <div className="text-base">{description}</div>
        </div>
      </div>
    </div>
  );
}
