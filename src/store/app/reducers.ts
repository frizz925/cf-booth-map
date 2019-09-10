import mapping from '@data/mapping.json';
import Circle from '@models/Circle';
import {
  AppActionTypes, AppReducers, AppState,
  CLEAR_MARKED_BOOTHS, CLEAR_SEARCH_VIEW, CLOSE_DRAWER,
  MARK_BOOTH, OPEN_DRAWER, PREVIEW_CIRCLE,
  PREVIEW_CIRCLE_CLOSE, PUSH_SEARCH_VIEW,
  SET_IS_SEARCHING, SET_MARKED_BOOTHS,
  TOGGLE_DISPLAY_CIRCLE_NAME, TOGGLE_MARK_BOOTH,
  UNMARK_BOOTH, UPDATE_CIRCLES,
} from '@store/app/types';
import mapCircleBooth from '@utils/mapCircleBooth';
import parseBoothMap from '@utils/parseBoothMap';
import parseCircles from '@utils/parseCircles';
import { assign } from 'lodash';

const isSunday = new Date().getDay() === 0;
const initialState: AppState = {
  markedBooths: {},
  displayCircleName: true,
  circles: [],
  clusters: [],
  boothMapping: {},
  circleMapping: {},
  isSearching: false,
  previewShown: false,
  drawerShown: false,
};

const reducers: AppReducers = {
  [UPDATE_CIRCLES]: (state, { circles }) => {
    const clusters = parseBoothMap(mapping);
    const filteredCircles = parseCircles(circles)
      .filter((x: Circle) => isSunday ? x.isSunday : x.isSaturday);
    const { byBooths, byCircles } = mapCircleBooth(clusters, filteredCircles);

    state.circles = filteredCircles;
    state.clusters = clusters;
    return assign(state, {
      clusters,
      circles: filteredCircles,
      boothMapping: byBooths,
      circleMapping: byCircles,
    });
  },
  [MARK_BOOTH]: (state, { boothNumber, cluster }) => {
    const { markedBooths } = state;
    if (markedBooths[boothNumber]) {
      return false;
    }
    markedBooths[boothNumber] = cluster;
    return state;
  },
  [UNMARK_BOOTH]: (state, { boothNumber }) => {
    const { markedBooths } = state;
    if (!markedBooths[boothNumber]) {
      return false;
    }
    delete markedBooths[boothNumber];
    return state;
  },
  [TOGGLE_MARK_BOOTH]: (state, { boothNumber, cluster }) => {
    const { markedBooths } = state;
    if (markedBooths[boothNumber]) {
      delete markedBooths[boothNumber];
    } else {
      markedBooths[boothNumber] = cluster;
    }
    return state;
  },
  [SET_MARKED_BOOTHS]: (state, { markedBooths, isSearching }) => {
    if (isSearching !== undefined) {
      state.isSearching = isSearching;
    }
    state.markedBooths = assign({}, markedBooths);
    return state;
  },
  [CLEAR_MARKED_BOOTHS]: (state) => {
    state.markedBooths = {};
    return state;
  },
  [TOGGLE_DISPLAY_CIRCLE_NAME]: (state) => {
    state.displayCircleName = !state.displayCircleName;
    return state;
  },
  [SET_IS_SEARCHING]: (state, { isSearching }) => {
    state.isSearching = isSearching;
    return state;
  },
  [PUSH_SEARCH_VIEW]: (state, { searchView }) => {
    if (!state.isSearching || state.searchView != null) {
      return false;
    }
    state.searchView = searchView;
    return state;
  },
  [CLEAR_SEARCH_VIEW]: (state) => {
    state.isSearching = false;
    state.searchView = undefined;
    return state;
  },
  [PREVIEW_CIRCLE]: (state, { circle }) => {
    state.previewCircle = circle;
    state.previewShown = true;
    return state;
  },
  [PREVIEW_CIRCLE_CLOSE]: (state) => {
    state.previewShown = false;
    return state;
  },
  [OPEN_DRAWER]: (state) => {
    state.drawerShown = true;
    return state;
  },
  [CLOSE_DRAWER]: (state) => {
    state.drawerShown = false;
    return state;
  },
};

function appReducer(state = initialState, action: AppActionTypes): AppState {
  const reducer = reducers[action.type];
  if (!reducer) {
    return state;
  }
  // HACK: Bypass the typecheck. Don't worry, I know what I'm doing(TM)
  const result = reducer(state, action as any);
  if (result !== false) {
    if (result === true) {
      return assign({}, state);
    }
    return assign({}, result);
  }
  return state;
}

export default appReducer;
