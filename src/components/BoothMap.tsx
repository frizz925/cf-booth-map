import * as React from 'react';
import catalog from '../data/catalog.json';
import mapping from '../data/mapping.json';
import parseBoothMap from '../utils/parseBoothMap';

export default class BoothMap extends React.Component {
  public render() {
    console.log(catalog);
    console.log(mapping);
    console.log(parseBoothMap(mapping));
    return null;
  }
}
