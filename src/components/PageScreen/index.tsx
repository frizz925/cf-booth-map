import classNames from 'classnames';
import React from 'react';
import * as styles from './styles.scss';

export interface PageScreenProps {
  opened: boolean;
  title: string;
}

const PageScreen: React.FC<PageScreenProps> = props => {
  const { opened, title } = props;
  const containerClassNames = classNames(styles.container, {
    [styles.opened]: opened,
  });
  return (
    <div className={containerClassNames}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h3 className={styles.title}>{title}</h3>
        </div>
      </div>
      <div className={styles.body}>{props.children}</div>
    </div>
  );
};

export default PageScreen;
