import { MarkedBooths } from '@models/Booth';
import Circle from '@models/Circle';
import { CircleMapping } from '@models/Mapped';
import { clearMarkedBooths, openDrawer, setMarkedBooths } from '@store/app/actions';
import { AppState } from '@store/app/types';
import reactiveState from '@utils/reactiveState';
import classNames from 'classnames';
import Fuse, { FuseOptions } from 'fuse.js';
import React, { ChangeEvent, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import Form from './Form';
import List from './List';
import styles from './styles.css';

interface SearchableCircle {
  name: string;
  boothNumber0: string;
  boothNumber1: string;
  circle: Circle;
}

interface ExpandedProps {
  showSearchExpanded: boolean;
}

interface StateToProps {
  circles: SearchableCircle[];
  circleMapping: CircleMapping;
}

interface DispatchToProps {
  setMarkedBooths: (markedBooths: MarkedBooths) => void;
  clearMarkedBooths: () => void;
  openDrawer: () => void;
}

type SearchFormProps = StateToProps & DispatchToProps;

interface BaseState {
  filteredCircles: Circle[];
  showClearButton: boolean;
  value: string;
}

type SearchFormState = BaseState & ExpandedProps;

class SearchForm extends PureComponent<SearchFormProps, SearchFormState> {
  private reactiveState: SearchFormState;

  private onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  private fuse: Fuse<SearchableCircle>;
  private subject: Subject<string>;

  private onFocus: () => void;
  private onClose: () => void;
  private onClear: () => void;
  private onItemClick: (circle: Circle) => void;

  constructor(props: SearchFormProps) {
    super(props);
    this.state = {
      showClearButton: false,
      showSearchExpanded: false,
      value: '',
      filteredCircles: [],
    };
    this.reactiveState = reactiveState(this);

    this.fuse = new Fuse(props.circles, {
      tokenize: true,
      shouldSort: true,
      location: 0,
      threshold: 0.2,
      distance: 100,
      keys: ['name', 'boothNumber0', 'boothNumber1'],
    } as FuseOptions<{}>);
    this.subject = new Subject();
    this.onChange = (evt) => {
      const value = evt.target.value;
      const newState = {
        value,
        showClearButton: this.state.showClearButton,
      };
      if (value) {
        if (!newState.showClearButton) {
          newState.showClearButton = true;
        }
      } else {
        if (newState.showClearButton) {
          newState.showClearButton = false;
        }
      }
      this.setState(newState);
      this.subject.next(value);
    };

    this.onFocus = () => {
      this.reactiveState.showSearchExpanded = true;
    };
    this.onClose = () => {
      this.reactiveState.showSearchExpanded = false;
    };
    this.onClear = () => {
      this.setState({
        value: '',
        showClearButton: false,
        filteredCircles: [],
      });
      props.clearMarkedBooths();
    };

    this.onItemClick = (circle: Circle) => {
      const { cluster } = props.circleMapping[circle.name];
      const markedBooths: MarkedBooths = {};
      circle.boothNumbers.forEach((boothNumber) => {
        markedBooths[boothNumber] = cluster;
      });
      props.setMarkedBooths(markedBooths);
      this.setState({
        showSearchExpanded: false,
        filteredCircles: [],
        value: circle.name,
      });
    };

    this.subject.pipe(debounceTime(500)).subscribe((search) => {
      if (!search) {
        this.reactiveState.filteredCircles = [];
        return;
      }
      const searchResult = this.fuse.search(search);
      if (!searchResult) {
        this.reactiveState.filteredCircles = [];
        return;
      }
      this.reactiveState.filteredCircles = searchResult.map((x) => x.circle);
    });

    this.subject.subscribe((search) => {
      this.reactiveState.showClearButton = !!search;
    });
  }

  public render() {
    const {
      value,
      filteredCircles,
      showClearButton,
      showSearchExpanded,
    } = this.state;
    const expandedClassName = {
      [styles.formExpanded]: showSearchExpanded,
    };
    const containerClassName = classNames('form-fields', expandedClassName);
    return (
      <div className={containerClassName}>
        <Form
          value={value}
          showSearchExpanded={showSearchExpanded}
          showClearButton={showClearButton}
          onFocus={this.onFocus}
          onClear={this.onClear}
          onChange={this.onChange}
          onDrawer={this.props.openDrawer}
          onClose={this.onClose}
        />
        <List
          showSearchExpanded={showSearchExpanded}
          circleList={filteredCircles}
          onItemClick={this.onItemClick}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: AppState): StateToProps => ({
  circles: state.circles.map((circle) => ({
    name: circle.name,
    boothNumber0: circle.boothNumber.replace('/', ' '),
    boothNumber1: circle.boothNumber.replace('/', ' ').replace('-', ''),
    circle,
  })),
  circleMapping: state.circleMapping,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchToProps => ({
  setMarkedBooths(markedBooths) {
    dispatch(setMarkedBooths(markedBooths, true));
  },
  clearMarkedBooths() {
    dispatch(clearMarkedBooths());
  },
  openDrawer() {
    dispatch(openDrawer());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchForm);
