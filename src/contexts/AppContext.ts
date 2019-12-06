import BookmarkRepository from '@repositories/BookmarkRepository';
import CircleRepository from '@repositories/CircleRepository';
import { createContext } from 'react';
import BookmarkObservable from 'src/observables/BookmarkObservable';

export interface AppContextType {
  repositories: {
    circle?: CircleRepository;
    bookmark?: BookmarkRepository;
  };
  observables: {
    bookmark?: BookmarkObservable;
  };
}

export default createContext<AppContextType>({
  repositories: {},
  observables: {},
});
