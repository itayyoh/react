// Navbar.js
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useState } from "react";
import Searchbar from "./Searchbar";
import { Link, useResolvedPath } from "react-router-dom";
import { GeneralContext } from "../App";

export const RoleTypes = {
  none: 0,
  user: 1,
  business: 2,
  admin: 3,
};

export const checkPermissions = (permissions, UserRoleType) => {
  return permissions.includes(UserRoleType);
};

const pages = [
  {
    route: "/cards/favorite",
    title: "Fav Cards",
    permissions: [RoleTypes.user, RoleTypes.business, RoleTypes.admin],
  },
  {
    route: "/business/cards",
    title: "My Cards",
    permissions: [RoleTypes.business, RoleTypes.admin],
  },
  {
    route: "/admin/clients",
    title: "Client Management",
    permissions: [RoleTypes.admin],
  },
  { route: "/login", title: "Login", permissions: [RoleTypes.none] },
  { route: "/signup", title: "Signup", permissions: [RoleTypes.none] },
];

const settings = [
  {
    route: "/account",
    title: "Account",
    permissions: [RoleTypes.user, RoleTypes.business, RoleTypes.admin],
  },
];

export default function Navbar() {
  const { user, roleType, navigate, setUser, setRoleType, setLoading } =
    useContext(GeneralContext);
  const path = useResolvedPath().pathname;

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = () => {
    setLoading(true);

    fetch(`https://api.shipap.co.il/clients/logout`, {
      credentials: "include",
    })
      .then(() => {
        setUser();
        setRoleType(RoleTypes.none);
        navigate("/");
      })
      .finally(() => setLoading(false));

    handleCloseUserMenu();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1e1e1e" }}>
      <Container maxWidth="100%">
        <Toolbar disableGutters>
          {/* Logo text Medium */}
          <Link to="/" style={{ textDecoration: "none", color: "White" }}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                marginRight: 4,
                display: { xs: "none", md: "flex" },
                fontFamily: "'Roboto', sans-serif",
                fontSize: "40px",
                fontWeight: 600,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Logo
            </Typography>
          </Link>

          {/* Hamburger */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages
                .filter(
                  (p) =>
                    !p.permissions || checkPermissions(p.permissions, roleType)
                )
                .map((page) => (
                  <Link
                    to={page.route}
                    key={page.route}
                    style={{ textDecoration: "none", color: "initial" }}
                  >
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page.title}</Typography>
                    </MenuItem>
                  </Link>
                ))}
            </Menu>
          </Box>

          {/* logo for small */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => navigate("/")}
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "flex", md: "none" },
              fontFamily: "'Roboto', sans-serif",
              fontSize: "40px",
              fontWeight: 600,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Logo
          </Typography>

          {/* links */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages
              .filter(
                (p) =>
                  !p.permissions || checkPermissions(p.permissions, roleType)
              )
              .map((page) => (
                <Link
                  to={page.route}
                  key={page.route}
                  style={{ textDecoration: "none", color: "initial" }}
                >
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{
                      my: 2,
                      color: "white",
                      display: "block",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: 500,
                      fontSize: "16px",
                      ml: 1.5,
                      variant: page.route === path ? "contained" : "",
                      backgroundColor: page.route === path ? "#3583d0" : "",
                    }}
                  >
                    {page.title}
                  </Button>
                </Link>
              ))}
          </Box>

          {/* searchbar */}
          <Searchbar />

          {/* R circle icon */}
          {user && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <Link
                    to={setting.route}
                    key={setting.route}
                    style={{ textDecoration: "none", color: "initial" }}
                  >
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">
                        {setting.title}
                      </Typography>
                    </MenuItem>
                  </Link>
                ))}
                <Link
                  to="/"
                  style={{ textDecoration: "none", color: "initial" }}
                  onClick={logout}
                >
                  <MenuItem>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Link>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
