import { FC, useEffect, useState } from 'react';
import { getUsers } from '../../api/authorization';
import { Loader } from '@mantine/core';
import { User } from '../../utils/Types';
import { UsersTable } from '../../components/UsersTable/UsersTable';
import styled from 'styled-components';

const UsersContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
  justifyContent: 'center',
  alignItems: 'center',
});

export const Users: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const handleGetUsers = async () => {
    try {
      const users = await getUsers();

      setLoading(true);
      setUsers(users.data);
    } catch (error) {
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
      <h1>There are no users yet</h1>
    ) : (
      <UsersTable
        data={users.map(({ id, name, email }) => ({
          id: id.toString(),
          name,
          email,
        }))}
      />
    );
  };

  return (
    <UsersContainer>
      <h1 style={{ alignSelf: 'flex-start' }}>Users</h1>
      {loading ? <Loader /> : renderTable()}
    </UsersContainer>
  );
};
