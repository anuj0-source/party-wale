import React from 'react';
import { IconGithub, IconLinkedin, IconInstagram } from '../Icons/Icons';
import './SocialLinks.css';

export function SocialLinks() {
  return (
    <div className="social-links-container">
      <a
        href="https://github.com/anuj0-source"
        target="_blank"
        rel="noopener noreferrer"
        className="social-link"
        aria-label="GitHub"
        title="GitHub"
      >
        <IconGithub size={20} />
      </a>
      <a
        href="https://www.linkedin.com/in/anuj-singh-316161281"
        target="_blank"
        rel="noopener noreferrer"
        className="social-link"
        aria-label="LinkedIn"
        title="LinkedIn"
      >
        <IconLinkedin size={20} />
      </a>
      <a
        href="https://www.instagram.com/itz_a__anuj"
        target="_blank"
        rel="noopener noreferrer"
        className="social-link"
        aria-label="Instagram"
        title="Instagram"
      >
        <IconInstagram size={20} />
      </a>
    </div>
  );
}
