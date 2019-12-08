import React from 'react';

interface SnackbarProps {
  message: string;
  duration?: number;
  onAction: () => void;
  onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = props => {
  const { message } = props;
  return (
    <div>
      <div>{message}</div>
    </div>
  );
};

export default Snackbar;
