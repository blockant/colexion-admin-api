import React, {useEffect, useState} from 'react'
import { Button, FormControl, InputLabel, Select, TextField, MenuItem } from '@mui/material'
import { connect, useSelector } from "react-redux";
import styles from "./Allcelebs.module.css";
import Paperbase from '../components/Landing/Paperbase';
import axios from "axios";
import {getAllCelebs} from '../actions/celebs'
import auth from '../reducers/auth';
import {Link} from 'react-router-dom'
import {deleteCeleb} from '../actions/celebs'
import {updateCeleb} from "../actions/celebs"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const  Allcelebs =({token, getAllCelebs, deleteCeleb, updateCeleb})=> {
  
const [celebList, setCelebList] = useState([]);
const [page, setPage] = React.useState(0);
const [rowsPerPage, setRowsPerPage] = React.useState(5);

// const handleChangePage = (event, newPage) => {
//   setPage(newPage);
// };

// const handleChangeRowsPerPage = (event) => {
//   setRowsPerPage(+event.target.value);
//   setPage(0);
// };
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

function createData(id, name, tier, category, action) {
  return { id, name, tier, category, action };
}
const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

const rows = celebList.map(celeb => createData(celeb._id, celeb.name, celeb.tier, celeb.category, "update", "delete"));
  return (
    <Paperbase>
    <TableContainer component={Paper} className={styles.tableContainer}>
      <Table sx={{ minWidth: 650 }} >
        <TableHead>
          <TableRow>
            <TableCell className={styles.tableHeaderCell}>NAME</TableCell>
            <TableCell className={styles.tableHeaderCell}>TIER</TableCell>
            <TableCell className={styles.tableHeaderCell}>CATEGORY</TableCell>
            <TableCell className={styles.tableHeaderCell}>ACTION</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
            <TableRow
              key={row.id}
              className={styles.row}
            >
              <TableCell className={styles.table_text}>{row.name}</TableCell>
              <TableCell className={styles.table_text}>{row.tier}</TableCell>
              <TableCell className={styles.table_text}>{row.category}</TableCell>
              <TableCell className={styles.table_text}>
                <Link to={`/update/${row.id}`}><EditIcon className={styles.icon} /></Link>
                <DeleteIcon className={styles.icon} onClick={()=>deleteceleb(row.id)}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
    />
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