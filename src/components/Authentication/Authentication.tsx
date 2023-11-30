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
import { AuthorizedUserData, NotificationType } from '../../utils/Types.js';
import { MessageBlock } from '../MessageBlock/MessageBlock.js';

interface Props extends PaperProps {
  type: 'login' | 'register';
  setNotification: (notification: NotificationType) => void;
  setAuthorizedUserData?: Dispatch<SetStateAction<AuthorizedUserData>>;
}

export function AuthenticationForm(props: Props) {
  const navigate = useNavigate();
  const { setNotification, type, setAuthorizedUserData } = props;
  const [loading, setLoading] = useState(false);
  const [isActivationLinkSent, setIsActivationLinkSent] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: false,
    },

    validate: {
      name: (val: any) =>
        /\d/.test(val) ? 'Name cannot contain any numbers!' : null,
      email: (val: any) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val: any) =>
        val.length <= 6
          ? 'Password should include at least 6 characters'
          : null,
    },
  });

  const clearForm = () => {
    form.reset();
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
      setNotification({
        message:
          'You have been successfully registered! Activate your email please!',
      });
    } catch (error: any) {
      const { email, password } = error.response.data.errors;

      form.setErrors({ email, password });
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
        setAuthorizedUserData({
          name: response.data.user.name,
          email,
          accessToken: response.data.accessToken,
        });
      }

      clearForm();
      setNotification({
        message: `Welcome ${response.data.user.name}!`,
      });
      navigate('/');
    } catch (error: any) {
      const { email, password } = error.response.data.errors;

      form.setErrors({ email, password });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clearForm();
  }, [navigate]);

  return (
    <>
      {isActivationLinkSent ? (
        <MessageBlock
          title="Confirmation email has been sent."
          message="Please check your email and confirm your account."
        />
      ) : (
        <Paper radius="md" p="xl" withBorder>
          <Text size="lg" fw={500}>
            Welcome to Authentication app, {type} with
          </Text>

          <Group grow mb="md" mt="md">
            <a href="http://auth-backend-hxdm.onrender.com/auth/google">
              <GoogleButton radius="xl" fullWidth>
                Google
              </GoogleButton>
            </a>
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
                error={form.errors.email}
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
                error={form.errors.password}
                radius="md"
              />
              {type === 'login' && (
                <Link to="/forgot-password" style={{ fontSize: '12px' }}>
                  Forgot password? Click to reset.
                </Link>
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
