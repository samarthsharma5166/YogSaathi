import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import SidebarItem from "./Sidebaritem";

const drawerWidth = 300;

export default function DashboardSidebar({ menuItems, open, setOpen }) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const drawerContent = (
    <List sx={{
      overflowY: "scroll",
      overflowX: "hidden",
      paddingBottom:"100px",
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "rgba(0,0,0,0.1)", // Track color (optional)
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#808080",  // ✅ Green scrollbar thumb
        borderRadius: "8px",
      },
      "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "rgb(0, 150, 0)",  // Darker green on hover
      },
    }}>
      {menuItems.map((item) => (
        <SidebarItem
          key={item.name}
          name={item.name}
          icon={item.icon}
          path={item.path}
          active={location.pathname === item.path}
          handleClick={isMobile ? () => setOpen(false) : null}
        />
      ))}
    </List>
  );

  return (
    <>
      {/* Permanent drawer for md+ screens */}
      <Box sx={{ display: { xs: "none", md: "block" }, }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
           
              marginTop: "6.4rem",
              // height: "calc(100% - 94px)", 
              borderRight: "none",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Temporary drawer for mobile */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        style={{zIndex: 99999}}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            paddingTop: "2px",
            overflowY: "auto",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
