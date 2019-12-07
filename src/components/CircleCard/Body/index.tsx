import LazyImage from '@components/LazyImage';
import {
  faFacebookSquare,
  faInstagram,
  faTwitterSquare,
} from '@fortawesome/free-brands-svg-icons';
import { faGlobeAsia } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Circle from '@models/Circle';
import { SocialType } from '@models/Social';
import map from 'lodash/map';
import React from 'react';
import * as styles from './styles.scss';

interface BodyProps {
  circle: Circle;
}

interface InfoMapping {
  title: string;
  render: (circle: Circle) => string | string[] | JSX.Element | JSX.Element[];
}

const defaultSocialIcon = faGlobeAsia;
const socialIcons = {
  [SocialType.Facebook]: faFacebookSquare,
  [SocialType.Twitter]: faTwitterSquare,
  [SocialType.Instagram]: faInstagram,
  [SocialType.Web]: defaultSocialIcon,
};

const infoMapping: InfoMapping[] = [
  {
    title: 'Day(s)',
    render: ({ day }) => day,
  },
  {
    title: 'Fandoms',
    render: ({ fandoms }) => fandoms,
  },
  {
    title: 'Categories',
    render: ({ categories }) => categories,
  },
  {
    title: 'Rating',
    render: ({ rating }) => rating,
  },
  {
    title: 'Social',
    render: ({ socials }) =>
      socials.length > 0 ? (
        <div className={styles.socialList}>
          {socials.map(({ type, url }, idx) => (
            <a href={url} key={idx} className={styles.socialLink} target='_blank'>
              <span className={styles.socialIcon}>
                <FontAwesomeIcon icon={socialIcons[type] || defaultSocialIcon} />
              </span>
              <span className={styles.socialTitle}>{type}</span>
            </a>
          ))}
        </div>
      ) : null,
  },
];

const sanitizeRender = (rendered: any): React.ReactNode | null => {
  if (typeof rendered === 'string') {
    return <span>{rendered}</span>;
  } else if (rendered instanceof Array && typeof rendered[0] === 'string') {
    return (
      <ul>
        {map(rendered, (item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  }
  return rendered;
};

const Body: React.FC<BodyProps> = ({ circle }) => {
  return (
    <div className={styles.body}>
      <div className={styles.image}>
        <LazyImage src={circle.imageUrl} alt={circle.name} width={180} height={256} />
      </div>
      <div className={styles.details}>
        {map(infoMapping, ({ title, render }, idx) => {
          const rendered = sanitizeRender(render(circle));
          if (!rendered) {
            return null;
          }
          return (
            <div key={idx} className={styles.info}>
              <span>{title}</span>
              {rendered}
            </div>
          );
        }).filter(el => !!el)}
      </div>
    </div>
  );
};

export default Body;
