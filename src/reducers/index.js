import { combineReducers } from "redux";
import metamask from "./metamask";
import users from "./user";
export default combineReducers({
    metamask,
    users
});
