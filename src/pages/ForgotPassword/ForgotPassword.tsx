import { FC, useState } from 'react';
import { useForm } from '@mantine/form';
import { Loader } from '@mantine/core';
import {
  TextInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
} from '@mantine/core';
import { forgotPassword } from '../../api/authorization';

export const ForgotPassword: FC = (props: PaperProps) => {
  const [isConfirmationSent, setIsConfirmationSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: '',
    },

    validate: {
      email: (val: any) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await forgotPassword(form.values.email);
      setIsConfirmationSent(true);
    } catch (error: any) {
      form.setFieldError('email', error.response.data.errors.email);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper radius="md" p="md" withBorder {...props}>
      <Text size="lg" fw={500}>
        Reset your password
      </Text>

      {isConfirmationSent ? (
        <h1>Confirmation has been sent!</h1>
      ) : (
        <form onSubmit={form.onSubmit(async () => await handleSubmit())}>
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

          <Group justify="space-between" mt="xl">
            <Button
              disabled={loading}
              type="submit"
              radius="xl"
              styles={{ root: { width: '170px' } }}
            >
              {loading ? (
                <Loader color="blue" size="sm" />
              ) : (
                'Send confirmation'
              )}
            </Button>
          </Group>
        </form>
      )}
    </Paper>
  );
};
