import { combineReducers } from "redux";
import metamask from "./metamask";
import users from "./user";
import nfts from "./nft";

export default combineReducers({
    metamask,
    users,
    nfts
});
