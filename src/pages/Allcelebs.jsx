import React, {useEffect, useState} from 'react'
import { Button, FormControl, InputLabel, Select, TextField, MenuItem } from '@mui/material'
import { connect, useSelector } from "react-redux";
import styles from "./Allcelebs.module.css";
import Paperbase from '../components/Landing/Paperbase';
import axios from "axios";
import StickyHeadTable from '../components/MUI/StickyHeadTable';
import {getAllCelebs} from '../actions/celebs'
import auth from '../reducers/auth';
import {Link} from 'react-router-dom'
import {deleteCeleb} from '../actions/celebs'
import {updateCeleb} from "../actions/celebs"
import { makeStyles } from '@material-ui/core/styles';
import { 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Grid,
    Typography,
    TablePagination,
    TableFooter
 } from '@material-ui/core';

 const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 900,
    minHeight: 600
  },
  tableContainer: {
      borderRadius: 15,
      margin: '10px 10px',
      maxWidth: 1450
  },
  tableHeaderCell: {
      fontWeight: 'bold',
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.getContrastText(theme.palette.primary.dark)
  },
  avatar: {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.getContrastText(theme.palette.primary.light)
  },
  name: {
      fontWeight: 'bold',
      color: theme.palette.secondary.dark
  },
  status: {
      fontWeight: 'bold',
      fontSize: '0.75rem',
      color: 'white',
      backgroundColor: 'grey',
      borderRadius: 8,
      padding: '3px 10px',
      display: 'inline-block'
  }
}));

const  Allcelebs =({token, getAllCelebs, deleteCeleb, updateCeleb})=> {
  
const [celebList, setCelebList] = useState([]);
const classes = useStyles();
const [page, setPage] = React.useState(0);
const [rowsPerPage, setRowsPerPage] = React.useState(5);

const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(+event.target.value);
  setPage(0);
};
const deleteceleb = async (id)=>{
  try {
      console.log(id);
  const response = await deleteCeleb(token, id);
      console.log(response);
      const newp =celebList.filter(celeb => id!==celeb._id);
      setCelebList(newp);
  } catch (err) {
      console.log(err);
  }
};

const updateceleb = async (id)=>{
  try {
      console.log(id);
  const response = await updateCeleb(token, id);
      console.log(response);
     
      // setCelebList(newp);
  } catch (err) {
      console.log(err);
  }
};

useEffect(() => {
    async function fetchUsers() {
        console.log(token);
        const res = await getAllCelebs(token);
        console.log(res);
        setCelebList(res);
    }
    fetchUsers()
}, [getAllCelebs])

  return (
    <Paperbase>
    <TableContainer component={Paper} className={classes.tableContainer}>
    <Table className={classes.table} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell className={classes.tableHeaderCell}>Name</TableCell>
          <TableCell className={classes.tableHeaderCell}>Tier</TableCell>
          <TableCell className={classes.tableHeaderCell}>Category</TableCell>
          <TableCell className={classes.tableHeaderCell}>Delete</TableCell>
          <TableCell className={classes.tableHeaderCell}>Update</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {celebList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((celeb) => (
          <TableRow key={celeb._id}>
            <TableCell>
                <Grid container>
                    <Grid item lg={2}>
                        <Avatar alt={celeb.name} src='.' className={classes.avatar}/>
                    </Grid>
                    <Grid item lg={10}>
                        <Typography className={classes.name}>{celeb['name']}</Typography>
            
                    </Grid>
                </Grid>
              </TableCell>
            <TableCell>
                <Typography color="primary" variant="subtitle2">{celeb['tier']}</Typography>
                {/* <Typography color="textSecondary" variant="body2">{row.company}</Typography> */}
              </TableCell>
            <TableCell>{celeb['category']}</TableCell>
              <TableCell>
              <Button color="primary" onClick={()=>deleteceleb(celeb._id)}variant="contained">Delete</Button>
              </TableCell>
              <TableCell>
            <Link to={`/update/${celeb._id}`}><Button color="primary" variant="contained">Update</Button></Link>
              </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
      <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={celebList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      </TableFooter>
    </Table>
  </TableContainer>
  </Paperbase>
  )
}

const mapStateToProps = (state) => ({
  token: state.auth.jwt_token
});

const mapDispatchToProps = {
    getAllCelebs,
    deleteCeleb,
    updateCeleb
}

export default connect(mapStateToProps, mapDispatchToProps)(Allcelebs);