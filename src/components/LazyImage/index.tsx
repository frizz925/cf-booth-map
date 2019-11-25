import * as CSS from 'csstype';
import React, { PureComponent } from 'react';
import { Ring } from 'react-awesome-spinners';

export interface LazyImageProps {
  src: string;
  width: number;
  height: number;
  alt?: string;
  className?: string;
  style?: CSS.Properties;
}

interface LazyImageState {
  hasLoaded: boolean;
}

export default class LazyImage extends PureComponent<LazyImageProps, LazyImageState> {
  public state = {
    hasLoaded: false,
  };

  public componentDidMount() {
    this.loadImage(this.props.src);
  }

  public componentDidUpdate(prevProps: LazyImageProps) {
    const { props } = this;
    if (prevProps.src !== props.src) {
      this.loadImage(props.src);
    }
  }

  public loadImage(src: string) {
    const image = new Image();
    image.onload = () => {
      this.setState({ hasLoaded: true });
    };
    image.src = src;
    if (image.complete) {
      image.onload(null);
    } else {
      this.setState({ hasLoaded: false });
    }
  }

  public render() {
    const { hasLoaded } = this.state;
    return hasLoaded ? this.renderImage() : this.renderLoader();
  }

  public renderLoader() {
    const { width, height } = this.props;
    return (
      <div style={{ width, height }}>
        <Ring color='rgba(0, 0, 0, 0.7)' />
      </div>
    );
  }

  public renderImage() {
    const { src, alt, className, style } = this.props;
    return <img src={src} alt={alt} className={className} style={style} />;
  }
}
