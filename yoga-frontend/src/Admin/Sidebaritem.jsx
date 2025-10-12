import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
const SidebarItem = ({ name, icon, path, active, handleClick }) => {
  const navigate = useNavigate();
  const onClick = () => {
    navigate(path);
    if (handleClick) {
      handleClick();
    }
  };
  return (
    <ListItem
      button
      onClick={onClick}
      sx={{
        backgroundColor: active ? "#307FCE" : "transparent",
        color: active ? "#fff" : "#000",
        "&:hover": {
          backgroundColor: active ? "#307FCE" : "#f0f0f0",
        },
        borderRadius: 1,
        mx: 1,
        my: 0.5,
        borderBottom: "1px solid #ccc",
      }}
    >
      <ListItemIcon sx={{ color: active ? "#fff" : "#000" }}>
        {icon}
      </ListItemIcon>
      <ListItemText primary={name} />
    </ListItem>
  );
};

export default SidebarItem;
