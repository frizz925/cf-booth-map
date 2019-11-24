import Circle from '@models/Circle';
import parseCircle, { RawCircle } from '@models/parsers/parseCircle';
import { observable } from 'mobx';

export default class CircleRepository {
  @observable
  public store: Circle[] = [];

  public fetch() {
    import('@data/circles.json').then((circles: RawCircle[]) => {
      const parsed = circles
        .map(circle => parseCircle(circle))
        .sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
      this.store.push(...parsed);
    });
  }
}
