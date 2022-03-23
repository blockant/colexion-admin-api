import React from "react";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import {Link} from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PeopleIcon from "@mui/icons-material/People";
import ImageIcon from '@mui/icons-material/Image';
import { Navigate } from 'react-router-dom';

// import Accordion from '@mui/material/Accordion';
// import AccordionDetails from '@mui/material/AccordionDetails';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import Typography from '@mui/material/Typography';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const categories = [
  {
    id: "User",
    icon: <PeopleIcon />,
    children: [
      { id: "All User",
        href:"/users"
      },
      { id: "User Permissions" },
    ],
  },
  {
    id: "NFT",
    icon: <ImageIcon/>,
    children: [
      { id: "All NFT's" },
      { id: "Minted NFT's" },
      { id: "Mint NFT", href:"/nft/create" },
      { id: "NFT Sold" },
      { id: "Payments" },
    ],
  },
  {
    id: "Celebrity",
    icon: <PeopleIcon/>,
    children: [
      {
        id: "All Celebrities",
        href:"/allceleb"
      },
      {
        id: "Add Celebrity",
        href:"/addceleb"
      },
      {
        id: "Register to Platform",
        href:"/registerceleb"
      },
    ],
  },
];

const item = {
  py: "2px",
  px: 3,
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover, &:focus": {
    bgcolor: "rgba(255, 255, 255, 0.08)",
  },
};

const itemCategory = {
  boxShadow: "0 -1px 0 rgb(255,255,255,0.1) inset",
  py: 1.5,
  px: 3,
};

export default function Navigator(props) {
  const { ...other } = props;
  const navigationHandler=(href)=>{
    // console.log(event)
    // const href=event.value
    if(href){
      return <Navigate to={href} />;
    }
  }
  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem sx={{ ...item, ...itemCategory, fontSize: 22, color: "#fff" }}>
          Colexion Admin
        </ListItem>
        {categories.map(({ id, children, icon }) => (
          <Box key={id} sx={{ bgcolor: "#101F33" }}>
            {/*TODO: Add Accordian*/}
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: "#fff" }}>{id}</ListItemText>
              <ListItemIcon sx={{color: "#fff"}}>{icon}</ListItemIcon>
            </ListItem>
            {children.map(({ id: childId, href }) => (
              <ListItem disablePadding key={childId} onClick={()=>navigationHandler(href)}>
               <Link to={href   || '/'}> <ListItemButton sx={item}>
                <ListItemText>{childId}</ListItemText>
                  {/* <Link to={href || '/'}></Link> */}
                </ListItemButton> </Link>
               </ListItem>
            ))}

            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}
