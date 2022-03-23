import { combineReducers } from "redux";
import metamask from "./metamask";
import users from "./user";
import nfts from "./nft";
// import celeb from "./celebs"
import celeb from "./getcelebs"
import auth from "./auth"

export default combineReducers({
    metamask,
    users,
    nfts,
    celeb,
    auth,
});
