import { Dispatch, FC, SetStateAction, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import { logout } from '../../api/authorization';
import { getItem, removeItem } from '../../utils/localStorageHelpers';
import { AuthorizedUserData, NotificationType } from '../../utils/Types';
import { Loader } from '@mantine/core';

const leftSide = [
  {
    name: 'My cabinet',
    url: '/',
  },
  { name: 'Users', url: '/users' },
];

const rightSide = [
  {
    name: 'Sign up',
    url: 'sign-up',
  },
  {
    name: 'Sign in',
    url: 'sign-in',
  },
];

interface Props {
  userAuthorized: boolean;
  setAuthorizedUserData: Dispatch<
    SetStateAction<AuthorizedUserData>
  >;
  setNotification: (notification: NotificationType) => void;
}

export const Header: FC<Props> = ({
  userAuthorized,
  setAuthorizedUserData,
  setNotification,
}) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const StyledHeader = styled.header({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 20px',
    borderBottom: '1px solid #dee2e6',
  });

  const HeaderContainer = styled.ul({
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    alignItems: 'center',
  });

  const handleLogOut = async () => {
    try {
      const { user } = getItem('AuthorizedUserData');
      setLoading(true);

      await logout(user.id);

      setAuthorizedUserData({ name: null, email: null, accessToken: null });
      removeItem('AuthorizedUserData');
      setNotification({
        message: "You've been successfully logged out",
      });
    } catch (error) {
      setNotification({
        message: 'Something went wrong during logout!',
        error: true,
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledHeader>
      <HeaderContainer className="left-side">
        {leftSide.map(({ name, url }) => (
          <NavLink
            key={name}
            to={url}
            style={{
              color: '#1a1b1e',
              borderBottom: location.pathname === url ? '1px solid #000' : '',
            }}
          >
            {name}
          </NavLink>
        ))}
      </HeaderContainer>

      {userAuthorized ? (
        <Button
          variant="dark"
          size="sm"
          onClick={handleLogOut}
          disabled={loading}
          style={{ width: '100px' }}
        >
          {loading ? <Loader color="blue" size="xs" /> : 'Log out'}
        </Button>
      ) : (
        <HeaderContainer className="right-side">
          {rightSide.map(({ name, url }) => (
            <NavLink to={url} key={name}>
              <Button
                variant={`${name === 'Sign up' ? 'outline-dark' : 'dark'}`}
                size="sm"
              >
                {name}
              </Button>
            </NavLink>
          ))}
        </HeaderContainer>
      )}
    </StyledHeader>
  );
};
