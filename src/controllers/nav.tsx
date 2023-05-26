import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import * as React from "react";
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import {getActiveUser, logoutActiveUser} from "../models/users.data";
import LogoutIcon from '@mui/icons-material/Logout';

export const useNavBar = () => {
    const url = window.location.href;
    const origin = window.location.origin;

    return (
        <BottomNavigation
            value={url.replace(origin, '')}
            onChange={async (event, newValue) => {
                if ((newValue === '/profile') && getActiveUser() == null) {
                    window.location.assign('/login');
                } else if (newValue === '/logout') {
                    if (getActiveUser() != null) {
                        await logoutActiveUser();
                        window.location.assign('/');
                    }
                } else {
                    window.location.assign(newValue);
                }
            }}
            className="navBar"
        >
            <BottomNavigationAction
                label="Search films"
                value="/"
                sx={{color:'white', borderBottom:'solid 2px #800000', '&.Mui-selected':{color:'white'}}}
                icon={<SearchIcon sx={{color:'white'}} />} />
            <BottomNavigationAction
                label="User profile"
                value="/profile"
                sx={{color:'white', borderBottom:'solid 2px #800000', '&.Mui-selected':{color:'white'}}}
                icon={<PersonIcon sx={{color:'white'}}/>} />
            {getActiveUser() != null && (
                <BottomNavigationAction
                    label="Logout"
                    value="/logout"
                    sx={{ color: 'white', borderBottom: 'solid 2px #800000', '&.Mui-selected': { color: 'white' } }}
                    icon={<LogoutIcon sx={{ color: 'white' }} />}
                />
            )}
        </BottomNavigation>
    );
}