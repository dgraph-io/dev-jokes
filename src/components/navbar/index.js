import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { Typography } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";

import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import AppBar from "@material-ui/core/AppBar";

import LoginButton from "../auth/loginButton";
import { useAuth0 } from "@auth0/auth0-react";
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Avatar from '@material-ui/core/Avatar';

import clsx from "clsx";
import useStyles from "./navbar.style";
import Logo from "../../assets/images/logo.svg";

export function NavbarItem({type, href, onClick, text, iconName, width, height}) {
  return type === "text" ? (
    <a
      href={href}
      onClick={onClick}
      style={{ color: "inherit", textDecoration: "none" }}
    >
      <Typography variant="h4">{text}</Typography>
    </a>
  ) : (
      <div onClick={onClick}>
        <img
          src={require(`../../assets/images/${iconName}`)}
          alt="icon"
          width={width}
          height={height}
        />
      </div>
    )
}

const AuthNav = ({history}) => {
  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();
  return (<>
    {location && location.pathname !== "/create" ?
      <Button
        onClick={() => history.push("/create")}
        variant="contained"
        color="secondary"
        className="btn-margin"
        startIcon={<AddIcon/>}
      >
        Create
      </Button>:<></>
    }
    <div>
      {isAuthenticated ? 
      <IconButton 
        onClick={() => history.push("/profile")}
      >
        <Avatar alt={user.name} src={user.picture} />
      </IconButton>
      : <LoginButton /> }
    </div>
    </>
  );
};


export function Navbar({title, searchBar, children = [], color = "primary"}) {
  const classes = useStyles();
  const [closeBtn, setCloseBtn] = useState(false);
  const history = useHistory();

  const getSearchBar = (view) => {
    return searchBar ? (
      <div className={view === "web" ? classes.search : classes.searchToggle}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder={searchBar.placeholder}
          onChange={searchBar.onChange}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ "aria-label": "search" }}
        />
      </div>
    ) : null;
  };

  const getNavRightItems = (view) => {
    return children.map((item, index) => {
      return (
        <div
          className={view === "web" ? classes.ml2 : null}
          style={{ cursor: "pointer" }}
          key={index}
        >
          {item}
        </div>
      );
    });
  };

  return (
    <AppBar position="fixed" className={clsx(classes.appBar, classes.appBarShift)} color={color}>
      <div className={classes.nav} >
        <div className={classes.navLeft}>
          <Typography variant="h6" className={classes.headerTitle}>{title}</Typography>
          {getSearchBar("web")}
        </div>
        <div className={classes.logo}>
          <img src={Logo} alt="logo" onClick={() => history.push("/")}/>
        </div>
        <div className={classes.navRight}>{getNavRightItems("web")}</div>

        <div
          className={classes.toggleBtn}
          onClick={() => setCloseBtn(!closeBtn)}
        >
          <IconButton color="inherit">
            {!closeBtn ? <MenuIcon /> : <CloseIcon />}
          </IconButton>
        </div>
        <AuthNav history={history}/>
      </div>
      {closeBtn ? (
        <div className={classes.navLinks}>
          {searchBar ? (
            <div>
              {getSearchBar()}
              <br />
            </div>
          ) : null}
          {getNavRightItems()}
        </div>
      ) : null}
    </AppBar>
  );
}
