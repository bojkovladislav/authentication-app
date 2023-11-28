import { FC, useEffect, Dispatch, SetStateAction } from 'react';
import { setItem } from '../../utils/localStorageHelpers';
import { useNavigate } from 'react-router-dom';
import { AuthorizedUserData } from '../../utils/Types';

interface Props {
  setAuthorizedUserData: Dispatch<
    SetStateAction<AuthorizedUserData>
  >;
}

export const GoogleAuth: FC<Props> = ({ setAuthorizedUserData }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fragment = window.location.hash.substring(1);
    const urlSearchParams = new URLSearchParams(fragment);

    const name = urlSearchParams.get('name');
    const email = urlSearchParams.get('email');
    const accessToken = urlSearchParams.get('accessToken');
    const id = urlSearchParams.get('id');

    if (name && email && accessToken) {
      setAuthorizedUserData({ name, email, accessToken });
      setItem('AuthorizedUserData', { user: { id, name, email }, accessToken });

      navigate('/');
    }
  }, []);

  return <></>;
};
