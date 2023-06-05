import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export const ProjectValue = ({ keyword }) => {
  const { siteConfig } = useDocusaurusContext();
  const {
    customFields: { project },
  } = siteConfig;

  return <span>{project[keyword] || ''}</span>;
};
