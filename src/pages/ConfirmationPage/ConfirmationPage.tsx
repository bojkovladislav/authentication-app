import { FC, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateEmail } from '../../api/authorization';
import { getItem, setItem } from '../../utils/localStorageHelpers';
import { NotificationType } from '../../utils/Types';
import { MessageBlock } from '../../components/MessageBlock/MessageBlock';

interface Props {
  setNotification: (notification: NotificationType) => void;
}

export const ConfirmationPage: FC<Props> = ({ setNotification }) => {
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmationToken = params.confirmationToken;

    if (!confirmationToken) return;

    let timeout: number;
    updateEmail(confirmationToken)
      .then((response) => {
        const userData = getItem('AuthorizedUserData');
        const { user, accessToken } = userData;

        setItem('AuthorizedUserData', {
          user: { ...user, email: response.data.updatedUser.email },
          accessToken,
        });

        timeout = setTimeout(() => {
          navigate('/');
        }, 2000);
      })
      .catch((err) => {
        setNotification({
          message: 'Your confirmation token is not valid anymore :(',
          error: true,
        });
        navigate('/');
        console.log(err);
      });

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <MessageBlock title="Confirmation page" message="Confirming email..." />
  );
};
