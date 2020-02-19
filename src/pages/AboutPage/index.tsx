import {
  faFacebookSquare,
  faGithub,
  faTwitterSquare,
  IconDefinition,
} from '@fortawesome/free-brands-svg-icons';
import { faCommentAlt } from '@fortawesome/free-regular-svg-icons';
import { faGlobeAsia } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ACCENT_COLOR,
  FACEBOOK_COLOR,
  GITHUB_COLOR,
  TWITTER_COLOR,
  WEB_COLOR,
} from '@utils/Colors';
import { APP_NAME, APP_VERSION, FEEDBACK_LINK, GITHUB_LINK } from '@utils/Constants';
import map from 'lodash/map';
import React from 'react';
import disclaimer from './disclaimer.md';
import * as styles from './styles.scss';

interface AboutLink {
  icon: IconDefinition;
  iconColor: string;
  title: string;
  href: string;
}

const aboutLinks: AboutLink[] = [
  {
    title: 'Facebook',
    icon: faFacebookSquare,
    iconColor: FACEBOOK_COLOR,
    href: 'https://www.facebook.com/Comifuro/',
  },
  {
    title: 'Twitter',
    icon: faTwitterSquare,
    iconColor: TWITTER_COLOR,
    href: 'https://twitter.com/comifuro',
  },
  {
    title: 'Comic Frontier',
    icon: faGlobeAsia,
    iconColor: WEB_COLOR,
    href: 'https://comifuro.net/',
  },
  {
    title: 'GitHub',
    icon: faGithub,
    iconColor: GITHUB_COLOR,
    href: GITHUB_LINK,
  },
  {
    title: 'Feedback Form',
    icon: faCommentAlt,
    iconColor: ACCENT_COLOR,
    href: FEEDBACK_LINK,
  },
];

export default () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{APP_NAME}</h1>
        <div className={styles.version}>{APP_VERSION}</div>
      </div>
      <div className={styles.body}>
        <div
          className={styles.disclaimer}
          dangerouslySetInnerHTML={{ __html: disclaimer }}
        />
        <div className={styles.linkList}>
          <h2 className={styles.linkHeader}>External Links</h2>
          {map(aboutLinks, (link, idx) => (
            <a
              key={idx}
              className={styles.link}
              href={link.href}
              target='_blank'
              rel='noopener'
            >
              <span className={styles.linkIcon} style={{ color: link.iconColor }}>
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
