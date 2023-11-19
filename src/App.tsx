import { Route, Routes } from 'react-router-dom';
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
import { getItem } from './utils/localStorageHelpers';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
import { ResetPassword } from './components/ResetPassword/ResetPassword';

const Main = styled.main({
  padding: '20px',
});

function App() {
  const [notification, setNotification] = useState('');
  const [authorizedUserData, setAuthorizedUserData] = useState<{
    name: string | null;
    email: string | null;
  }>({
    name: null,
    email: null,
  });

  useEffect(() => {
    let timeout: number | null;

    if (notification.length && notification !== 'OK') {
      timeout = setTimeout(() => {
        setNotification('');
      }, 5000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [notification]);

  useEffect(() => {
    const userDataFromStorage = getItem('AuthorizedUserData');

    if (!userDataFromStorage) return;

    const { user } = userDataFromStorage;

    if (user !== null) {
      const { name, email } = user;

      setAuthorizedUserData({ name, email });
    }
  }, []);

  return (
    <>
      <Header
        userAuthorized={Object.values(authorizedUserData).every(
          (v) => v !== null
        )}
        setAuthorizedUserData={setAuthorizedUserData}
      />

      <Main>
        <Routes>
          <Route
            path="/"
            element={<HomePage authorizedUserData={authorizedUserData} />}
          />
          <Route path="/users" element={<Users />} />
          <Route
            path="/sign-up"
            element={
              <div style={{ width: '600px', margin: '0 auto' }}>
                <AuthenticationForm
                  type="register"
                  notification={notification}
                  setNotification={setNotification}
                />
              </div>
            }
          />
          <Route
            path="/sign-in"
            element={
              <div style={{ width: '600px', margin: '0 auto' }}>
                <AuthenticationForm
                  type="login"
                  notification={notification}
                  setNotification={setNotification}
                  setAuthorizedUserData={setAuthorizedUserData}
                />
              </div>
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

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {!!notification.length && notification !== 'OK' && (
          <Notification
            title="Request"
            message={notification}
            variant={'danger'}
          />
        )}
      </Main>
    </>
  );
}

export default App;
