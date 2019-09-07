import { MarkedBooths } from '@models/Booth';
import { CircleMapping } from '@models/Mapped';
import { clearMarkedBooths, setMarkedBooths } from '@store/app/actions';
import { AppState } from '@store/app/types';
import Fuse, { FuseOptions } from 'fuse.js';
import React, { ChangeEvent, Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import styled from 'styled-components';

interface SimpleCircle {
  name: string;
  boothNumber: string;
}

interface StateToProps {
  circles: SimpleCircle[];
  circleMapping: CircleMapping;
}

interface DispatchToProps {
  setMarkedBooths: (markedBooths: MarkedBooths) => void;
  clearMarkedBooths: () => void;
}

type FormFieldsProps = StateToProps & DispatchToProps;

const FormContainer = styled.div`
border-radius: 4px;
`;

const MainInput = styled.input`
border: none;
padding: 12px 18px;
width: 100%;
outline: 0;
`;

class FormFields extends Component<FormFieldsProps> {
  private onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  private fuse: Fuse<SimpleCircle>;

  constructor(props: FormFieldsProps) {
    super(props);
    this.fuse = new Fuse(props.circles, {
      tokenize: true,
      shouldSort: true,
      location: 0,
      threshold: 0.2,
      distance: 100,
      keys: [{
        name: 'name',
        weight: 0.7,
      }, {
        name: 'boothNumber',
        weight: 0.3,
      }],
    } as FuseOptions<{}>);

    new Observable<string>((observer) => {
      this.onChange = (evt) => {
        if (observer) {
          observer.next(evt.target.value);
        }
      };
    }).pipe(debounceTime(500)).subscribe((search) => {
      this.selectBooths(search);
    });
  }

  public render() {
    return (
      <FormContainer className='form-fields'>
        <MainInput type='text' placeholder='Search for circle' onChange={this.onChange} />
      </FormContainer>
    );
  }

  private selectBooths(search: string) {
    const markedBooths: MarkedBooths = {};
    const searchResult = this.fuse.search(search);
    if (!searchResult) {
      this.props.clearMarkedBooths();
      return;
    }
    searchResult.forEach((circle) => {
      markedBooths[circle.boothNumber] = true;
    });
    this.props.setMarkedBooths(markedBooths);
  }
}

const mapStateToProps = (state: AppState): StateToProps => ({
  circles: state.circles.reduce((curry, circle) => {
    return curry.concat(circle.boothNumbers.map((boothNumber): SimpleCircle => {
      return {
        name: circle.name,
        boothNumber,
      };
    }));
  }, [] as SimpleCircle[]),
  circleMapping: state.circleMapping,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchToProps => ({
  setMarkedBooths(markedBooths) {
    dispatch(setMarkedBooths(markedBooths, true));
  },
  clearMarkedBooths() {
    dispatch(clearMarkedBooths());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormFields);
