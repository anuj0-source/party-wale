// src/components/SocialLinks/SocialLinks.tsx
// Three small hand-drawn-circle social links (restyled to fit the scene).

import React from 'react';
import { IconGithub, IconLinkedin, IconInstagram } from '../Icons/Icons';
import './SocialLinks.css';

const LINKS = [
  { href: 'https://github.com/anuj0-source',     label: 'GitHub',    Icon: IconGithub },
  { href: 'https://www.linkedin.com/in/anuj-singh-316161281', label: 'LinkedIn', Icon: IconLinkedin },
  { href: 'https://www.instagram.com/itz_a__anuj', label: 'Instagram', Icon: IconInstagram },
];

export function SocialLinks() {
  return (
    <div className="social-links">
      {LINKS.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="scene-social-link"
          aria-label={label}
          title={label}
        >
          <Icon size={14} />
        </a>
      ))}
    </div>
  );
}
