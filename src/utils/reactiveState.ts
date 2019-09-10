import { Component } from 'react';

export default function reactiveState<T>(component: Component<any, T>): T {
  return new Proxy({}, {
    get() {
      throw new Error('Reactive state should only be used to update the state');
    },
    set(_, key, value) {
      component.setState({ [key]: value } as Pick<T, keyof T>);
      return true;
    },
  }) as T;
}
