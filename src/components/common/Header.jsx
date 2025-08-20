import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  LogOut, 
  User,
  Menu,
} from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Left side - Title */}
        <div className="flex items-center">
          <button className="lg:hidden mr-4 p-2 rounded-md text-gray-600 hover:bg-gray-100">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            CTU Shopping Admin Panel
          </h1>
        </div>

        
        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.username || 'Admin'}</p>
                <p className="text-xs text-gray-500">Quản trị viên</p>
              </div>
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-65 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <p className="font-medium">{user?.username || 'Admin'}</p>
                    <p className="text-gray-500">{user?.username}@ctushop.com</p>
                  </div>                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;