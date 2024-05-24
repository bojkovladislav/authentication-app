import { Dispatch, FC, useEffect, useState, SetStateAction } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { activate } from '../../api/authorization';
import { setItem } from '../../utils/localStorageHelpers';
import { AuthorizedUserData, UserData } from '../../utils/Types';
import { MessageBlock } from '../../components/MessageBlock/MessageBlock';

interface Props {
  setAuthorizedUserData: Dispatch<SetStateAction<AuthorizedUserData>>;
}

export const Activation: FC<Props> = ({ setAuthorizedUserData }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSecond, setCurrentSecond] = useState(3);
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  const params = useParams();

  useEffect(() => {
    const activationToken = params.activationToken;

    if (activationToken) {
      activate(activationToken)
        .then((res) => {
          setLoading(true);
          setUserData(res.data);
          setMessage('Your account has been successfully activated!');
        })
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    if (!loading && currentSecond > 0) {
      const timer = setTimeout(() => {
        setCurrentSecond((prevSecond) => prevSecond - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (currentSecond === 0) {
      if (userData) {
        const { name, email } = userData.user;

        setItem('AuthorizedUserData', userData);
        setAuthorizedUserData({
          name,
          email,
          accessToken: userData.accessToken,
        });
      }

      navigate(error ? 'sign-up' : '/');
    }
  }, [currentSecond, loading, error, navigate]);

  return (
    <MessageBlock title="Activation page" error={!!error}>
      <p>{loading ? 'Loading...' : message}</p>
      {error && <p>{'Failed to save your data'}</p>}
      <p>{`You will be redirected to the ${
        error ? 'registration' : 'home'
      } page in ${currentSecond}`}</p>
    </MessageBlock>
  );
};
