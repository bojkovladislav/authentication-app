import { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';

const leftSide = [
  {
    name: 'Home',
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

export const Header: FC = () => {
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

  return (
    <StyledHeader>
      <HeaderContainer className="left-side">
        {leftSide.map(({ name, url }) => (
          <NavLink
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
      <HeaderContainer className="right-side">
        {rightSide.map(({ name, url }) => (
          <NavLink to={url}>
            <Button
              variant={`${name === 'Sign up' ? 'outline-dark' : 'dark'}`}
              size="sm"
            >
              {name}
            </Button>
          </NavLink>
        ))}
      </HeaderContainer>
    </StyledHeader>
  );
};
