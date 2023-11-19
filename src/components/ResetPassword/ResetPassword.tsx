import { FC, useState } from 'react';
import { useForm } from '@mantine/form';
import { Loader } from '@mantine/core';
import {
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
} from '@mantine/core';
import { resetPassword } from '../../api/authorization';
import { Link, useParams } from 'react-router-dom';

export const ResetPassword: FC = (props: PaperProps) => {
  const [loading, setLoading] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const params = useParams();
  const form = useForm({
    initialValues: {
      password: '',
    },

    validate: {
      password: (val: any) => (val.length > 6 ? null : 'Invalid email'),
    },
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (params.resetToken) {
        await resetPassword(params.resetToken, form.values.password);
      }

      setIsPasswordReset(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" fw={500}>
        Reset your password
      </Text>

      {isPasswordReset ? (
        <>
          <h1>Your password has been successfully reset!</h1>

          <Link to="/">
            <Button size="md">Go back to the home page</Button>
          </Link>
        </>
      ) : (
        <form onSubmit={form.onSubmit(async () => await handleSubmit())}>
          <PasswordInput
            required
            label="Password"
            placeholder="Your new password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue('password', event.currentTarget.value)
            }
            error={
              form.errors.password &&
              'Password should include at least 6 characters'
            }
            radius="md"
          />

          <Group justify="space-between" mt="xl">
            <Button
              disabled={loading}
              type="submit"
              radius="xl"
              styles={{ root: { width: '170px' } }}
            >
              {loading ? <Loader color="blue" size="sm" /> : 'Reset password'}
            </Button>
          </Group>
        </form>
      )}
    </Paper>
  );
};
