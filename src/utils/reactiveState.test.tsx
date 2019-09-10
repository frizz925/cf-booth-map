import * as React from 'react';
import { create } from 'react-test-renderer';
import reactiveState from './reactiveState';

interface MockState {
  value: number;
}

class MockComponent extends React.Component<{}, MockState> {
  private reactiveState: MockState;
  private handleClick: () => void;

  constructor(props: {}) {
    super(props);
    this.state = {
      value: 0,
    };
    this.reactiveState = reactiveState(this);
    this.handleClick = () => {
      this.reactiveState.value = 1;
    };
  }

  public render() {
    return <button onClick={this.handleClick}>{this.state.value}</button>;
  }
}

it('should be able to update state via proxy', () => {
  const component = create(<MockComponent />);
  const instance = component.root;
  const button = instance.findByType('button');
  expect(button.props.children).toBe(0);
  button.props.onClick();
  expect(button.props.children).toBe(1);
});
