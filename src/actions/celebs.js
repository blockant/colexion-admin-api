import axios from "axios";
import { ADD_CELEB,DELETE_CELEB,UPDATE_CELEB,ALL_CELEBS,NO_ACTION, ERROR } from "./types";

// Add celebs
export const addCeleb = (token,name, tier, category, email) => async (dispatch) => {
    const body = JSON.stringify({ name, tier, category, email });
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/celeb`, body, config);
        // console.log(res);
        // dispatch({
        //     type: ADD_CELEB,
        //     payload: res.data.celeb
        // });
    } catch (err) {
        console.log(err)
        dispatch({
            type: ERROR,
            payload: err.response.data
        })
    }
};

export const getAllCelebs = (token, page, limit) => async (dispatch) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
            params: {
                paginate: false
            }
        }
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/celeb`,config);
        console.log(res);
        dispatch({
            type: ALL_CELEBS,
            payload: res.data.foundCelebs
        });
        return res.data.foundCelebs;
    } catch (err) {
        console.log(err)
        dispatch({ type: NO_ACTION });
    }
}

export const deleteCeleb =(token, id) => async(dispatch) =>{
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        };

        await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/celeb/${id}`, config);
        config.params={
            paginate: false
        }
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/celeb`,config);
        console.log(res);
        dispatch({
            type: ALL_CELEBS,
            payload: res.data.foundCelebs
        });
    } catch (err) {
        console.log(err)
        dispatch({
            type: ERROR,
            payload: err.response.data
        })
    }
}

export const updateCeleb =(token, id, name, tier, category) => async(dispatch) =>{
    console.log(token, id, name, tier, category);
    const body = JSON.stringify({ name, tier, category });
    console.log(id);
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        };

        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/celeb/${id}`, body, config);
        console.log(res);
        // navigate("/allceleb");

        // dispatch({
        //     type: UPDATE_CELEB,
        //     payload: res
        // });
    } catch (err) {
        console.log(err)
        dispatch({
            type: ERROR,
            payload: err.response.data
        })
    }
}