import React, { PureComponent } from 'react';

interface ErrorBoundaryProps {
  onError: (err: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends PureComponent<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public componentDidCatch(error: Error, info: any) {
    this.props.onError(error);
    this.setState({ hasError: true });
    console.error(error, info);
  }

  public render() {
    const { hasError } = this.state;
    if (hasError) {
      return <div></div>;
    }
    return this.props.children;
  }
}
