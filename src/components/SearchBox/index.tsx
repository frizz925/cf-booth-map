import { faArrowLeft, faHamburger, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { PureComponent } from 'react';
import * as styles from './styles.css';

export interface SearchBoxProps {
  className?: string;
  docked: boolean;
  value: string;
  onAction: () => void;
  onBack: () => void;
  onClick: () => void;
  onClear: () => void;
  onTextChanged: (value: string) => void;
}

export default class SearchBox extends PureComponent<SearchBoxProps> {
  public render() {
    const { className, docked, value, onClick, onClear, onTextChanged } = this.props;
    const containerClassNames = classNames(styles.container, className);
    const floatingClassNames = classNames(styles.floatingContainer, {
      [styles.floating]: !docked,
      [styles.docked]: docked,
    });
    return (
      <div className={containerClassNames}>
        <div className={floatingClassNames}>
          <div className={styles.form}>
            <div className={styles.formButton} onClick={this.onActionClicked}>
              <FontAwesomeIcon icon={docked ? faArrowLeft : faHamburger} />
            </div>
            <input
              className={styles.searchInput}
              type='value'
              placeholder='Search for circle'
              onClick={onClick}
              onChange={e => onTextChanged(e.target.value)}
              value={value}
            />
            <div className={styles.formButton} onClick={onClear}>
              <FontAwesomeIcon
                icon={faTimes}
                style={{ visibility: value.length > 0 ? 'visible' : 'hidden' }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  private onActionClicked = () => {
    const { docked, onAction, onBack } = this.props;
    (docked ? onBack : onAction)();
  };
}
