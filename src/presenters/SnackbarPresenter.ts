import { BehaviorSubject, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

export interface SnackbarContent {
  message: string;
  action: string;
}

export interface SnackbarTask {
  message: string;
  action: string;
  callback: (result: boolean) => void;
}

export default class SnackbarPresenter {
  public get shown() {
    return this.shownSubject.value;
  }

  public get content() {
    return this.contentSubject.value;
  }

  private readonly resultSubject = new Subject<boolean>();
  private readonly shownSubject = new BehaviorSubject(false);
  private readonly contentSubject = new BehaviorSubject<SnackbarContent>({
    message: '',
    action: '',
  });

  private queue: SnackbarTask[] = [];

  public confirm(message: string, action?: string) {
    return this.show(message, action || 'OK');
  }

  public show(message: string, action?: string) {
    return new Promise<boolean>(callback => {
      this.schedule({ message, action, callback });
    });
  }

  public result(result: boolean) {
    this.resultSubject.next(result);
    this.close();
  }

  public close() {
    this.shownSubject.next(false);
  }

  public onShown(handler: (shown: boolean) => void) {
    return this.shownSubject.subscribe(handler);
  }

  public onContent(handler: (content: SnackbarContent) => void) {
    return this.contentSubject.subscribe(handler);
  }

  private schedule(task: SnackbarTask) {
    const queueWasEmpty = this.queue.length <= 0;
    this.queue.push(task);
    if (queueWasEmpty) {
      this.run(task);
    }
  }

  private run({ message, action, callback }: SnackbarTask) {
    const subscriber = this.resultSubject.pipe(first()).subscribe(result => {
      callback(result);
      subscriber.unsubscribe();
      this.queue.shift();
      if (this.queue.length > 0) {
        setTimeout(() => this.run(this.queue[0]), 500);
      }
    });
    this.contentSubject.next({ message, action });
    this.shownSubject.next(true);
  }
}
