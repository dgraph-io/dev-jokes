import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";
import Content from '../components/content';
import { Navbar } from '../components/navbar';

import Button from '@material-ui/core/Button';
import LogoutButton from "../components/auth/logoutButton";

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import FlagIcon from '@material-ui/icons/Flag';

const Profile = () => {
  const [role, setRole] = useState('USER');
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();
  const history = useHistory()
  useEffect(() => {
    const initAuth0 = async () => {
      if (isAuthenticated) {
        const idTokenClaims = await getIdTokenClaims();
        setRole(idTokenClaims['https://dgraph.io/jwt/claims']['ROLE'])
      }
    };
    initAuth0();
  }, [isAuthenticated, getIdTokenClaims]);

  console.log("Profile", user)

  return <>
    <Navbar title="Profile" color="primary" />
    <Content>
        <div className="profile">
          <img className="profile-img" src={user.picture} alt="Profile" style={{"max-width":"100%"}}/>
          <p>Name: <strong>{user.name}</strong></p>
          <p>Email: <strong>{user.email}</strong></p>
        </div>
        <LogoutButton />
        {
          role === 'ADMIN' ? <>
          <Button
            onClick={() => history.push("/approve")}
            variant="contained"
            color="secondary"
            className="btn-margin"
            startIcon={<CheckCircleIcon/>}
          >
            Approve
          </Button>
          <Button
            onClick={() => history.push("/flagged")}
            variant="contained"
            color="secondary"
            className="btn-margin"
            startIcon={<FlagIcon/>}
          >
            Flagged
          </Button>
          </>:
          <></>
        }
    </Content>
  </>
}

export default Profile;
