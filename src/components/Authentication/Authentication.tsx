import { upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { Loader } from '@mantine/core';
import { sendData } from '../../api/register.js';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
} from '@mantine/core';
import { GoogleButton } from './GoogleButton';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface Props extends PaperProps {
  type: 'login' | 'register';
  setNotification: (notification: string) => void;
}

export function AuthenticationForm(props: Props) {
  const navigate = useNavigate();
  const { setNotification, type } = props;
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: false,
    },

    validate: {
      email: (val: any) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val: any) =>
        val.length <= 6
          ? 'Password should include at least 6 characters'
          : null,
    },
  });

  const clearForm = () => {
    form.setFieldValue('email', '');
    form.setFieldValue('name', '');
    form.setFieldValue('password', '');
    form.setFieldValue('terms', false);
  };

  const handleToggle = () => {
    if (type === 'login') {
      navigate('/sign-up');

      return;
    }

    navigate('/sign-in');
  };

  const handleSubmit = async () => {
    const { email, password } = form.values;

    setLoading(true);

    try {
      const message = await sendData({ email, password });

      if (message === 'OK') {
        clearForm();
      }

      setNotification(message);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clearForm();
  }, [navigate]);

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" fw={500}>
        Welcome to Authentication app, {type} with
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(async () => await handleSubmit())}>
        <Stack>
          {type === 'register' && (
            <TextInput
              required
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue('name', event.currentTarget.value)
              }
              radius="md"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue('email', event.currentTarget.value)
            }
            error={form.errors.email && 'Invalid email'}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
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

          {type === 'register' && (
            <Checkbox
              required
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) =>
                form.setFieldValue('terms', event.currentTarget.checked)
              }
            />
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor
            component="button"
            type="button"
            c="dimmed"
            onClick={() => handleToggle()}
            size="xs"
          >
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button
            disabled={loading}
            type="submit"
            radius="xl"
            styles={{ root: { width: '100px' } }}
          >
            {loading ? <Loader color="blue" size="xs" /> : upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
