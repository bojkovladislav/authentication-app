import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.scss';
import { Header } from './components/Header/Header';
import { HomePage } from './pages/HomePage/HomePage';
import styled from 'styled-components';
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

const Main = styled.main({
  padding: '20px',
});

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
  const nameOfUserData = 'AuthorizedUserData';

  const silentRefreshAccessToken = async () => {
    const currentUserData = getItem(nameOfUserData);

    try {
      const response = await refresh(
        currentUserData.user.id,
        currentUserData.accessToken
      );

      setItem(nameOfUserData, {
        ...currentUserData,
        accessToken: response.data.accessToken,
      });
    } catch (error: any) {
      const { status } = error.response;

      if (status === 401) {
        try {
          await logout(currentUserData.user.id);

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
    }, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [authorizedUserData.accessToken]);

  useEffect(() => {
    const userDataFromStorage = getItem(nameOfUserData);

    if (!userDataFromStorage) return;

    const { user, accessToken } = userDataFromStorage;

    if (user !== null) {
      const { name, email } = user;

      setAuthorizedUserData({ name, email, accessToken });
    }
  }, []);

  return (
    <>
      <Header
        userAuthorized={Object.values(authorizedUserData).every(
          (v) => v !== null
        )}
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
          <Route path="/users" element={<Users />} />

          {!(
            authorizedUserData.name &&
            authorizedUserData.email &&
            authorizedUserData.accessToken
          ) && (
            <Route
              path="/sign-up"
              element={
                <div style={{ width: '600px', margin: '0 auto' }}>
                  <AuthenticationForm
                    type="register"
                    setNotification={setNotification}
                  />
                </div>
              }
            />
          )}

          {!(
            authorizedUserData.name &&
            authorizedUserData.email &&
            authorizedUserData.accessToken
          ) && (
            <Route
              path="/sign-in"
              element={
                <div style={{ width: '600px', margin: '0 auto' }}>
                  <AuthenticationForm
                    type="login"
                    setNotification={setNotification}
                    setAuthorizedUserData={setAuthorizedUserData}
                  />
                </div>
              }
            />
          )}

          <Route
            path="/activate/:activationToken"
            element={
              <Activation setAuthorizedUserData={setAuthorizedUserData} />
            }
          />

          <Route
            path="/forgot-password"
            element={
              <div style={{ width: '600px', margin: '0 auto' }}>
                <ForgotPassword />
              </div>
            }
          />

          <Route
            path="/reset-password/:resetToken"
            element={
              <div style={{ width: '600px', margin: '0 auto' }}>
                <ResetPassword />
              </div>
            }
          />

          <Route
            path="/confirmation/:confirmationToken"
            element={<ConfirmationPage />}
          />

          <Route
            path="/google-auth"
            element={
              <GoogleAuth setAuthorizedUserData={setAuthorizedUserData} />
            }
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
    </>
  );
}

export default App;
