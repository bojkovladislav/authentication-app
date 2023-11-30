import { FC, useEffect, useState } from 'react';
import { getUsers } from '../../api/authorization';
import { Loader } from '@mantine/core';
import { NotificationType, User } from '../../utils/Types';
import { UsersTable } from '../../components/UsersTable/UsersTable';
import styled from 'styled-components';
import { useThemeStyle } from '../../hooks/useThemeStyle';

const UsersContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
  justifyContent: 'center',
  alignItems: 'center',
});

interface Props {
  setNotification: (Notification: NotificationType) => void;
}

export const Users: FC<Props> = ({ setNotification }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const setThemeStyle = useThemeStyle();

  const handleGetUsers = async () => {
    try {
      const users = await getUsers();

      setLoading(true);
      setUsers(users.data);
    } catch (error) {
      setNotification({ message: 'Failed to get users!', error: true });
      console.log('Failed to get users!', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetUsers();
  }, []);

  const renderTable = () => {
    return !users.length ? (
      <h1 style={{ color: setThemeStyle('#1a1b1e', '#dee2e6') }}>
        There are no users yet
      </h1>
    ) : (
      <UsersTable
        data={users.map(({ id, name, email }) => ({
          id,
          name,
          email,
        }))}
      />
    );
  };

  return (
    <UsersContainer>
      <h1
        style={{
          alignSelf: 'flex-start',
          color: setThemeStyle('#1a1b1e', '#dee2e6'),
        }}
      >
        Users
      </h1>
      {loading ? <Loader /> : renderTable()}
    </UsersContainer>
  );
};
