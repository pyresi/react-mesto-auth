import { useLocation, Link } from 'react-router-dom';
import headerLogo from '../images/header-logo.svg';

function Header({ onLogout, email }) {
  const location = useLocation();

  return (
    <header className="header">
      <img className="header__logo" alt="Лого сайта Места" src={headerLogo} />
      {location.pathname === '/' && (
        <div className="header__nav">
          <p className="header__nav-paragraph">{email}</p>
          <Link to="/sign-in" className="header__link" onClick={onLogout}>
            Выйти
          </Link>
        </div>
      )}
      {location.pathname === '/sign-in' && (
        <Link className="header__link" to="/sign-up">
          Регистрация
        </Link>
      )}
      {location.pathname === '/sign-up' && (
        <Link className="header__link" to="/sign-in">
          Войти
        </Link>
      )}
    </header>
  );
}

export default Header;
