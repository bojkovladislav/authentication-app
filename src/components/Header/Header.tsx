import { Dispatch, FC, SetStateAction, useState, useContext } from 'react';
import { Sun, Moon } from 'react-bootstrap-icons';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import { logout } from '../../api/authorization';
import { getItem, removeItem } from '../../utils/localStorageHelpers';
import { AuthorizedUserData, NotificationType } from '../../utils/Types';
import { Loader } from '@mantine/core';
import { ThemeContext } from '../ThemeProvider/ThemeProvider';
import { useThemeStyle } from '../../hooks/useThemeStyle';

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
  setAuthorizedUserData: Dispatch<SetStateAction<AuthorizedUserData>>;
  setNotification: (notification: NotificationType) => void;
}

export const Header: FC<Props> = ({
  userAuthorized,
  setAuthorizedUserData,
  setNotification,
}) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);
  const setThemeStyle = useThemeStyle();
  const StyledHeader = styled.header({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 20px',
    borderBottom: `1px solid ${theme === 'light' ? '#dee2e6' : '#373a40'}`,
  });

  const HeaderContainer = styled.ul({
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    alignItems: 'center',
  });

  const ThemeChangeButton = () => {
    return (
      <Button
        variant={theme === 'light' ? 'warning' : 'primary'}
        size="sm"
        onClick={handleChangeTheme}
      >
        {theme === 'light' ? <Sun color="#000" /> : <Moon color="#fff" />}
      </Button>
    );
  };

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

  const handleChangeTheme = () =>
    theme === 'light' ? setTheme('dark') : setTheme('light');

  return (
    <StyledHeader>
      <HeaderContainer className="left-side">
        {leftSide.map(({ name, url }) => (
          <NavLink
            key={name}
            to={url}
            style={{
              color: `${setThemeStyle('#1a1b1e', '#dee2e6')}`,
              borderBottom:
                location.pathname === url
                  ? `1px solid ${setThemeStyle('#1a1b1e', '#dee2e6')}`
                  : '',
            }}
          >
            {name}
          </NavLink>
        ))}
      </HeaderContainer>

      <HeaderContainer className="right-side">
        {userAuthorized ? (
          <Button
            variant={setThemeStyle('dark', 'light')}
            size="sm"
            onClick={handleLogOut}
            disabled={loading}
            style={{ width: '100px', height: '40px' }}
          >
            {loading ? <Loader color="blue" size="xs" /> : 'Log out'}
          </Button>
        ) : (
          rightSide.map(({ name, url }) => (
            <NavLink to={url} key={name}>
              <Button
                variant={`${
                  name === 'Sign up'
                    ? setThemeStyle('outline-dark', 'outline-light')
                    : setThemeStyle('dark', 'light')
                }`}
                size="sm"
              >
                {name}
              </Button>
            </NavLink>
          ))
        )}
        <ThemeChangeButton />
      </HeaderContainer>
    </StyledHeader>
  );
};
