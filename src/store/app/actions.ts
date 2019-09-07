import { MarkedBooths } from '@models/Booth';
import { SearchView } from '@models/Search';
import {
  AppActionTypes,
  CLEAR_MARKED_BOOTHS, CLEAR_SEARCH_VIEW,
  MARK_BOOTH, PUSH_SEARCH_VIEW,
  SET_IS_SEARCHING, SET_MARKED_BOOTHS,
  TOGGLE_DISPLAY_CIRCLE_NAME, TOGGLE_MARK_BOOTH, UNMARK_BOOTH,
} from '@store/app/types';

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
