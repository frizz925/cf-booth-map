import reactiveState from '@utils/reactiveState';
import React, { PureComponent, StyleHTMLAttributes } from 'react';

interface LazyImageProps {
  src: string|Promise<string>;
  width: number|string;
  height: number|string;
  className?: string;
  style?: StyleHTMLAttributes<HTMLImageElement>;
  loadingClassName?: string;
  loadingStyle?: StyleHTMLAttributes<HTMLDivElement>;
  onError?: (err: Error) => void;
}

interface LazyImageState {
  loadedSrc: string;
  hasLoaded: boolean;
}

class LazyImage extends PureComponent<LazyImageProps, LazyImageState> {
  private reactiveState = reactiveState(this);
  private isLoading = false;

  constructor(props: LazyImageProps) {
    super(props);
    this.state = {
      loadedSrc: null,
      hasLoaded: false,
    };
    this.handleError = this.handleError.bind(this);
  }

  public componentDidMount() {
    this.loadImage();
  }

  public componentDidUpdate() {
    this.loadImage();
  }

  public render() {
    const {
      width,
      height,
      style,
      className,
      loadingStyle,
      loadingClassName,
    } = this.props;
    const { loadedSrc, hasLoaded } = this.state;
    const mergedLoadingStyle = Object.assign({
      display: 'inline-block',
      backgroundColor: '#eee',
      width,
      height,
    }, loadingStyle);

    return hasLoaded ?
      <img src={loadedSrc} className={className} style={style} /> :
      <div className={loadingClassName} style={mergedLoadingStyle} />;
  }

  private loadImage() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.reactiveState.hasLoaded = false;

    const image = new Image();
    const setImage = (src: string) => {
      image.src = src;
      if (image.complete) {
        image.onload(null);
      }
    };
    image.onload = () => {
      this.isLoading = false;
      this.setState({
        loadedSrc: image.src,
        hasLoaded: true,
      });
    };

    const srcOrPromise = this.props.src;
    if (typeof srcOrPromise === 'string') {
      setImage(srcOrPromise);
    } else {
      srcOrPromise.then(setImage, this.handleError);
    }
  }

  private handleError(err: Error) {
    const { onError } = this.props;
    (onError || console.error)(err);
  }
}

export default LazyImage;
