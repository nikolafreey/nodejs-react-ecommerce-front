import { LOGGED_IN_USER, LOGGED_OUT } from "../actionTypes/userActionTypes";

export const userReducer = (state = null, action) => {
  switch (action.type) {
    case LOGGED_IN_USER:
      return action.payload;
    case LOGGED_OUT:
      return action.payload;
    default:
      return state;
  }
};
