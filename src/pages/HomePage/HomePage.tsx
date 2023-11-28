import { FC, useState, Dispatch, SetStateAction, useEffect } from 'react';
import { AuthorizedUserData, NormalizedUser, NotificationType } from '../../utils/Types';
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
    SetStateAction<AuthorizedUserData>
  >;
  setNotification: (notification: NotificationType) => void;
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
  setNotification,
}) => {
  const [isNameTriggered, setIsNameTriggered] = useState(false);
  const [isEmailTriggered, setIsEmailTriggered] = useState(false);
  const [isPasswordTriggered, setIsPasswordTriggered] = useState(false);
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
    setLoading: (loading: boolean) => void,
    form: any
  ) => {
    if (!userDataFromStorage) return;

    setLoading(true);

    try {
      const response = await updateName(userDataFromStorage.user.id, newName);
      const { name } = response.data.updatedUser;
      const { user, accessToken } = userDataFromStorage;

      setItem(nameOfLocalUserData, {
        user: { ...userDataFromStorage.user, name },
        accessToken: userDataFromStorage.accessToken,
      });
      setAuthorizedUserData({ name, email: user.email, accessToken  });
      setIsNameTriggered(false);
      setNotification({
        message: 'You have successfully updated a name!',
      });
    } catch (error: any) {
      form.setFieldError('newName', error.response.data.errors.name);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailConfirmation = async (
    newEmail: string,
    password: string,
    setLoading: (loading: boolean) => void,
    form: any
  ) => {
    if (!userDataFromStorage) return;

    setLoading(true);

    try {
      const response = await sendConfirmationEmail(
        userDataFromStorage.user.id,
        newEmail,
        password
      );
      setNotification({
        message: response.data.message,
      });
    } catch (error: any) {
      const { email, password } = error.response.data.errors;

      form.setErrors({ password, newEmail: email });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (
    oldPassword: string,
    newPassword: string,
    confirmation: string,
    setLoading: (loading: boolean) => void,
    form: any
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

      setIsPasswordTriggered(false);
      setNotification({
        message: response.data.message,
      });
    } catch (error: any) {
      const { oldPassword, newPassword, confirmation } =
        error.response.data.errors;

      form.setErrors({
        oldPassword,
        newPassword,
        confirmation,
      });
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
        newName: (val: any) =>
          /\d/.test(val) ? 'Name cannot contain any numbers!' : null,
      },
    });

    const sendEmailConfirmationForm = useForm({
      initialValues: {
        newEmail: '',
        password: '',
      },
      validate: {
        newEmail: (val: any) =>
          !/^\S+@\S+$/.test(val) ? 'Invalid email!' : null,

        password: (val: any) =>
          val.length < 6
            ? 'Password should be at least 6 characters length!'
            : null,
      },
    });

    const updatePasswordForm = useForm({
      initialValues: {
        oldPassword: '',
        newPassword: '',
        confirmation: '',
      },
      validate: {
        newPassword: (val: any) =>
          val.length < 6 ? 'Your password length should be more than 6!' : null,
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
                    setLoading,
                    updateNameForm
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
                    setLoading,
                    sendEmailConfirmationForm
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
                    setLoading,
                    updatePasswordForm
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

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);

    const name = urlSearchParams.get('name');
    const email = urlSearchParams.get('email');
    const accessToken = urlSearchParams.get('accessToken');
    const id = urlSearchParams.get('id');

    if (name && email && accessToken) {
      setAuthorizedUserData({ name, email, accessToken });
      setItem(nameOfLocalUserData, { user: { id, name, email }, accessToken });
    }
  }, []);

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
