import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo, useContext, FC, ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import styled from 'styled-components';
import { useMediaQuery } from '@mantine/hooks';
import './App.scss';
import { Header } from './components/Header/Header';
import { HomePage } from './pages/HomePage/HomePage';
import { AuthenticationForm } from './components/Authentication/Authentication';
import { Notification } from './components/Notification/Notification';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { Users } from './pages/Users/Users';
import { Activation } from './pages/ActivationPage/Activation';
import { getItem, removeItem, setItem } from './utils/localStorageHelpers';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
import { ResetPassword } from './components/ResetPassword/ResetPassword';
import { ConfirmationPage } from './pages/ConfirmationPage/ConfirmationPage';
import { GoogleAuth } from './pages/GoogleAuth/GoogleAuth';
import { AuthorizedUserData, NotificationType } from './utils/Types';
import { logout, refresh } from './api/authorization';
import { ThemeContext } from './components/ThemeProvider/ThemeProvider';

const Main = styled.main({
  padding: '20px',
});

const nameOfUserData = 'AuthorizedUserData';

function App() {
  const [notification, setNotification] = useState<NotificationType>({
    message: '',
    error: false,
  });
  const [authorizedUserData, setAuthorizedUserData] =
    useState<AuthorizedUserData>({
      name: null,
      email: null,
      accessToken: null,
    });
  const navigate = useNavigate();
  const userAuthorized = useMemo(() => {
    return Object.values(authorizedUserData).every((v) => v !== null);
  }, [authorizedUserData]);

  const { theme, setTheme } = useContext(ThemeContext);
  const onMobile = useMediaQuery('(max-width: 450px)');

  const AuthFormWrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <div
      style={{
        width: `${onMobile ? '300px' : '600px'}`,
        margin: '0 auto',
      }}
    >
      {children}
    </div>
  );

  const userLogout = async (id: number) => {
    try {
      await logout(id);

      setNotification({
        message:
          'Your refresh token has expired!\nPlease, log in one more time.',
        error: true,
      });
      removeItem(nameOfUserData);
      setAuthorizedUserData({ name: null, email: null, accessToken: null });
      navigate('/sign-in');
    } catch (error) {
      console.log('Error during logout, ', error);
    }
  };

  const silentRefreshAccessToken = async () => {
    const userDataFromStorage = getItem(nameOfUserData);
    const { user, accessToken } = userDataFromStorage;

    try {
      const response = await refresh(user.id, accessToken);

      setItem(nameOfUserData, {
        ...userDataFromStorage,
        accessToken: response.data.accessToken,
      });
    } catch (error: any) {
      const { status } = error.response;

      if (status === 401) {
        await userLogout(user.id);
      } else if (status === 400) {
        setNotification({
          message: 'Your access token is still valid!',
          error: true,
        });
      } else {
        setNotification({
          message: 'Internal server error!',
          error: true,
        });
      }
    }
  };

  useEffect(() => {
    if (!authorizedUserData.accessToken) return;

    const intervalId = setInterval(() => {
      silentRefreshAccessToken();
    }, 31 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [authorizedUserData.accessToken]);

  useEffect(() => {
    const userDataFromStorage = getItem(nameOfUserData);
    const themeFromStorage = localStorage.getItem('theme') as 'light' | 'dark';

    if (themeFromStorage) {
      setTheme(themeFromStorage);
    }

    if (!userDataFromStorage) return;

    const { user, accessToken } = userDataFromStorage;

    if (user !== null) {
      const { name, email } = user;

      setAuthorizedUserData({ name, email, accessToken });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <MantineProvider forceColorScheme={theme}>
      <Header
        userAuthorized={userAuthorized}
        setAuthorizedUserData={setAuthorizedUserData}
        setNotification={setNotification}
      />

      <Main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                authorizedUserData={authorizedUserData}
                setAuthorizedUserData={setAuthorizedUserData}
                setNotification={setNotification}
              />
            }
          />

          <Route
            path="/users"
            element={<Users setNotification={setNotification} />}
          />

          {!userAuthorized && (
            <>
              <Route
                path="/sign-up"
                element={
                  <AuthFormWrapper>
                    <AuthenticationForm
                      type="register"
                      setNotification={setNotification}
                    />
                  </AuthFormWrapper>
                }
              />

              <Route
                path="/sign-in"
                element={
                  <AuthFormWrapper>
                    <AuthenticationForm
                      type="login"
                      setNotification={setNotification}
                      setAuthorizedUserData={setAuthorizedUserData}
                    />
                  </AuthFormWrapper>
                }
              />

              <Route
                path="/activate/:activationToken"
                element={
                  <Activation setAuthorizedUserData={setAuthorizedUserData} />
                }
              />

              <Route
                path="/forgot-password"
                element={
                  <AuthFormWrapper>
                    <ForgotPassword />
                  </AuthFormWrapper>
                }
              />

              <Route
                path="/reset-password/:resetToken"
                element={
                  <AuthFormWrapper>
                    <ResetPassword />
                  </AuthFormWrapper>
                }
              />

              <Route
                path="/google-auth"
                element={
                  <GoogleAuth setAuthorizedUserData={setAuthorizedUserData} />
                }
              />
            </>
          )}

          <Route
            path="/confirmation/:confirmationToken"
            element={<ConfirmationPage setNotification={setNotification} />}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {!!notification.message.length && (
          <Notification
            title="Notification"
            notification={notification}
            setNotification={setNotification}
          />
        )}
      </Main>
    </MantineProvider>
  );
}

export default App;
