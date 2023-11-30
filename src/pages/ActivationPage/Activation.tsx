import { Dispatch, FC, useEffect, useState, SetStateAction } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { activate } from '../../api/authorization';
import { setItem } from '../../utils/localStorageHelpers';
import { AuthorizedUserData } from '../../utils/Types';
import { MessageBlock } from '../../components/MessageBlock/MessageBlock';

interface Props {
  setAuthorizedUserData: Dispatch<SetStateAction<AuthorizedUserData>>;
}

export const Activation: FC<Props> = ({ setAuthorizedUserData }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>();
  const [currentSecond, setCurrentSecond] = useState(3);
  const navigate = useNavigate();

  const params = useParams();

  useEffect(() => {
    const activationToken = params.activationToken;

    if (activationToken) {
      activate(activationToken)
        .then((res) => {
          const { name, email } = res.data.user;

          setLoading(true);
          setItem('AuthorizedUserData', res.data);
          setAuthorizedUserData({
            name,
            email,
            accessToken: res.data.accessToken,
          });
          setMessage('You have been successfully activated!');
        })
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    if (loading) return;

    if (currentSecond > 0) {
      const timer = setTimeout(() => {
        setCurrentSecond(currentSecond - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (currentSecond === 0) {
      navigate(`/${error && 'sign-up'}`);
    }
  }, [currentSecond, loading]);

  return (
    <MessageBlock title="Activation page" error={error ? true : false}>
      <p>{loading ? 'Loading...' : message}</p>
      {error && <p>{'Failed to save your data'}</p>}
      {message ||
        (error && (
          <p>{`You will be redirected to the ${
            error ? 'registration' : 'home'
          } page in ${currentSecond}`}</p>
        ))}
    </MessageBlock>
  );
};
