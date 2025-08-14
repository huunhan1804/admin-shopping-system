import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Package,
  BarChart3,
  Shield,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  UserCheck,
  Store,
  LogOut,
  Menu,
  X,
  User,
  Activity,
  Grid,
  ChevronLeft,
  BookOpen,
  Leaf,
  Info,
} from "lucide-react";
import apiService from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

/* ---------- Reusable Badge ---------- */
const Badge = memo(({ count, variant = "yellow" }) => {
  if (!count || count === 0) return null;
  const variants = {
    yellow: "bg-amber-500 text-white",
    red: "bg-rose-500 text-white",
    green: "bg-emerald-500 text-white",
    blue: "bg-sky-500 text-white",
  };
  return (
    <span
      className={`${variants[variant]} text-[10px] px-2 py-0.5 rounded-full ml-auto`}
      aria-label={`badge: ${count}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
});
Badge.displayName = "Badge";

/* ---------- Shallow Equal helper ---------- */
const shallowEqual = (a, b) => {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false;
  const ka = Object.keys(a),
    kb = Object.keys(b);
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

  /* ---------- Smart polling ---------- */
  const loadPendingCounts = useCallback(async (signal) => {
    try {
      const response = await apiService.get("/admin/pending-counts", { signal });
      setPendingCounts((prev) =>
        shallowEqual(prev, response) ? prev : response
      );
    } catch (err) {
      if (err?.name === "AbortError") return;
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
      if (document.visibilityState === "visible")
        loadPendingCounts(controller.signal);
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

  /* ---------- Auto expand by route ---------- */
  useEffect(() => {
    const path = location.pathname;
    setExpandedMenus((prev) => ({
      ...prev,
      products: prev.products || path.startsWith("/products"),
      users: prev.users || path.startsWith("/users"),
      insurance: prev.insurance || path.startsWith("/insurance"),
      settings: prev.settings || path.startsWith("/settings"),
    }));
  }, [location.pathname]);

  const toggleMenu = useCallback((menuKey) => {
    setExpandedMenus((prev) => ({ ...prev, [menuKey]: !prev[menuKey] }));
  }, []);
  const toggleCollapse = useCallback(() => setIsCollapsed((v) => !v), []);
  const toggleMobile = useCallback(() => setIsMobileOpen((v) => !v), []);
  const handleLogout = useCallback(async () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) await logout();
  }, [logout]);

  const isActiveChild = useCallback(
    (childPath) => {
      const full = location.pathname + location.search;
      return full === childPath || location.pathname === childPath;
    },
    [location.pathname, location.search]
  );

  /* ---------- Menu items ---------- */
  const menuItems = useMemo(
    () => [
      {
        path: "/dashboard",
        label: "Dashboard",
        icon: Home,
        exact: true,
        description: "Tổng quan hệ thống",
      },
      {
        key: "products",
        label: "Quản lý sản phẩm",
        icon: Package,
        expandable: true,
        description: "Sản phẩm cửa hàng",
        children: [
          {
            path: "/products",
            label: "Tất cả sản phẩm",
            icon: Grid,
            description: "Danh sách toàn bộ sản phẩm",
          },
          {
            path: "/products/pending",
            label: "Chờ duyệt",
            icon: Clock,
            badge: pendingCounts.pendingProducts,
            badgeVariant: "yellow",
            description: "Sản phẩm cần phê duyệt",
          },
        ],
      },
      {
        key: "users",
        label: "Quản lý tài khoản",
        icon: Users,
        expandable: true,
        description: "Quản lý người dùng",
        children: [
          {
            path: "/users/customers",
            label: "Khách hàng",
            icon: User,
            description: "Quản lý khách hàng",
          },
          {
            path: "/users/agencies",
            label: "Agency",
            icon: Store,
            description: "Quản lý đại lý bán hàng",
          },
          {
            path: "/users/agencies/applications",
            label: "Đơn đăng ký Agency",
            icon: FileText,
            badge: pendingCounts.pendingApplications,
            badgeVariant: "blue",
            description: "Đơn đăng ký cần duyệt",
          },
        ],
      },
      {
        key: "insurance",
        label: "Quản lý bảo hiểm",
        icon: Shield,
        expandable: true,
        description: "Yêu cầu bồi thường",
        children: [
          {
            path: "/insurance",
            label: "Tất cả yêu cầu",
            icon: Shield,
            description: "Danh sách yêu cầu bồi thường",
          },
          {
            path: "/insurance?status=SUBMITTED",
            label: "Chờ xử lý",
            icon: Clock,
            badge: pendingCounts.pendingClaims,
            badgeVariant: "red",
            description: "Yêu cầu chờ xử lý",
          },
          {
            path: "/insurance?status=UNDER_REVIEW",
            label: "Đang xem xét",
            icon: Activity,
            description: "Đang được xem xét",
          },
          {
            path: "/insurance?status=APPROVED",
            label: "Đã duyệt",
            icon: UserCheck,
            description: "Đã được phê duyệt",
          },
        ],
      },
      {
        path: "/reports",
        label: "Báo cáo & Phân tích",
        icon: BarChart3,
        exact: true,
        description: "Thống kê và báo cáo",
      },
      {
        label: "Thư viện hỗ trợ",
        path: "/support-library",
        icon: BookOpen,
        badge: null,
        description: "Hướng dẫn & bài viết",
      },
    ],
    [pendingCounts]
  );

  /* ---------- Render item ---------- */
  const renderMenuItem = useCallback(
    (item) => {
      if (item.expandable) {
        const isExpanded = expandedMenus[item.key];
        const hasActivePath = item.children?.some((child) =>
          isActiveChild(child.path)
        );

        return (
          <li key={item.key} className="mb-1">
            <button
              onClick={() => toggleMenu(item.key)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${
                  hasActivePath
                    ? "bg-emerald-600 text-white shadow-lg ring-1 ring-emerald-300"
                    : "text-slate-200 hover:bg-slate-800/80 hover:text-white"
                }`}
              title={isCollapsed ? item.label : ""}
              aria-expanded={isExpanded}
            >
              <div className="flex items-center min-w-0">
                <item.icon
                  className={`${
                    isCollapsed ? "w-6 h-6" : "w-5 h-5"
                  } mr-3 flex-shrink-0 ${
                    hasActivePath ? "text-emerald-100" : "text-emerald-300/70"
                  }`}
                />
                {!isCollapsed && (
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-semibold block truncate">
                      {item.label}
                    </span>
                    <span
                      className={`text-[11px] block truncate ${
                        hasActivePath ? "text-emerald-100" : "text-slate-400"
                      }`}
                    >
                      {item.description}
                    </span>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <div className="flex items-center ml-2">
                  {item.children?.some((child) => child.badge) && (
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2" />
                  )}
                  {isExpanded ? (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        hasActivePath ? "text-emerald-100" : "text-slate-300"
                      }`}
                    />
                  ) : (
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        hasActivePath ? "text-emerald-100" : "text-slate-300"
                      }`}
                    />
                  )}
                </div>
              )}
            </button>

            {isExpanded && !isCollapsed && (
              <ul className="mt-2 space-y-1 border-l border-slate-700/60 pl-4">
                {item.children.map((child) => (
                  <li key={child.path}>
                    <NavLink
                      to={child.path}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-lg transition-all duration-200 group ${
                          isActive
                            ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg ring-1 ring-emerald-300"
                            : "text-slate-200 hover:bg-slate-800/70 hover:text-white"
                        }`
                      }
                      title={child.description}
                    >
                      <child.icon className="w-4 h-4 mr-3 flex-shrink-0 text-emerald-300/80" />
                      <div className="flex-1 min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {child.label}
                        </span>
                        <span
                          className={`text-[11px] block truncate ${
                            isActiveChild(child.path)
                              ? "text-emerald-100"
                              : "text-slate-400"
                          }`}
                        >
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
              `flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg ring-1 ring-emerald-300 transform"
                  : "text-slate-200 hover:bg-slate-800/70 hover:text-white"
              }`
            }
            title={isCollapsed ? item.label : item.description}
          >
            <item.icon
              className={`${
                isCollapsed ? "w-6 h-6" : "w-5 h-5"
              } mr-3 flex-shrink-0 text-emerald-300/80`}
            />
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <span className="text-sm font-semibold block truncate">
                  {item.label}
                </span>
                <span
                  className={`text-[11px] block truncate ${
                    location.pathname === item.path
                      ? "text-emerald-100"
                      : "text-slate-400"
                  }`}
                >
                  {item.description}
                </span>
              </div>
            )}
          </NavLink>
        </li>
      );
    },
    [expandedMenus, isCollapsed, isActiveChild, location.pathname, toggleMenu]
  );

  const sidebarWidth = isCollapsed ? "w-20" : "w-72";
  const mobileClasses = isMobileOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-[1px] z-40 lg:hidden"
          onClick={toggleMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Toggle */}
      <button
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 lg:hidden bg-emerald-700 text-white p-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
        aria-label="Mở menu"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${sidebarWidth} bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white 
        min-h-screen flex flex-col shadow-2xl border-r border-slate-800
        fixed lg:relative z-50 lg:z-auto
        transition-all duration-300 ease-in-out
        ${mobileClasses} lg:translate-x-0`}
        aria-label="Sidebar điều hướng"
      >
        {/* Header / Brand */}
        <div
          className={`border-b border-slate-800 bg-gradient-to-r from-emerald-700 to-emerald-600 ${
            isCollapsed ? "p-2" : "p-4"
          }`}
        >
          {isCollapsed ? (
            <div className="flex justify-center">
              <button
                onClick={toggleCollapse}
                className="relative p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/40"
                title="Mở rộng sidebar"
                aria-label="Mở rộng sidebar"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mr-3 shadow-lg ring-1 ring-emerald-100">
                  <Leaf className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    CTU Shop
                  </h2>
                  <p className="text-[11px] text-emerald-100/90">
                    Wellness Admin Panel
                  </p>
                </div>
              </div>
              <button
                onClick={toggleCollapse}
                className="hidden lg:block p-2 rounded-lg hover:bg-white/15 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
                title="Thu gọn sidebar"
                aria-label="Thu gọn sidebar"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Need Attention summary */}
        {!isCollapsed &&
          (pendingCounts.pendingProducts > 0 ||
            pendingCounts.pendingApplications > 0 ||
            pendingCounts.pendingClaims > 0) && (
            <div className="p-4 border-b border-slate-800/80 bg-emerald-950/20">
              <div className="flex items-center gap-2 mb-2 text-emerald-200">
                <Info className="w-4 h-4" />
                <h3 className="text-xs font-semibold uppercase tracking-wider">
                  Cần xử lý
                </h3>
              </div>
              <div className="space-y-2">
                {pendingCounts.pendingProducts > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Sản phẩm</span>
                    <Badge
                      count={pendingCounts.pendingProducts}
                      variant="yellow"
                    />
                  </div>
                )}
                {pendingCounts.pendingApplications > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Đơn đăng ký</span>
                    <Badge
                      count={pendingCounts.pendingApplications}
                      variant="blue"
                    />
                  </div>
                )}
                {pendingCounts.pendingClaims > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Bảo hiểm</span>
                    <Badge count={pendingCounts.pendingClaims} variant="red" />
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1">{menuItems.map(renderMenuItem)}</ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90">
          {!isCollapsed ? (
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Đăng xuất</span>
              </button>
              <div className="text-center">
                <div className="text-[11px] text-slate-500">
                  © {new Date().getFullYear()} CTU Shop
                </div>
                <div className="text-[11px] text-slate-500">Version 1.0.0</div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-2 text-rose-300 hover:text-rose-200 hover:bg-rose-900/20 rounded-lg transition"
                title="Đăng xuất"
                aria-label="Đăng xuất"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Local CSS for scrollbar & tooltip on collapsed mode */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(2, 6, 23, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.18);
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.28);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
