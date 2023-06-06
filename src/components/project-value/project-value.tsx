import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export function ProjectValue({ keyword }: { keyword: string }) {
  const { siteConfig } = useDocusaurusContext();
  const {
    customFields: { project },
  } = siteConfig;

  return project[keyword] ? <span>{project[keyword]}</span> : null;
}
