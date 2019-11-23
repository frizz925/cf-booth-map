import React, { PureComponent } from 'react';
import * as styles from './styles.css';

class SearchBox extends PureComponent {
  public render() {
    return (
      <div className={styles.container}>
        <div className={styles.formField}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search for circle"
          />
        </div>
      </div>
    );
  }
}

export default SearchBox;
