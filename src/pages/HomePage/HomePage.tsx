import { FC, useState, Dispatch, SetStateAction } from 'react';
import { NormalizedUser } from '../../utils/Types';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import { useForm } from '@mantine/form';
import {
  TextInput,
  Loader,
  Button,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
} from '@mantine/core';
import {
  sendConfirmationEmail,
  updateName,
  updatePassword,
} from '../../api/authorization';
import { getItem, setItem } from '../../utils/localStorageHelpers';

interface Props {
  authorizedUserData: NormalizedUser;
  setAuthorizedUserData: Dispatch<
    SetStateAction<{ name: null | string; email: null | string }>
  >;
}

interface Wrapper {
  name: string;
  value: string;
}

interface Form extends PaperProps {
  type: 'name' | 'email' | 'password';
}

export const HomePage: FC<Props> = ({
  authorizedUserData,
  setAuthorizedUserData,
}) => {
  const [isNameTriggered, setIsNameTriggered] = useState(false);
  const [isEmailTriggered, setIsEmailTriggered] = useState(false);
  const [isPasswordTriggered, setIsPasswordTriggered] = useState(false);
  const [currentNameError, setCurrentNameError] = useState<string | null>(null);
  const [
    sendEmailConfirmationCompletedMessage,
    setSendConfirmationCompletedMessage,
  ] = useState('');
  const nameOfLocalUserData = 'AuthorizedUserData';
  const userDataFromStorage = getItem(nameOfLocalUserData);

  const userData = {
    name: authorizedUserData.name,
    email: authorizedUserData.email,
    password: '***...',
  };

  const handleTrigger = (type: string) => {
    if (type === 'name') {
      setIsNameTriggered(!isNameTriggered);
    }

    if (type === 'email') {
      setIsEmailTriggered(!isEmailTriggered);
    }

    if (type === 'password') {
      setIsPasswordTriggered(!isPasswordTriggered);
    }
  };

  const handleNameUpdate = async (
    newName: string,
    setLoading: (loading: boolean) => void
  ) => {
    if (!userDataFromStorage) return;

    setLoading(true);
    setCurrentNameError(null);

    try {
      const response = await updateName(userDataFromStorage.user.id, newName);
      const { name } = response.data.updatedUser;

      setItem(nameOfLocalUserData, {
        user: { name, ...userDataFromStorage.user },
      });
      setAuthorizedUserData({ name, email: userDataFromStorage.user.email });
      setIsNameTriggered(false);
    } catch (error: any) {
      setCurrentNameError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailConfirmation = async (
    newEmail: string,
    password: string,
    setLoading: (loading: boolean) => void
  ) => {
    if (!userDataFromStorage) return;

    setSendConfirmationCompletedMessage('');
    setLoading(true);

    try {
      const response = await sendConfirmationEmail(
        userDataFromStorage.user.id,
        newEmail,
        password
      );
      setSendConfirmationCompletedMessage(response.data.message);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (
    oldPassword: string,
    newPassword: string,
    confirmation: string,
    setLoading: (loading: boolean) => void
  ) => {
    if (!userDataFromStorage) return;

    setLoading(true);

    try {
      const response = await updatePassword(
        userDataFromStorage.user.id,
        oldPassword,
        newPassword,
        confirmation
      );

      console.log(response);
      setIsPasswordTriggered(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const Form: FC<Form> = (props) => {
    const { type } = props;
    const [loading, setLoading] = useState(false);

    const updateNameForm = useForm({
      initialValues: {
        newName: '',
      },
      validate: {
        newName: (val: any) => {
          if (/\d/.test(val)) return 'Name cannot contain any numbers!';

          return currentNameError;
        },
      },
    });

    const sendEmailConfirmationForm = useForm({
      initialValues: {
        newEmail: '',
        password: '',
      },
      validate: {
        newEmail: (val: any) => {
          if (!/^\S+@\S+$/.test(val)) return 'Invalid email!';

          return null;
        },
        password: (val: any) => {
          if (val.length < 6)
            return 'Password should be at least 6 characters length!';

          return null;
        },
      },
    });

    const updatePasswordForm = useForm({
      initialValues: {
        oldPassword: '',
        newPassword: '',
        confirmation: '',
      },
    });

    return (
      <Paper radius="md" p="xl" withBorder {...props}>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (type === 'name') {
              updateNameForm.onSubmit(
                async () =>
                  await handleNameUpdate(
                    updateNameForm.values.newName,
                    setLoading
                  )
              )();
            }

            if (type === 'email') {
              const { newEmail, password } = sendEmailConfirmationForm.values;

              sendEmailConfirmationForm.onSubmit(
                async () =>
                  await handleSendEmailConfirmation(
                    newEmail,
                    password,
                    setLoading
                  )
              )();
            }

            if (type === 'password') {
              const { oldPassword, newPassword, confirmation } =
                updatePasswordForm.values;

              updatePasswordForm.onSubmit(
                async () =>
                  await handlePasswordUpdate(
                    oldPassword,
                    newPassword,
                    confirmation,
                    setLoading
                  )
              )();
            }
          }}
        >
          <Stack>
            {type === 'name' && (
              <TextInput
                required
                placeholder="Enter new name"
                value={updateNameForm.values.newName}
                error={updateNameForm.errors.newName}
                onChange={(event) =>
                  updateNameForm.setFieldValue(
                    'newName',
                    event.currentTarget.value
                  )
                }
                radius="md"
              />
            )}

            {type === 'email' && (
              <>
                <TextInput
                  required
                  placeholder="Enter new email"
                  value={sendEmailConfirmationForm.values.newEmail}
                  error={sendEmailConfirmationForm.errors.newEmail}
                  onChange={(event) =>
                    sendEmailConfirmationForm.setFieldValue(
                      'newEmail',
                      event.currentTarget.value
                    )
                  }
                  radius="md"
                />

                <PasswordInput
                  required
                  placeholder="Your password"
                  value={sendEmailConfirmationForm.values.password}
                  error={sendEmailConfirmationForm.errors.password}
                  onChange={(event) =>
                    sendEmailConfirmationForm.setFieldValue(
                      'password',
                      event.currentTarget.value
                    )
                  }
                  radius="md"
                />

                {!!sendEmailConfirmationCompletedMessage.length && (
                  <p>{sendEmailConfirmationCompletedMessage}</p>
                )}
              </>
            )}

            {type === 'password' && (
              <>
                <PasswordInput
                  required
                  placeholder="Old password"
                  value={updatePasswordForm.values.oldPassword}
                  error={updatePasswordForm.errors.oldPassword}
                  onChange={(event) =>
                    updatePasswordForm.setFieldValue(
                      'oldPassword',
                      event.currentTarget.value
                    )
                  }
                  radius="md"
                />

                <PasswordInput
                  required
                  placeholder="New password"
                  value={updatePasswordForm.values.newPassword}
                  error={updatePasswordForm.errors.newPassword}
                  onChange={(event) =>
                    updatePasswordForm.setFieldValue(
                      'newPassword',
                      event.currentTarget.value
                    )
                  }
                  radius="md"
                />

                <PasswordInput
                  required
                  placeholder="Confirm your new password"
                  value={updatePasswordForm.values.confirmation}
                  error={updatePasswordForm.errors.confirmation}
                  onChange={(event) =>
                    updatePasswordForm.setFieldValue(
                      'confirmation',
                      event.currentTarget.value
                    )
                  }
                  radius="md"
                />
              </>
            )}

            <Button
              disabled={loading}
              type="submit"
              radius="xl"
              styles={{ root: { width: '150px' } }}
            >
              {loading ? <Loader color="blue" size="xs" /> : `Update ${type}`}
            </Button>
          </Stack>
        </form>
      </Paper>
    );
  };

  const Wrapper: FC<Wrapper> = ({ name, value }) => {
    return (
      <>
        <div className={styles.flexContainer} key={name}>
          <p>{`${name}: ${value}`}</p>
          <span
            onClick={() => handleTrigger(name.toLowerCase())}
            className={styles.change}
          >
            {`Update ${name}`}
          </span>
        </div>
        {name.toLowerCase() === 'name' && isNameTriggered && (
          <Form type="name" />
        )}
        {name.toLowerCase() === 'email' && isEmailTriggered && (
          <Form type="email" />
        )}
        {name.toLowerCase() === 'password' && isPasswordTriggered && (
          <Form type="password" />
        )}
      </>
    );
  };

  return (
    <div className={styles.container}>
      {Object.values(authorizedUserData).every((v) => v === null) ? (
        <div className={styles.notLoggedIn}>
          <h1>You don't have a cabinet yet</h1>
          <div className={styles.authLinks}>
            <Link to={'/sign-up'} className={styles.link}>
              Sign up
            </Link>
            <span className={styles.separator}>or</span>
            <Link to={'/sign-in'} className={styles.link}>
              Sign in
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.loggedIn}>
            <h1>{`Welcome, ${authorizedUserData.name}!`}</h1>
            <div className={styles.userInfo}>
              <h3>Your Info:</h3>
            </div>
          </div>

          <div>
            {Object.entries(userData).map((data) => (
              <Wrapper name={data[0]} value={data[1] as string} key={data[0]} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
