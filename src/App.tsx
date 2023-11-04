import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.scss';
import { Header } from './components/Header/Header';
import { HomePage } from './pages/HomePage/HomePage';
import styled from 'styled-components';
import { AuthenticationForm } from './components/Authentication/Authentication';
import { Notification } from './components/Notification/Notification';

const Main = styled.main({
  padding: '20px',
});

function App() {
  const [notification, setNotification] = useState('');

  useEffect(() => {
    let timeout: number | null;

    if (notification.length) {
      timeout = setTimeout(() => {
        setNotification('');
      }, 3000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [notification]);

  return (
    <>
      <Header />

      <Main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<h1>Users</h1>} />
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
          <Route
            path="/sign-in"
            element={
              <div style={{ width: '600px', margin: '0 auto' }}>
                <AuthenticationForm
                  type="login"
                  setNotification={setNotification}
                />
              </div>
            }
          />
        </Routes>

        {!!notification.length && (
          <Notification
            title="Request"
            message={
              notification === 'OK'
                ? `Your data has been successfully received. 
                  Check your email please`
                : notification
            }
            variant={notification === 'OK' ? 'success' : 'danger'}
          />
        )}
      </Main>
    </>
  );
}

export default App;
