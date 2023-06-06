import React from 'react';
import { ProjectValue } from '../project-value/project-value';

export const Highlighter = ({ pretext = '', keyword, postText = '' }) => {
  return (
    <span className="bg-[#ffffff1a] border-[.1rem] border-white/10 rounded-[.4rem] font-mono p-[.1rem]">
      {pretext}
      <ProjectValue keyword={keyword} />
      {postText}
    </span>
  );
};
