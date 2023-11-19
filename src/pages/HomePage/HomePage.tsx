import { FC } from 'react';
import { NormalizedUser } from '../../utils/Types';
import { Link } from 'react-router-dom';

interface Props {
  authorizedUserData: NormalizedUser;
}

export const HomePage: FC<Props> = ({
  authorizedUserData,
}) => {

  return (
    <div>
      {Object.values(authorizedUserData).every((v) => v === null) ? (
        <div>
          <h1>You don`t have a cabinet yet</h1>
          <Link to={'/sign-up'}>Sign up</Link>
          <Link to={'/sign-in'}>Sign in</Link>
        </div>
      ) : (
        <div>
          <h1>{`Welcome ${authorizedUserData.name}!`}</h1>

          <h3>Here's your info: </h3>
          <p>{`Email: ${authorizedUserData.email}`}</p>
        </div>
      )}
    </div>
  );
};
