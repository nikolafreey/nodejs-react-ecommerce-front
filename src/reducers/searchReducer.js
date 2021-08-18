import { SEARCH_QUERY } from "../actionTypes/searchActionTypes";

export const searchReducer = (state = { text: "" }, action) => {
  switch (action.type) {
    case SEARCH_QUERY:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
