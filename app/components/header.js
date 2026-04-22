import Link from 'next/link';
import Cookies from 'js-cookie';

const Header = () => {
  const userLogged = Cookies.get('userToken')
  const log = userLogged?"Login":"Logout"

  const logout = () =>{
    Cookies.remove('userToken')
  }

  return (
    <header className="bg-gray-800 text-white fixed top-0 left-0 w-full px-4 py-6 flex justify-between items-center z-50">
      <Link href="/">
        <span className="font-bold text-xl">Code generator</span>
      </Link>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href={'/'} className="hover:text-gray-400">
              Home
            </Link>
          </li>
          <li>
            <Link href={'/login'} className="hover:text-gray-400">
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
