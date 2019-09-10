import { MarkedBooths } from '@models/Booth';
import Circle, { CircleData } from '@models/Circle';
import { SearchView } from '@models/Search';
import {
  AppActionTypes,
  CLEAR_MARKED_BOOTHS, CLEAR_SEARCH_VIEW,
  CLOSE_DRAWER, MARK_BOOTH,
  OPEN_DRAWER, PREVIEW_CIRCLE,
  PREVIEW_CIRCLE_CLOSE, PUSH_SEARCH_VIEW,
  SET_IS_SEARCHING, SET_MARKED_BOOTHS,
  TOGGLE_DISPLAY_CIRCLE_NAME, TOGGLE_MARK_BOOTH,
  UNMARK_BOOTH, UPDATE_CIRCLES,
} from '@store/app/types';

export const updateCircles = (circles: CircleData[]): AppActionTypes => ({
  type: UPDATE_CIRCLES,
  circles,
});

export const markBooth = (boothNumber: string): AppActionTypes => ({
  type: MARK_BOOTH,
  boothNumber,
});

export const unmarkBooth = (boothNumber: string): AppActionTypes => ({
  type: UNMARK_BOOTH,
  boothNumber,
});

export const toggleMarkBooth = (boothNumber: string): AppActionTypes => ({
  type: TOGGLE_MARK_BOOTH,
  boothNumber,
});

export const setMarkedBooths = (markedBooths: MarkedBooths, isSearching?: boolean): AppActionTypes => ({
  type: SET_MARKED_BOOTHS,
  markedBooths,
  isSearching,
});

export const clearMarkedBooths = (): AppActionTypes => ({
  type: CLEAR_MARKED_BOOTHS,
});

export const toggleDisplayCircleName = (): AppActionTypes => ({
  type: TOGGLE_DISPLAY_CIRCLE_NAME,
});

export const setIsSearching = (isSearching: boolean): AppActionTypes => ({
  type: SET_IS_SEARCHING,
  isSearching,
});

export const pushSearchView = (searchView: SearchView): AppActionTypes => ({
  type: PUSH_SEARCH_VIEW,
  searchView,
});

export const clearSearchView = (): AppActionTypes => ({
  type: CLEAR_SEARCH_VIEW,
});

export const previewCircle = (circle: Circle): AppActionTypes => ({
  type: PREVIEW_CIRCLE,
  circle,
});

export const previewCircleClose = (): AppActionTypes => ({
  type: PREVIEW_CIRCLE_CLOSE,
});

export const openDrawer = (): AppActionTypes => ({
  type: OPEN_DRAWER,
});

export const closeDrawer = (): AppActionTypes => ({
  type: CLOSE_DRAWER,
});
