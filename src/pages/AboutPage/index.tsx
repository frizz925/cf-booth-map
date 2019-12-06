import {
  faFacebookSquare,
  faGithub,
  faTwitterSquare,
  IconDefinition,
} from '@fortawesome/free-brands-svg-icons';
import { faGlobeAsia } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APP_NAME, APP_VERSION, GITHUB_LINK } from '@utils/Constants';
import map from 'lodash/map';
import React from 'react';
import disclaimer from './disclaimer.md';
import * as styles from './styles.scss';

interface AboutLink {
  icon: IconDefinition;
  title: string;
  href: string;
}

const aboutLinks: AboutLink[] = [
  {
    title: 'Facebook',
    icon: faFacebookSquare,
    href: 'https://www.facebook.com/Comifuro/',
  },
  {
    title: 'Twitter',
    icon: faTwitterSquare,
    href: 'https://twitter.com/comifuro',
  },
  {
    title: 'Comic Frontier',
    icon: faGlobeAsia,
    href: 'https://comifuro.net/',
  },
  {
    title: 'GitHub',
    icon: faGithub,
    href: GITHUB_LINK,
  },
];

const AboutPage: React.FC = () => {
  return (
    <div>
      <div className={styles.header}>
        <h3 className={styles.title}>{APP_NAME}</h3>
        <div className={styles.version}>{APP_VERSION}</div>
      </div>
      <div className={styles.body}>
        <div
          className={styles.disclaimer}
          dangerouslySetInnerHTML={{ __html: disclaimer }}
        />
        <div className={styles.linkList}>
          <div className={styles.linkHeader}>External Links</div>
          {map(aboutLinks, (link, idx) => (
            <a
              key={idx}
              className={styles.link}
              href={link.href}
              target='_blank'
              rel='noopener'
            >
              <span className={styles.linkIcon}>
                <FontAwesomeIcon icon={link.icon} />
              </span>
              <span className={styles.linkTitle}>{link.title}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
