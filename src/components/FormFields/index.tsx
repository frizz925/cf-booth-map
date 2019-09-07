import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MarkedBooths } from '@models/Booth';
import { CircleMapping } from '@models/Mapped';
import { clearMarkedBooths, setMarkedBooths } from '@store/app/actions';
import { AppState } from '@store/app/types';
import Fuse, { FuseOptions } from 'fuse.js';
import React, { ChangeEvent, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Subject } from 'rxjs';
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

interface FormFieldsState {
  showClearButton: boolean;
}

const FormContainer = styled.div`
border-radius: 4px;
overflow: hidden;
`;

const FormLayout = styled.div`
display: table;
width: 100%;
`;

const FormField = styled.div`
display: table-cell;
vertical-align: top;
width: 100%;
`;

const MainInput = styled.input`
display: block;
color: inherit;
border: none;
box-sizing: border-box;
padding: 12px 0 12px 18px;
width: 100%;
outline: 0;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
display: block;
color: rgba(0,0,0,0.6);
padding: 12px 18px;
cursor: pointer;
`;

class FormFields extends PureComponent<FormFieldsProps, FormFieldsState> {
  private onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  private fuse: Fuse<SimpleCircle>;
  private subject: Subject<string>;

  private inputRef = React.createRef<HTMLInputElement>();
  private clearRef = React.createRef<HTMLDivElement>();
  private onClear: () => void;

  constructor(props: FormFieldsProps) {
    super(props);
    this.state = {
      showClearButton: false,
    };

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
    this.subject = new Subject();
    this.onChange = (evt) => {
      this.subject.next(evt.target.value);
    };
    this.onClear = () => {
      this.inputRef.current.value = '';
      this.setState({
        showClearButton: false,
      });
      this.props.clearMarkedBooths();
    };

    this.subject.pipe(debounceTime(500)).subscribe((search) => {
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
    });

    this.subject.subscribe((search) => {
      this.setState({
        showClearButton: !!search,
      });
    });
  }

  public componentDidMount() {
    this.clearRef.current.addEventListener('click', this.onClear);
  }

  public componentWillUnmount() {
    this.clearRef.current.removeEventListener('click', this.onClear);
  }

  public render() {
    const { showClearButton } = this.state;
    return (
      <FormContainer className='form-fields'>
        <FormLayout>
          <FormField>
            <MainInput ref={this.inputRef} type='text' placeholder='Search for circle' onChange={this.onChange} />
          </FormField>
          <FormField ref={this.clearRef} style={{ display: showClearButton ? 'table-cell' : 'none' }}>
            <StyledFontAwesomeIcon icon={faTimes} />
          </FormField>
        </FormLayout>
      </FormContainer>
    );
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
