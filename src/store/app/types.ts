import { Cluster, MarkedBooths } from '@models/Booth';
import Circle, { CircleData } from '@models/Circle';
import { BoothMapping, CircleMapping } from '@models/Mapped';
import { SearchView } from '@models/Search';

export interface AppState {
  markedBooths: MarkedBooths;
  displayCircleName: boolean;
  circles: Circle[];
  clusters: Cluster[];
  boothMapping: BoothMapping;
  circleMapping: CircleMapping;

  isSearching: boolean;
  searchView?: SearchView;
}

export const UPDATE_CIRCLES = Symbol();
export const MARK_BOOTH = Symbol();
export const UNMARK_BOOTH = Symbol();
export const TOGGLE_MARK_BOOTH = Symbol();
export const SET_MARKED_BOOTHS = Symbol();
export const CLEAR_MARKED_BOOTHS = Symbol();
export const TOGGLE_DISPLAY_CIRCLE_NAME = Symbol();
export const SET_IS_SEARCHING = Symbol();
export const PUSH_SEARCH_VIEW = Symbol();
export const CLEAR_SEARCH_VIEW = Symbol();

interface UpdateCirclesAction {
  type: typeof UPDATE_CIRCLES;
  circles: CircleData[];
}

interface MarkBoothAction {
  type: typeof MARK_BOOTH;
  boothNumber: string;
}

interface UnmarkBoothAction {
  type: typeof UNMARK_BOOTH;
  boothNumber: string;
}

interface ToggleMarkBoothAction {
  type: typeof TOGGLE_MARK_BOOTH;
  boothNumber: string;
}

interface SetMarkedBoothsAction {
  type: typeof SET_MARKED_BOOTHS;
  markedBooths: MarkedBooths;
  isSearching?: boolean;
}

interface ClearMarkedBoothsAction {
  type: typeof CLEAR_MARKED_BOOTHS;
}

interface ToggleDisplayCircleName {
  type: typeof TOGGLE_DISPLAY_CIRCLE_NAME;
}

interface SetIsSearching {
  type: typeof SET_IS_SEARCHING;
  isSearching: boolean;
}

interface PushSearchView {
  type: typeof PUSH_SEARCH_VIEW;
  searchView: SearchView;
}

interface ClearSearchView {
  type: typeof CLEAR_SEARCH_VIEW;
}

export type AppActionTypes =
  UpdateCirclesAction |
  MarkBoothAction |
  UnmarkBoothAction |
  ToggleMarkBoothAction |
  SetMarkedBoothsAction |
  ClearMarkedBoothsAction |
  ToggleDisplayCircleName |
  SetIsSearching |
  PushSearchView |
  ClearSearchView;

export type AppReducer<T extends AppActionTypes> = (state: AppState, action: T) => AppState|boolean;

export interface AppReducers {
  [UPDATE_CIRCLES]: AppReducer<UpdateCirclesAction>;
  [MARK_BOOTH]: AppReducer<MarkBoothAction>;
  [UNMARK_BOOTH]: AppReducer<UnmarkBoothAction>;
  [TOGGLE_MARK_BOOTH]: AppReducer<ToggleMarkBoothAction>;
  [SET_MARKED_BOOTHS]: AppReducer<SetMarkedBoothsAction>;
  [CLEAR_MARKED_BOOTHS]: AppReducer<ClearMarkedBoothsAction>;
  [TOGGLE_DISPLAY_CIRCLE_NAME]: AppReducer<ToggleDisplayCircleName>;
  [SET_IS_SEARCHING]: AppReducer<SetIsSearching>;
  [PUSH_SEARCH_VIEW]: AppReducer<PushSearchView>;
  [CLEAR_SEARCH_VIEW]: AppReducer<ClearSearchView>;
}
