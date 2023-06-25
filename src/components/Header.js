import headerLogo from '../images/header-logo.svg';
function Header() {
  return (
    <header className="header">
      <img className="header__logo" alt="Лого сайта Места" src={headerLogo} />
    </header>
  );
}

export default Header;
