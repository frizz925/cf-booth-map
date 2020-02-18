import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import * as styles from './styles.scss';

interface SnackbarProps {
  message: string;
  shown: boolean;
  action?: string;
  onResult?: (result: boolean) => void;
  bottom?: number;
}

interface ActionButtonProps {
  text: string;
  onClick?: () => void;
}

const ActionButton = ({ text, onClick }: ActionButtonProps) => {
  return (
    <div className={styles.action} onClick={onClick}>
      {text}
    </div>
  );
};

const Snackbar: React.FC<SnackbarProps> = props => {
  const { message, action, shown, onResult, bottom } = props;
  const containerStyle = useMemo(() => {
    return bottom ? { bottom: `${bottom}px` } : {};
  }, [bottom]);
  const onClick = useCallback(() => {
    if (onResult) {
      onResult(true);
    }
  }, [onResult]);
  const containerClassNames = classNames(styles.container, {
    [styles.shown]: shown,
  });
  return (
    <div className={containerClassNames} style={containerStyle}>
      <div className={styles.content}>
        <div className={styles.label}>{message}</div>
        {action ? <ActionButton text={action} onClick={onClick} /> : null}
      </div>
    </div>
  );
};

export default Snackbar;
