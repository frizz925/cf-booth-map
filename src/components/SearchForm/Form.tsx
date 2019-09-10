import { faArrowLeft, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { ChangeEvent, PureComponent } from 'react';
import styled from 'styled-components';
import styles from './styles.css';

interface FormProps {
  onClear?: () => void;
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onDrawer?: () => void;
  onClose?: () => void;
  showSearchExpanded?: boolean;
  showClearButton?: boolean;
  value?: string;
}

const FormField = styled.div`
display: table-cell;
vertical-align: top;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
display: block;
color: rgba(0,0,0,0.6);
padding: 12px 18px;
cursor: pointer;
`;

class Form extends PureComponent<FormProps> {
  public render() {
    const {showSearchExpanded, showClearButton} = this.props;
    const expandedClassName = {
      [styles.formExpanded]: showSearchExpanded,
    };
    const layoutClassName = classNames(styles.formLayout, expandedClassName);
    return (
      <div className={styles.formWrapper}>
        <div className={layoutClassName}>
          <FormField onClick={showSearchExpanded ? this.props.onClose : this.props.onDrawer}>
            {!showSearchExpanded ? <StyledFontAwesomeIcon icon={faBars} /> : null}
            {showSearchExpanded ? <StyledFontAwesomeIcon icon={faArrowLeft} /> : null}
          </FormField>
          <FormField style={{ width: '100%' }}>
            <input
              type='text'
              value={this.props.value}
              className={styles.formInput}
              placeholder='Search for circle'
              onChange={this.props.onChange}
              onFocus={this.props.onFocus}
              aria-label='Search for circle'
            />
          </FormField>
          <FormField
            style={{ display: showClearButton ? 'table-cell' : 'none' }}
            onClick={this.props.onClear}
          >
            <StyledFontAwesomeIcon icon={faTimes} />
          </FormField>
        </div>
      </div>
    );
  }
}

export default Form;
