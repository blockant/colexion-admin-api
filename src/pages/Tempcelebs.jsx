import * as React from 'react';
import {Link} from 'react-router-dom';
import {TextField, FormControl, InputLabel, NativeSelect, Button} from "@mui/material";
import Paperbase from '../components/Landing/Paperbase';
import styles from "./Tempcelebs.module.css";

export default function Tempcelebs(){
  return(
    <Paperbase>
      <div className={styles.form}>
        <div className={styles.name}>
          <TextField id="standard-basic" label="Name" variant="standard" />
        </div>
        <div className={styles.categories}>
          <FormControl>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Category
            </InputLabel>
            <NativeSelect
              defaultValue={1}
            >
              <option value={1}>Sports</option>
              <option value={2}>Art</option>
              <option value={3}>Photography</option>
            </NativeSelect>
          </FormControl>
        </div>
        <div className={styles.tier}>
          <FormControl>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Tier
            </InputLabel>
            <NativeSelect
              defaultValue={1}
            >
                    <option value={1}>Tier-1</option>
                    <option value={2}>Tier-2</option>
                    <option value={3}>Tier-3</option>
                  </NativeSelect>
                </FormControl>
              </div>
              <div className={styles.btn}>
                <Link to="/allcelebs"> <Button variant="contained">Proceed</Button> </Link>
              </div>
            </div>
    </Paperbase>
  );
}




    