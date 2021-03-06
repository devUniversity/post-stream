import React, { Component, PropTypes } from 'react';
import NavLink from '../navigation/NavLink';
import Login from '../auth/login/Login';
import LogoutButton from '../auth/logout/LogoutButton';
import { login } from '../../../actions/auth/loginActions';
import { logoutUser } from '../../../actions/auth/logoutActions';
import styles from './Header.scss';

class Header extends Component {
  render() {
    const {
      dispatch,
      isAuthenticated,
      errorMessage
    } = this.props;

    const profile = JSON.parse(localStorage.getItem('profile'));

    return (
      <div>
        <header className={ styles.header_bar }>
          <NavLink to='/' onlyActiveOnIndex={ true } className={ styles.header_logo }>PostStream</NavLink>
          <ul className={ styles.header_nav }>
            <li>[ <NavLink to='/about'>?</NavLink> ]</li>
            { !isAuthenticated &&
              <Login
               errorMessage={ errorMessage }
               onLoginClick={ creds => dispatch(login(creds, this.props.auth)) }
              />
            }
            { isAuthenticated &&
              <li>[ <NavLink to={ `/user/${ profile.user_id }` }>profile</NavLink> ]</li>
            }
            { isAuthenticated &&
              <LogoutButton onLogoutClick={() => dispatch(logoutUser())} />
            }
          </ul>
        </header>
      </div>
    )
  }
}

Header.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string
}

export default Header;
