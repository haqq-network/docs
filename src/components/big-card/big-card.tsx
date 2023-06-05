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
        'flex flex-col md:flex-row w-full rounded-md shadow border border-gray/20 text-dim',
        'transition-all duration-[250ms] ease-in-out',
        'hover:translate-y-[-3px] hover:shadow-lg',
        'md:min-h-[184px]',
        'bg-gradient-to-r from-white via-transparent to-[rgba(236,87,40,0.3)]',
        className,
      )}
    >
      <div className="flex items-center justify-center self-center max-h-[144px] sm:h-auto pt-[1rem] sm:pt-0">
        {icon}
      </div>
      <div className="flex-1 p-[24px] sm:pt-[28px] sm:px-[32px] sm:pb-[32px] flex flex-col">
        <div className="text-[20px] tracking-[.01em] leading-[1.75em] font-semibold mt-[4px] text-black">
          {title}
        </div>
        <div className="text-[14px] tracking-[.03em] leading-[1.25em] mt-[12px]">
          {description}
        </div>
      </div>
    </div>
  );
}
