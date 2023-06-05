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
        'flex flex-col md:flex-row w-full shadow border border-gray/20 rounded-md text-dim',
        'transition-all duration-[250ms] ease-in-out',
        'hover:translate-y-[-3px] hover:shadow-lg',
        'md:min-h-[184px]',
        'bg-gradient-to-r from-white via-transparent to-[rgba(236,87,40,0.3)]',
        'dark:shadow-[0px_2px_4px_rgba(255,255,255,0.05),0px_0px_1px_rgba(255,255,255,0.2),0px_0.5px_0px_rgba(255,255,255,0.05)]',
        'dark:from-[#1B1C1D] dark:via-transparent dark:to-[rgba(236,87,40,0.3)] dark:text-white/50',
        'dark:hover:shadow-[0px_2px_4px_rgba(255,255,255,0.05),0px_0px_1px_rgba(255,255,255,0.2),0px_0.5px_0px_rgba(255,255,255,0.15)]',
        className,
      )}
    >
      <div className="flex items-center justify-center self-center max-h-[144px] sm:h-auto pt-[1rem] sm:pt-0">
        {icon}
      </div>
      <div className="flex-1 p-[24px] sm:pt-[28px] sm:px-[32px] sm:pb-[32px] flex flex-col">
        <div className="text-[20px] tracking-[.01em] leading-[1.75em] font-semibold mt-[4px] text-black dark:text-white/80">
          {title}
        </div>
        <div className="text-[14px] tracking-[.03em] leading-[1.25em] mt-[12px]">
          {description}
        </div>
      </div>
    </div>
  );
}
