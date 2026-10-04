import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import SidebarItem from "./Sidebaritem";

const drawerWidth = 280;

export default function DashboardSidebar({ menuItems, open, setOpen }) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", py: 1.5 }}>
      <Box sx={{ px: 2.5, pt: 1, pb: 1.5 }}>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
          Navigation Menu
        </span>
      </Box>

      <List 
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          px: 0.5,
          py: 0,
          "&::-webkit-scrollbar": {
            width: "5px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#e2e8f0",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#cbd5e1",
          },
        }}
      >
        {menuItems.map((item) => (
          <SidebarItem
            key={item.name}
            name={item.name}
            icon={item.icon}
            path={item.path}
            active={location.pathname.includes(item.path)}
            handleClick={isMobile ? () => setOpen(false) : null}
          />
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Permanent drawer for md+ screens */}
      <Box sx={{ width: drawerWidth, flexShrink: 0, display: { xs: "none", md: "block" } }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              top: "64px",
              height: "calc(100vh - 64px)",
              boxSizing: "border-box",
              borderRight: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              boxShadow: "2px 0 8px rgba(0, 0, 0, 0.02)",
              zIndex: 30,
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
        sx={{
          display: { xs: "block", md: "none" },
          zIndex: 99999,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#ffffff",
            paddingTop: "8px",
            overflowY: "auto",
            zIndex: 99999,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
