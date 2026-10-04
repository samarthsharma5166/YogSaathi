import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";

const SidebarItem = ({ name, icon, path, active, handleClick }) => {
  const navigate = useNavigate();
  const isLogout = path === "logout" || name?.toLowerCase() === "logout";

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
        borderRadius: "12px",
        mx: 1.5,
        my: 0.5,
        px: 2,
        py: 1.1,
        width: "auto",
        transition: "all 0.18s ease-in-out",
        background: active 
          ? "linear-gradient(135deg, #059669 0%, #10b981 100%)" 
          : "transparent",
        color: active ? "#ffffff" : isLogout ? "#dc2626" : "#334155",
        boxShadow: active ? "0 4px 12px rgba(16, 185, 129, 0.28)" : "none",
        "&:hover": {
          background: active 
            ? "linear-gradient(135deg, #047857 0%, #059669 100%)" 
            : isLogout
              ? "#fef2f2"
              : "#f0fdf4",
          color: active ? "#ffffff" : isLogout ? "#b91c1c" : "#065f46",
          transform: "translateX(2px)",
          "& .MuiListItemIcon-root": {
            color: active ? "#ffffff" : isLogout ? "#dc2626" : "#059669",
          }
        },
      }}
    >
      <ListItemIcon 
        sx={{ 
          minWidth: 36,
          color: active ? "#ffffff" : isLogout ? "#ef4444" : "#64748b",
          fontSize: "1.15rem",
          display: "flex",
          alignItems: "center",
          transition: "color 0.18s ease-in-out"
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText 
        primary={name} 
        primaryTypographyProps={{
          fontSize: "0.85rem",
          fontWeight: active ? 700 : 500,
          letterSpacing: "0.01em",
          lineHeight: 1.3
        }}
      />
      {active && (
        <span style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          marginLeft: "8px"
        }} />
      )}
    </ListItem>
  );
};

export default SidebarItem;
