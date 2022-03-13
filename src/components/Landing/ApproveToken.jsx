import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// prettier-ignore
import {Box,Button,Modal,Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Typography} from "@mui/material";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const ApprooveToken = ({isMetaMaskConnected,metaMaskAddress,vestData}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true)
  };
  const handleClose = () => setOpen(false);
  return (
    <></>
  );
};
ApprooveToken.propTypes = {};
const mapStateToProps = (state) => ({
  isMetaMaskConnected: state.metamask.isMetaMaskConnected,
  metaMaskAddress: state.metamask.metaMaskAddress,
});
const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(ApprooveToken);
