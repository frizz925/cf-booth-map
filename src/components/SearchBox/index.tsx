import { faArrowLeft, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';
import * as styles from './styles.scss';

export interface SearchBoxProps {
  className?: string;
  docked: boolean;
  value: string;
  onAction: () => void;
  onBack: () => void;
  onFocus: () => void;
  onClear: () => void;
  onTextChanged: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = props => {
  const {
    className,
    docked,
    value,
    onFocus,
    onAction,
    onBack,
    onClear,
    onTextChanged,
  } = props;
  const containerClassNames = classNames(styles.container, className);
  const floatingClassNames = classNames(styles.floatingContainer, {
    [styles.floating]: !docked,
    [styles.docked]: docked,
  });
  return (
    <div className={containerClassNames}>
      <div className={floatingClassNames}>
        <div className={styles.formButton} onClick={() => (docked ? onBack : onAction)()}>
          <FontAwesomeIcon icon={docked ? faArrowLeft : faBars} />
        </div>
        <input
          className={styles.searchInput}
          type='value'
          placeholder='Search for circle'
          onFocus={onFocus}
          onChange={e => onTextChanged(e.target.value)}
          value={value}
        />
        <div
          className={styles.formButton}
          onClick={onClear}
          style={{ visibility: value.length > 0 ? 'visible' : 'hidden' }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
