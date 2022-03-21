import { combineReducers } from "redux";
import metamask from "./metamask";
import users from "./user";
import nfts from "./nft";
import celeb from "./celebs"
import allcelebs from "./getcelebs"

export default combineReducers({
    metamask,
    users,
    nfts,
    celeb,
    allcelebs,
});
