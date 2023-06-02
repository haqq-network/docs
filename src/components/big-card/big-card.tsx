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
    <div className={clsx('flex flex-row w-full', className)}>
      <div className="flex items-center justify-center self-center max-h-[144px] sm:h-auto pt-[1rem] sm:pt-0">
        {icon}
      </div>
      <div className="flex-1 p-[24px] sm:pt-[28px] sm:px-[32px] sm:pb-[32px] flex flex-col">
        <div className="text-[14px] tracking-[.01em] leading-[1.75em] font-semibold mt-[4px]">
          {title}
        </div>
        <div className="text-[14px] tracking-[.03em] leading-[1.25em] mt-[12px]">
          {description}
        </div>
      </div>
    </div>
  );
}
