import { FC } from 'react';
import { NormalizedUser } from '../../utils/Types';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css'; // Import your CSS module for styling

interface Props {
  authorizedUserData: NormalizedUser;
}

export const HomePage: FC<Props> = ({ authorizedUserData }) => {
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
        <div className={styles.loggedIn}>
          <h1>{`Welcome, ${authorizedUserData.name}!`}</h1>
          <div className={styles.userInfo}>
            <h3>Your Info:</h3> 
            <p>{`Email: ${authorizedUserData.email}`}</p>
          </div>
        </div>
      )}
    </div>
  );
};
