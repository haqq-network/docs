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
    <div className="rounded-md border border-gray-600/30 hover:border-haqq-orange h-full transition-all duration-250 ease-out">
      <div className="flex flex-row gap-5 py-4 px-5">
        <div className="w-[48px] h-[48px]">{icon}</div>
        <div>
          <div className="font-[500] font-serif text-lg">{title}</div>
          <div className="text-sm">{description}</div>
        </div>
      </div>
    </div>
  );
}
