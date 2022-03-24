import React,{useState} from 'react';
import {Link,useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import { connect, useSelector } from "react-redux";
import {TextField, FormControl, InputLabel, NativeSelect, Button, Select, MenuItem} from "@mui/material";
import Paperbase from '../components/Landing/Paperbase';
import styles from "./Tempcelebs.module.css";
import { updateCeleb } from '../actions/celebs';

const UpdateCeleb=({ updateCeleb, token })=>{
  let navigate = useNavigate();
  const [name,setName] = useState('');
  const [tier,setTier] = useState("Tier-1");
  const [category,setCategory] = useState("Sports");
  let { id } = useParams();

  const nameHandler=(e)=>{
    setName(e.target.value);
  }
  const tierHandler=(e)=>{
    setTier(e.target.value);
  }

  const categoryHandler=(e)=>{
    setCategory(e.target.value);
  }

  const submitHandler=async(e)=>{
    e.preventDefault();
    await updateCeleb(token, id, name,tier,category);
    navigate("/allceleb");
    // window.alert("Celeb updated successfully!")
    setName('');
    setTier("Tier-1");
    setCategory("Sports")
  }
  return(
    <Paperbase>
      <div className={styles.form}>
        <div className={styles.name}>
          <TextField id="standard-basic" label="Name" onChange={nameHandler} variant="standard" />
        </div>
        <div className={styles.categories}>
          <FormControl variant="standard">
          <InputLabel id="category">Category</InputLabel>
            <Select
              defaultValue="Sports"
              onChange={categoryHandler}
              labelId="category"
              id="demo-simple-select-standard"
            >
              <MenuItem value="Sports">Sports</MenuItem>
              <MenuItem value="Art">Art</MenuItem>
              <MenuItem value="Photography">Photography</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={styles.tier}>
          <FormControl variant="standard">
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Tier
            </InputLabel>
            <Select
              defaultValue="Tier-1"
              onChange={tierHandler}
            >
                    <MenuItem value="Tier-1">Tier-1</MenuItem>
                    <MenuItem value="Tier-2">Tier-2</MenuItem>
                    <MenuItem value="Tier-3">Tier-3</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className={styles.btn_container}>
                 <Button onClick={submitHandler} className={styles.btn}>Update</Button> 
              </div>
            </div>
    </Paperbase>
  );
}

const mapStateToProps = (state) => ({
    token: state.auth.jwt_token
});

const mapDispatchToProps = {
    updateCeleb
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateCeleb);


    