import { faArrowLeft, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useCallback, useRef } from 'react';
import * as styles from './styles.scss';

export interface SearchBoxProps {
  className?: string;
  docked: boolean;
  value: string;
  onBack: () => void;
  onFocus: () => void;
  onClear: () => void;
  onTextChanged: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = props => {
  const { className, docked, value, onFocus, onBack, onClear, onTextChanged } = props;
  const containerClassNames = classNames(styles.container, className);
  const floatingClassNames = classNames(styles.floatingContainer, {
    [styles.floating]: !docked,
    [styles.docked]: docked,
  });
  const inputRef = useRef<HTMLInputElement>();
  const handleClear = useCallback(
    (evt: React.MouseEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      onClear();
      return false;
    },
    [onClear],
  );
  const handleFocus = useCallback(() => {
    onFocus();
    inputRef.current.focus();
  }, [onFocus]);
  return (
    <div className={containerClassNames}>
      <div className={floatingClassNames}>
        <div
          className={styles.formButton}
          onClick={() => (docked ? onBack : handleFocus)()}
        >
          <FontAwesomeIcon icon={docked ? faArrowLeft : faSearch} />
        </div>
        <input
          ref={inputRef}
          className={styles.searchInput}
          type='value'
          placeholder='Search for circle'
          onFocus={onFocus}
          onChange={e => onTextChanged(e.target.value)}
          value={value}
          aria-label='Search for circle'
        />
        <div
          className={styles.formButton}
          onMouseDownCapture={handleClear}
          style={{ visibility: value.length > 0 ? 'visible' : 'hidden' }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
