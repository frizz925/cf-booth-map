import classNames from 'classnames';
import React, { useMemo } from 'react';
import * as styles from './styles.scss';

export interface PageScreenProps {
  opened: boolean;
  title: string;
  navbar?: Element;
}

const PageScreen: React.FC<PageScreenProps> = props => {
  const { opened, title, navbar } = props;
  const paddingBottom = useMemo(() => {
    return navbar ? navbar.clientHeight : 0;
  }, [navbar]);
  const containerClassNames = classNames(styles.container, {
    [styles.opened]: opened,
  });
  return (
    <div className={containerClassNames} style={{ paddingBottom: `${paddingBottom}px` }}>
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
