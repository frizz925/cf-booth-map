import Circle from '@models/Circle';
import CircleRepository from '@repositories/CircleRepository';
import { BehaviorSubject, Subject } from 'rxjs';

export default class SearchPresenter {
  public readonly shown = new BehaviorSubject(true);
  public readonly focused = new BehaviorSubject(false);
  public readonly circle = new BehaviorSubject<Circle | undefined>(undefined);
  public readonly action = new Subject();

  private readonly repository: CircleRepository;

  constructor(repository: CircleRepository) {
    this.repository = repository;
  }

  public search(query: string) {
    return this.repository.find(query);
  }

  public select(circle: Circle) {
    this.focused.next(false);
    this.circle.next(circle);
  }
}
