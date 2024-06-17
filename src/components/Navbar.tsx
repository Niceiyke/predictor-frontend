import React from 'react';
import { useAuth } from '../context/AuthContext';


const Navbar: React.FC = () => {
  const { token, logout } = useAuth();
  

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex-shrink-0">
          <span className="text-white font-semibold text-xl">Logo</span>
        </div>
        <div className="hidden lg:flex lg:space-x-4">
          <a
            href='/'
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            title="Home"
          >
            Home
          </a>
          <a
            href='/fixtures'
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            title="About"
          >
            Fixtures
          </a>

          {token ? (
            <>
            <a
            href='/predictions'
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            title="Services"
          >
            Predictions
          </a>
            <button
              onClick={logout}
              className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              title="Logout"
            >
              Logout
            </button>
            </>
          ) : (
            <>
              <a
                href='/login'
                className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                title="Login"
              >
                Login
              </a>
              <a
                href='/register'
                className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                title="Register"
              >
                Register
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
