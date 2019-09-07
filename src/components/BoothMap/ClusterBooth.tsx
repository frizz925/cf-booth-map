import Booth from '@models/Booth';
import Circle from '@models/Circle';
import { SearchView } from '@models/Search';
import { pushSearchView } from '@store/app/actions';
import { AppState } from '@store/app/types';
import getBoothNumber from '@utils/booth';
import CSS from 'csstype';
import { assign } from 'lodash';
import React, { PureComponent, ReactNode } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

interface BaseProps {
  boothNumber: string;
  booth: Booth;
  circle: Circle;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  children?: ReactNode;
  style?: CSS.Properties;
}

interface StateToProps {
  displayCircleName: boolean;
  isMarked: boolean;
  isSearching: boolean;
}

interface DispatchToProps {
  pushSearchView: (searchView: SearchView) => void;
}

type ClusterBoothProps = BaseProps & StateToProps & DispatchToProps;

interface ClusterBoothState {
  isHovered: boolean;
}

export interface EventData {
  circle: Circle;
  booth: Booth;
}

class ClusterBooth extends PureComponent<ClusterBoothProps, ClusterBoothState> {
  private ref = React.createRef<HTMLTableCellElement>();
  private inHandler: (evt: MouseEvent) => void;
  private outHandler: (evt: MouseEvent) => void;

  constructor(props: ClusterBoothProps) {
    super(props);
    this.state = {
      isHovered: false,
    };
    this.inHandler = () => {
      this.setState({ isHovered: true });
    };
    this.outHandler = () => {
      this.setState({ isHovered: false });
    };
  }

  public componentDidMount() {
    this.maybeTriggerPanning();
    this.ref.current.addEventListener('mouseenter', this.inHandler);
    this.ref.current.addEventListener('mouseleave', this.outHandler);
  }

  public componentDidUpdate() {
    this.maybeTriggerPanning();
  }

  public componentWillUnmount() {
    this.ref.current.removeEventListener('mouseenter', this.inHandler);
    this.ref.current.removeEventListener('mouseleave', this.outHandler);
  }

  public render() {
    const { isMarked } = this.props;
    const cellStyle: CSS.Properties = isMarked ? {
      backgroundColor: '#1875d1',
      color: '#eee',
      fontWeight: 500,
    } : null;
    const cellProps = {
      className: this.props.className,
      colSpan: this.props.colSpan,
      rowSpan: this.props.rowSpan,
      style: assign(cellStyle, this.props.style),
    };
    const content = this.props.displayCircleName ?
      this.props.children :
      getBoothNumber(this.props.booth);
    return <td {...cellProps} ref={this.ref}>{content}</td>;
  }

  private maybeTriggerPanning() {
    if (!this.props.isMarked || !this.props.isSearching) {
      return;
    }
    const clientRect = this.ref.current.getBoundingClientRect();
    this.props.pushSearchView({
      x: clientRect.left + (clientRect.width / 2),
      y: clientRect.top + (clientRect.height / 2),
    });
  }
}

const mapStateToProps = (state: AppState, props: BaseProps): StateToProps => ({
  displayCircleName: state.displayCircleName,
  isMarked: !!state.markedBooths[props.boothNumber],
  isSearching: state.isSearching,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchToProps => ({
  pushSearchView(searchView: SearchView) {
    dispatch(pushSearchView(searchView));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClusterBooth);
