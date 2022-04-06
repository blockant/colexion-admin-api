import { combineReducers } from "redux";
import metamask from "./metamask";
import users from "./user";
import nfts from "./nft";
// import celeb from "./celebs"
import celebs from "./celebs"
import auth from "./auth"

export default combineReducers({
    metamask,
    users,
    nfts,
    celebs,
    auth,
});
