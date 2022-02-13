import React, { FormEvent, useState } from 'react';
import { authService } from '../services/auth-service';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Typography, IconButton, Menu, MenuItem, Toolbar as Tools, Link, Button, InputBase, styled, alpha } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useCurrentUser } from '../context/current-user';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export function Toolbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [name, setName] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const user = useCurrentUser();

  function logout() {
    setAnchorEl(null);
    authService.logout();
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      navigate(`/search/${name}`);
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <AppBar position="sticky">
      <Tools>
        <VideoLibraryOutlinedIcon />
        <Typography variant="h5" sx={{flexGrow: 1, marginLeft: 1}}>
          <Link component={RouterLink} color="inherit" underline="none" to="/">
            Rust Blog
          </Link>
        </Typography>
        {!!user && (
          <>
            <form onSubmit={submit}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  onChange={event => setName(event.target.value)}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
            </form>
            <Typography variant="h6" component="span">
              Hello, {user.name}!
            </Typography>
            <IconButton
              onClick={(event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={!!anchorEl}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem component="span" onClick={logout}>
                <ExitToAppIcon />
                Logout
              </MenuItem>
            </Menu>
          </>
        )}
        {!user && location.pathname !== "/login" && (
          <Button color="inherit" component={RouterLink} to="/login">login</Button>
        )}
      </Tools>
    </AppBar>
  );
}
