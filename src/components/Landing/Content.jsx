import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import ConnectMetamask from "./ConnectMetamask";
import { connect } from "react-redux";
import ApproveToken from "./ApproveToken";
import StickyHeadTable from "../MUI/StickyHeadTable";
function Content({ isMetaMaskConnected, metaMaskAddress, table }) {
  return (
    
    <Grid container spacing={2}>
      <Grid item xs={12}>
      
        {isMetaMaskConnected ? (
              <>
                <ApproveToken></ApproveToken>
              </>
            ) : (
              <><ConnectMetamask></ConnectMetamask></>
            )}
          <Typography color="text.secondary" align="right">
          </Typography>
        
      </Grid>
      <Grid item xs={12} style={{ maxHeight: 0}}>
        <Paper sx={{ margin: "auto" }}>
          <Typography
            sx={{ my: 5, mx: 2 }}
            color="text.secondary"
            align="center"
          >
            {isMetaMaskConnected ? (
              <>
                <ApproveToken></ApproveToken>
              </>
            ) : (
              <></>
            )}
          </Typography>
            {table}
        </Paper>
      </Grid>
    </Grid>
  );
}
const mapStateToProps = (state) => ({
  isMetaMaskConnected: state.metamask.isMetaMaskConnected,
  metaMaskAddress: state.metamask.metaMaskAddress,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Content);
