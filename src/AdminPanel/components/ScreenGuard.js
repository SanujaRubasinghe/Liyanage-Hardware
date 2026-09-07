import { useEffect, useState } from "react";

const ScreenGuard = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsAllowed(width >= 768); // md breakpoint in Tailwind (768px and above)
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200 p-6">
        <div className="bg-white shadow-xl border border-red-300 rounded-xl p-6 max-w-sm w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-3">Access Denied 🚫</h2>
          <p className="text-gray-700 text-sm">
            Our admin panel is optimized for desktop and tablet devices.
            <br />
            Please access this page from a larger screen.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ScreenGuard;
