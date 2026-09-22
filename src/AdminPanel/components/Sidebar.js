import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  ChevronsLeft, 
  ChevronsRight, 
  LayoutDashboard, 
  Boxes, 
  UsersRound, 
  ChartNoAxesCombined, 
  ClipboardList, 
  ChevronDown, 
  ChevronRight, 
  Files, 
  LayoutGrid, 
  Award, 
  UserIcon, 
  GiftIcon, 
  TagIcon, 
  ChartBarIcon, 
  MessageSquareDiffIcon, 
  MegaphoneIcon, 
  SquarePercentIcon, 
  ImagesIcon, 
  LayoutDashboardIcon, 
  LayoutListIcon, 
  MapPinnedIcon, 
  ListTreeIcon, 
  MessagesSquareIcon, 
  TestTube,
  FlaskConical,
  Truck,
  PackagePlus,
  Users
} from "lucide-react";

import { socket } from "../socket";

const Sidebar = ({collapsed, setCollapsed}) => {
  const location = useLocation();
  const [notifications, setNotifications] = useState({
    dashboard: false, 
    orders: false,
    inventory: false,
    users: false,
  });

  socket.on('new-order', () => {
    setNotifications(prev => ({
      ...prev, orders: true
    }))
  })

  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSidebar = () => setCollapsed(!collapsed);

  const toggleSubmenu = (itemName) => {
    setOpenSubmenus((prev) => ({
        ...prev,
        [itemName]: !prev[itemName],
    }));
  };

  const navItems = [
    { 
        name: "Dashboard", 
        path: "/", 
        icon: <LayoutDashboard size={20} />,
        key: "dashboard"
    },
    { 
        name: "Products", 
        path: "/products", 
        icon: <Boxes size={20} />,
        key: "products"
    },
    {
      name: "Categories",
      path: "/categories",
      icon: <LayoutGrid size={20} />,
      key: "categories",
      submenu: [
        {name: "Dashboard", path: "/categories/dashboard", icon: <LayoutDashboardIcon size={20} />},
        {name: "Categories", path: "/categories/all", icon: <ListTreeIcon size={20} />},
      ]
    },
    {
      name: "Orders",
      path: "/orders",
      icon: <ClipboardList size={20} />,
      key: "orders",
      submenu: [
        { name: "Dashboard", path: "/orders/dashboard", icon: <LayoutDashboardIcon size={20} />},
        { name: "Orders", path: "/orders/list", icon: <LayoutListIcon size={20} />},
        { name: "Order Map", path: "/orders/map", icon: <MapPinnedIcon size={20} />},
      ]
    },
    {
        name: "Delivery",
        path: "/deliveries",
        icon: <Truck size={20} />,
        key: "users",
        submenu: [
          { name: "Assign Orders", path: "/deliveries/assign", icon: <PackagePlus size={20} />},
          { name: "Drivers", path: "/deliveries/drivers", icon: <Users size={20} />},
        ]
    },
    {
      name: "CMS",
      path: "/cms",
      icon: <Files size={20} />,
      key: "cms",
      submenu: [
        { name: "Announcements", path: "/cms/announcements", icon: <MegaphoneIcon size={20}/>},
        { name: "Banner Slider", path: "/cms/banners/slider", icon: <ImagesIcon size={20} />},
        { name: "Promotional Banners", path: "/cms/banners/promotional", icon: <SquarePercentIcon size={20}/>},
        { name: "Offer Items Section", path: "/cms/offers", icon: <TagIcon size={20}/>},
        { name: "Homepage Sections", path: "/cms/new-arrivals", icon: <TagIcon size={20}/>},
      ]
    },
    {
      name: "Feedback",
      path: "/feedback",
      icon: <MessagesSquareIcon size={20} />,
      key: "feedback"
    },
    {
      name: "Loyalty Members",
      path: "/loyalty",
      icon: <Award size={20} />,
      key: "loyalty",
      submenu: [
        {name: "Loyalty Members", path: "/loyalty/users", icon: <UserIcon size={20}/>},
        {name: "Loyalty Rewards", path: "/loyalty/rewards", icon: <GiftIcon size={20}/>},
        {name: "Loyalty Deals", path: "/loyalty/deals", icon: <TagIcon size={20}/>},
        {name: "Loyalty Analytics", path: "/loyalty/analytics", icon: <ChartBarIcon size={20}/>},
        {name: "SMS Template", path: "/loyalty/sms-template", icon: <MessageSquareDiffIcon size={20}/>},
      ]
    },
    {
        name: "Users",
        path: "/users",
        icon: <UsersRound size={20} />,
        key: "users",
    },
    // {
    //     name: "Test",
    //     path: "/test",
    //     icon: <FlaskConical size={20} />,
    //     key: "users",
    // },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-800 text-white transition-all duration-300 z-50 ${
        collapsed ? "w-20" : "w-64"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        {!collapsed && <span className="text-xl font-bold">Admin Panel</span>}
        <button onClick={toggleSidebar} className="ml-auto">
          {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <div key={item.name}>
            {item.submenu ? (
              <>
                <button
                  onClick={() => toggleSubmenu(item.name)}
                  className={`group w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg transition-all ${
                    location.pathname.startsWith(item.path)
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {item.icon}
                      {item.key && notifications[item.key] && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
                      )}
                    </div>
                    {!collapsed && <span>{item.name}</span>}
                  </div>
                  {!collapsed && (
                    openSubmenus[item.name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                  )}
                </button>

                {!collapsed && openSubmenus[item.name] && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <NavLink
                        key={subItem.name}
                        to={subItem.path}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 rounded-lg text-sm transition-all ${
                            isActive
                              ? "bg-blue-500/20 text-blue-400"
                              : "hover:bg-gray-700/50 text-gray-300"
                          }`
                        }
                      >
                        {/* Icon with proper alignment */}
                        {subItem.icon && (
                          <span className="flex items-center justify-center mr-2 w-5 h-5">
                            {typeof subItem.icon === 'string' ? (
                              <i className={subItem.icon} />
                            ) : (
                              React.cloneElement(subItem.icon, { className: "w-4 h-4" })
                            )}
                          </span>
                        )}
                        <span>{subItem.name}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  }`
                }
              >
                <div className="relative">
                  {item.icon}
                  {item.key && notifications[item.key] && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
                  )}
                </div>
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;