import Circle from '@models/Circle';
import parseCircle, { RawCircle } from '@models/parsers/parseCircle';
import map from 'lodash/map';
import { observable } from 'mobx';

export default class CircleRepository {
  @observable
  public store: Circle[] = [];

  public fetch() {
    import('@data/circles.json').then((circles: RawCircle[]) => {
      const parsed = map(circles, circle => parseCircle(circle));
      this.store.push(...parsed);
    });
  }
}
