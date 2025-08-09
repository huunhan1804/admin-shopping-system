import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home, Users, Package, BarChart3, Shield,
  ChevronDown, ChevronRight, Clock, FileText, UserCheck,
  Store, LogOut, Menu, X, User, Activity, Grid, ChevronLeft,
} from "lucide-react";
import apiService from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const Badge = memo(({ count, variant = "yellow" }) => {
  if (!count || count === 0) return null;
  const variants = {
    yellow: "bg-yellow-500 text-white",
    red: "bg-red-500 text-white",
    green: "bg-green-500 text-white",
    blue: "bg-blue-500 text-white",
  };
  return (
    <span className={`${variants[variant]} text-xs px-2 py-1 rounded-full ml-auto animate-pulse`}>
      {count > 99 ? "99+" : count}
    </span>
  );
});
Badge.displayName = "Badge";

const shallowEqual = (a, b) => {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (a[k] !== b[k]) return false;
  return true;
};

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const [pendingCounts, setPendingCounts] = useState({
    pendingProducts: 0,
    pendingApplications: 0,
    pendingClaims: 0,
  });
  const [expandedMenus, setExpandedMenus] = useState({
    products: false,
    users: false,
    insurance: false,
    settings: false,
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // ---- Polling thông minh ----
  const loadPendingCounts = useCallback(async (signal) => {
    try {
      const response = await apiService.get("/admin/pending-counts", { signal });
      setPendingCounts(prev => (shallowEqual(prev, response) ? prev : response));
    } catch (err) {
      if (err?.name === "AbortError") return;
      // console.error(err);
    }
  }, []);

  useEffect(() => {
    let timer;
    let aborted = false;
    const controller = new AbortController();

    const start = async () => {
      await loadPendingCounts(controller.signal);
      const tick = async () => {
        if (document.visibilityState === "visible" && !aborted) {
          await loadPendingCounts(controller.signal);
        }
        timer = window.setTimeout(tick, 300000); // 5 phút
      };
      timer = window.setTimeout(tick, 300000);
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") loadPendingCounts(controller.signal);
    };
    const onFocus = () => loadPendingCounts(controller.signal);

    start();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    return () => {
      aborted = true;
      controller.abort();
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    };
  }, [loadPendingCounts]);

  // ---- Auto-expand theo route ----
  useEffect(() => {
    const path = location.pathname;
    setExpandedMenus(prev => ({
      ...prev,
      products: prev.products || path.startsWith("/products"),
      users: prev.users || path.startsWith("/users"),
      insurance: prev.insurance || path.startsWith("/insurance"),
      settings: prev.settings || path.startsWith("/settings"),
    }));
  }, [location.pathname]);

  const toggleMenu = useCallback((menuKey) => {
    setExpandedMenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
  }, []);
  const toggleCollapse = useCallback(() => setIsCollapsed(v => !v), []);
  const toggleMobile = useCallback(() => setIsMobileOpen(v => !v), []);
  const handleLogout = useCallback(async () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) await logout();
  }, [logout]);

  const isActiveChild = useCallback((childPath) => {
    const full = location.pathname + location.search;
    return full === childPath || location.pathname === childPath;
  }, [location.pathname, location.search]);

  const menuItems = useMemo(() => ([
    { path: "/dashboard", label: "Dashboard", icon: Home, exact: true, description: "Tổng quan hệ thống" },
    {
      key: "products", label: "Quản lý sản phẩm", icon: Package, expandable: true, description: "Sản phẩm cửa hàng",
      children: [
        { path: "/products", label: "Tất cả sản phẩm", icon: Grid, description: "Danh sách toàn bộ sản phẩm" },
        { path: "/products/pending", label: "Chờ duyệt", icon: Clock, badge: pendingCounts.pendingProducts, badgeVariant: "yellow", description: "Sản phẩm cần phê duyệt" },
      ],
    },
    {
      key: "users", label: "Quản lý tài khoản", icon: Users, expandable: true, description: "Quản lý người dùng",
      children: [
        { path: "/users/customers", label: "Khách hàng", icon: User, description: "Quản lý khách hàng" },
        { path: "/users/agencies", label: "Agency", icon: Store, description: "Quản lý đại lý bán hàng" },
        { path: "/users/agencies/applications", label: "Đơn đăng ký Agency", icon: FileText, badge: pendingCounts.pendingApplications, badgeVariant: "blue", description: "Đơn đăng ký cần duyệt" },
      ],
    },
    {
      key: "insurance", label: "Quản lý bảo hiểm", icon: Shield, expandable: true, description: "Yêu cầu bồi thường",
      children: [
        { path: "/insurance", label: "Tất cả yêu cầu", icon: Shield, description: "Danh sách yêu cầu bồi thường" },
        { path: "/insurance?status=SUBMITTED", label: "Chờ xử lý", icon: Clock, badge: pendingCounts.pendingClaims, badgeVariant: "red", description: "Yêu cầu chờ xử lý" },
        { path: "/insurance?status=UNDER_REVIEW", label: "Đang xem xét", icon: Activity, description: "Đang được xem xét" },
        { path: "/insurance?status=APPROVED", label: "Đã duyệt", icon: UserCheck, description: "Đã được phê duyệt" },
      ],
    },
    { path: "/reports", label: "Báo cáo và Phân tích", icon: BarChart3, exact: true, description: "Thống kê và báo cáo" },
  ]), [pendingCounts]);

  const renderMenuItem = useCallback((item) => {
    if (item.expandable) {
      const isExpanded = expandedMenus[item.key];
      const hasActivePath = item.children?.some((child) => isActiveChild(child.path));

      return (
        <li key={item.key} className="mb-1">
          <button
            onClick={() => toggleMenu(item.key)}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 group ${
              hasActivePath
                ? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-400 ring-opacity-50"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            title={isCollapsed ? item.label : ""}
          >
            <div className="flex items-center min-w-0">
              <item.icon className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"} mr-3 flex-shrink-0 ${hasActivePath ? "text-blue-100" : ""}`} />
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <span className={`text-sm font-medium block truncate ${hasActivePath ? "text-white" : ""}`}>{item.label}</span>
                  <span className={`text-xs block truncate ${hasActivePath ? "text-blue-100" : "text-gray-400"}`}>{item.description}</span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <div className="flex items-center ml-2">
                {item.children?.some((child) => child.badge) && (
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse" />
                )}
                {isExpanded ? (
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${hasActivePath ? "text-blue-100" : ""}`} />
                ) : (
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${hasActivePath ? "text-blue-100" : ""}`} />
                )}
              </div>
            )}
          </button>

          {isExpanded && !isCollapsed && (
            <ul className="mt-2 space-y-1 border-l-2 border-gray-600 pl-4">
              {item.children.map((child) => (
                <li key={child.path}>
                  <NavLink
                    to={child.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 group ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg ring-2 ring-blue-300 ring-opacity-30"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-md"
                      }`
                    }
                    title={child.description}
                  >
                    <child.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="block truncate font-medium">{child.label}</span>
                      <span className={`text-xs block truncate ${isActiveChild(child.path) ? "text-blue-100" : "text-gray-400"}`}>
                        {child.description}
                      </span>
                    </div>
                    <Badge count={child.badge} variant={child.badgeVariant} />
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={item.path} className="mb-1">
        <NavLink
          to={item.path}
          end={item.exact}
          className={({ isActive }) =>
            `flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
              isActive
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg ring-2 ring-blue-300 ring-opacity-30 transform scale-[1.02]"
                : "text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-md hover:transform hover:scale-[1.01]"
            }`
          }
          title={isCollapsed ? item.label : item.description}
        >
          <item.icon className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"} mr-3 flex-shrink-0`} />
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <span className="text-sm font-medium block truncate">{item.label}</span>
              <span className={`text-xs block truncate ${location.pathname === item.path ? "text-blue-100" : "text-gray-400"}`}>
                {item.description}
              </span>
            </div>
          )}
        </NavLink>
      </li>
    );
  }, [expandedMenus, isCollapsed, isActiveChild, location.pathname, toggleMenu]);

  const sidebarWidth = isCollapsed ? "w-20" : "w-72";
  const mobileClasses = isMobileOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={toggleMobile} />
      )}

      <button
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-800 text-white p-2 rounded-lg shadow-lg"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside
        className={`${sidebarWidth} bg-gradient-to-b from-gray-800 via-gray-800 to-gray-900 text-white 
        min-h-screen flex flex-col shadow-2xl border-r border-gray-700
        fixed lg:relative z-50 lg:z-auto
        transition-all duration-300 ease-in-out
        ${mobileClasses} lg:translate-x-0`}
      >
        <div className={`border-b border-gray-700 bg-gradient-to-r from-indigo-600 to-purple-600 ${isCollapsed ? "p-2" : "p-4"}`}>
          {isCollapsed ? (
            <div className="flex justify-center">
              <button
                onClick={toggleCollapse}
                className="relative p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 group shadow-lg hover:shadow-xl hover:scale-105"
                title="Mở rộng sidebar"
              >
                <ChevronRight className="w-5 h-5 text-white group-hover:text-indigo-100 transition-all duration-300 group-hover:translate-x-0.5" />
                <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="absolute inset-0 rounded-xl ring-2 ring-white ring-opacity-0 group-hover:ring-opacity-30 transition-all duration-300"></div>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-lg">
                  <Store className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">CTU Shop</h2>
                  <p className="text-xs text-indigo-200">Admin Panel</p>
                </div>
              </div>
              <button
                onClick={toggleCollapse}
                className="hidden lg:block p-2 rounded-lg hover:bg-white/20 transition-all duration-300 group"
                title="Thu gọn sidebar"
              >
                <ChevronLeft className="w-4 h-4 text-white group-hover:text-indigo-100 transition-all duration-300 group-hover:-translate-x-0.5" />
              </button>
            </div>
          )}
        </div>

        {!isCollapsed &&
          (pendingCounts.pendingProducts > 0 ||
            pendingCounts.pendingApplications > 0 ||
            pendingCounts.pendingClaims > 0) && (
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Cần xử lý</h3>
              <div className="space-y-2">
                {pendingCounts.pendingProducts > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Sản phẩm</span>
                    <Badge count={pendingCounts.pendingProducts} variant="yellow" />
                  </div>
                )}
                {pendingCounts.pendingApplications > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Đơn đăng ký</span>
                    <Badge count={pendingCounts.pendingApplications} variant="blue" />
                  </div>
                )}
                {pendingCounts.pendingClaims > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Bảo hiểm</span>
                    <Badge count={pendingCounts.pendingClaims} variant="red" />
                  </div>
                )}
              </div>
            </div>
          )}

        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1">{menuItems.map(renderMenuItem)}</ul>
        </nav>

        <div className="p-4 border-t border-gray-700 bg-gray-750">
          {!isCollapsed ? (
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-xs text-gray-500">© 2025 CTU Shop</div>
                <div className="text-xs text-gray-600">Version 1.0.0</div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-2 text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-20 rounded-lg transition-all duration-200"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
      `}</style>
    </>
  );
};

export default Sidebar;
