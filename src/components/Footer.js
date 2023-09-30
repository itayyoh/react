import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useContext, useState } from 'react';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import { Link, useLocation } from 'react-router-dom';
import { GeneralContext } from '../App';
import { RoleTypes, checkPermissions } from './Navbar';

const links = [
  { route: '/about', icon: <InfoIcon />, title: 'About' },
  { route: '/cards/favorite', icon: <FavoriteIcon />, title: 'Favorites', permissions: [RoleTypes.user, RoleTypes.business, RoleTypes.admin] },
  { route: '/business/cards', icon: <RecentActorsIcon />, title: 'My cards', permissions: [RoleTypes.business, RoleTypes.admin] }
];

export default function Footer() {
  const [value, setValue] = useState("/about");
  const { roleType } = useContext(GeneralContext)
  const location = useLocation()

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation sx={{ width: 1, position: 'fixed', bottom: 0}} value={location.pathname} onChange={handleChange} showLabels>
       {links.filter(l => !l.permissions || checkPermissions(l.permissions, roleType)).map((l) => (
        <BottomNavigationAction key={l.title} label={l.title} value={l.route} icon={l.icon} component={Link}  to={l.route} sx={{margin: 3}}/>
      ))}
    </BottomNavigation>
  );
}