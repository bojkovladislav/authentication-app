import { FC, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateEmail } from '../../api/authorization';
import { getItem, setItem } from '../../utils/localStorageHelpers';

export const ConfirmationPage: FC = () => {
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmationToken = params.confirmationToken;

    if (!confirmationToken) return;

    let timeout: number;
    updateEmail(confirmationToken)
      .then((response) => {
        const { user } = getItem('AuthorizedUserData');

        setItem('AuthorizedUserData', {
          user: { ...user, email: response.data.updatedUser.email },
        });

        timeout = setTimeout(() => {
          navigate('/');
        }, 2000);
      })
      .catch((err) => console.log(err));

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return <div>Confirming email...</div>;
};
