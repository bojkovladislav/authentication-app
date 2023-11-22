import { Dispatch, FC, useEffect, useState, SetStateAction } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { activate } from '../../api/authorization';
import { setItem } from '../../utils/localStorageHelpers';

interface Props {
  setAuthorizedUserData: Dispatch<
    SetStateAction<{ name: null | string; email: null | string }>
  >;
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
          setAuthorizedUserData({ name, email });
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
      navigate('/');
    }
  }, [currentSecond, loading]);

  return (
    <div>
      <h1>{loading ? 'Loading...' : message}</h1>
      {error && 'Failed to save your data: '}
      <h2>{`You will be redirected to the home page in ${currentSecond}`}</h2>
    </div>
  );
};
