import { upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { Dispatch, SetStateAction, useState } from 'react';
import { login, register } from '../../api/authorization.js';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Loader,
  Divider,
  Checkbox,
  Anchor,
  Stack,
} from '@mantine/core';
import { GoogleButton } from './GoogleButton';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { setItem } from '../../utils/localStorageHelpers.js';

interface Props extends PaperProps {
  type: 'login' | 'register';
  notification: string;
  setNotification: (notification: string) => void;
  setAuthorizedUserData?: Dispatch<
    SetStateAction<{ name: null | string; email: null | string }>
  >;
}

export function AuthenticationForm(props: Props) {
  const navigate = useNavigate();
  const { notification, setNotification, type, setAuthorizedUserData } = props;
  const [loading, setLoading] = useState(false);
  const [isActivationLinkSent, setIsActivationLinkSent] = useState(false);

  console.log(notification);

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

  const handleRegistration = async () => {
    const { name, email, password } = form.values;

    setLoading(true);

    try {
      await register({ name, email, password });

      setIsActivationLinkSent(true);
    } catch (error: any) {
      setNotification(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const { email, password } = form.values;

    setLoading(true);

    try {
      const response = await login(email, password);

      setItem('AuthorizedUserData', response.data);

      if (setAuthorizedUserData) {
        setAuthorizedUserData({ name: response.data.user.name, email });
      }

      clearForm();
      setNotification('');
      navigate('/');
    } catch (error: any) {
      setNotification(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleLogin = async () => {
  //   try {
  //     await googleLogin();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    clearForm();
  }, [navigate]);

  return (
    <>
      {isActivationLinkSent ? (
        <div>
          <h1>Check your email!</h1>
          <p>We have sent you an email with activation link</p>
        </div>
      ) : (
        <Paper radius="md" p="xl" withBorder {...props}>
          <Text size="lg" fw={500}>
            Welcome to Authentication app, {type} with
          </Text>

          <Group grow mb="md" mt="md">
            <Link to="http://localhost:3000/auth/google">
            <GoogleButton
              radius="xl"
              // onClick={async () => await handleGoogleLogin()}
            >
              Google
            </GoogleButton>
            </Link>
          </Group>

          <Divider
            label="Or continue with email"
            labelPosition="center"
            my="lg"
          />

          <form
            onSubmit={form.onSubmit(async () =>
              type === 'register'
                ? await handleRegistration()
                : await handleLogin()
            )}
          >
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
              {type === 'login' && (
                <Anchor component="a" type="reset" c="dimmed" size="xs">
                  <Link to="/forgot-password">
                    Forgot password? Click to reset.
                  </Link>
                </Anchor>
              )}

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
      )}
    </>
  );
}
