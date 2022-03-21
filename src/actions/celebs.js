import axios from "axios";
import { ADD_CELEB,ALL_CELEBS,NO_ACTION, ERROR } from "./types";

// Add celebs
export const addCeleb = (name, tier, category) => async (dispatch) => {
    const body = JSON.stringify({ name, tier, category });
    console.log(name, tier, category);

    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            },
        };

        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/celeb`, body, config);
        console.log(res);
        dispatch({
            type: ADD_CELEB,
            payload: res.data.celeb
        });
    } catch (err) {
        console.log(err)
        dispatch({
            type: ERROR,
            payload: err.response.data
        })
    }
};

export const getAllCelebs = (page, limit) => async (dispatch) => {
    try {
        const params = {
            page: 1,
            limit: 1000,
            paginate: 'false'
        }
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/celeb`, { params: params });
        console.log(res);
        dispatch({
            type: ALL_CELEBS,
            payload: res.data.foundCelebs
        });
        return res.data.foundCelebs.docs;
    } catch (err) {
        console.log(err)
        dispatch({ type: NO_ACTION });
    }
}
