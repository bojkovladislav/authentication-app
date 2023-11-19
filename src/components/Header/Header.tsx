import { Dispatch, FC, SetStateAction } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import { logout } from '../../api/authorization';
import { getItem, removeItem } from '../../utils/localStorageHelpers';

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
    SetStateAction<{ name: null | string; email: null | string }>
  >;
}

export const Header: FC<Props> = ({
  userAuthorized,
  setAuthorizedUserData,
}) => {
  const location = useLocation();
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

      // await logout(user.id);

      setAuthorizedUserData({ name: null, email: null });
      removeItem('AuthorizedUserData');
    } catch (error) {
      console.log(error);
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
        <Button variant="dark" size="sm" onClick={handleLogOut}>
          Log out
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
