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
import {
  ACCENT_COLOR,
  FACEBOOK_COLOR,
  INSTAGRAM_COLOR,
  TWITTER_COLOR,
  WEB_COLOR,
} from '@utils/Colors';
import map from 'lodash/map';
import React, { Ref } from 'react';
import * as styles from './styles.scss';

interface BodyProps {
  circle: Circle;
  bodyRef?: Ref<HTMLDivElement>;
  bottomRef?: Ref<HTMLDivElement>;
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
const socialColors = {
  [SocialType.Facebook]: FACEBOOK_COLOR,
  [SocialType.Twitter]: TWITTER_COLOR,
  [SocialType.Instagram]: INSTAGRAM_COLOR,
  [SocialType.Web]: WEB_COLOR,
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
              <span
                className={styles.socialIcon}
                style={{ color: socialColors[type] || ACCENT_COLOR }}
              >
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
    return <div className={styles.infoItem}>{rendered}</div>;
  } else if (rendered instanceof Array && typeof rendered[0] === 'string') {
    return (
      <ul className={styles.infoList}>
        {map(rendered, (item, idx) => (
          <li key={idx} className={styles.infoItem}>
            {item}
          </li>
        ))}
      </ul>
    );
  }
  return rendered;
};

const Body: React.FC<BodyProps> = ({ circle, bodyRef, bottomRef }) => {
  return (
    <div ref={bodyRef} className={styles.body}>
      <div className={styles.image}>
        <LazyImage src={circle.imageUrl} alt={circle.name} width={180} height={240} />
      </div>
      <div className={styles.details}>
        {map(infoMapping, ({ title, render }, idx) => {
          const rendered = sanitizeRender(render(circle));
          if (!rendered) {
            return null;
          }
          return (
            <div key={idx} className={styles.info}>
              <div className={styles.infoTitle}>{title}</div>
              {rendered}
            </div>
          );
        }).filter(el => !!el)}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default Body;
