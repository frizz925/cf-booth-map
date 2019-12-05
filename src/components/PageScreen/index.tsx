import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';
import * as styles from './styles.scss';

export interface PageScreenProps {
  opened: boolean;
  title: string;
  onBack: () => void;
}

const PageScreen: React.FC<PageScreenProps> = props => {
  const { opened, title, onBack } = props;
  const containerClassNames = classNames(styles.container, {
    [styles.opened]: opened,
  });
  return (
    <div className={containerClassNames}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.back} onClick={onBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <h3 className={styles.title}>{title}</h3>
        </div>
      </div>
      <div className={styles.body}>{props.children}</div>
    </div>
  );
};

export default PageScreen;
