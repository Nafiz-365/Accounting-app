import React, { useState, useRef, useEffect } from "react";
import { Settings, Bell, Shield, Palette, Save, X, Move } from "lucide-react";

const UserSettings = ({ theme, onClose, onUpdate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: theme === "dark",
    autoSave: true,
  });

  const themeClasses = {
    dark: {
      bg: "bg-gray-900/95 backdrop-blur-xl",
      card: "bg-gray-800/50",
      text: "text-gray-100",
      subtext: "text-gray-400",
      border: "border-gray-700",
      input: "bg-gray-700/50 border-gray-600 text-gray-100",
      button: "bg-cyan-600 hover:bg-cyan-700 text-white",
      secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    },
    light: {
      bg: "bg-white/95 backdrop-blur-xl",
      card: "bg-gray-50/50",
      text: "text-gray-900",
      subtext: "text-gray-600",
      border: "border-gray-200",
      input: "bg-white/50 border-gray-300 text-gray-900",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      secondary: "bg-gray-300 hover:bg-gray-400 text-gray-900",
    },
  };

  const t = themeClasses[theme] || themeClasses.dark;

  const handleSave = () => {
    // Apply settings changes
    onUpdate(settings);

    // Apply dark mode change immediately
    if (settings.darkMode !== (theme === "dark")) {
      // This would trigger theme change in parent component
      console.log(
        "Theme change requested:",
        settings.darkMode ? "dark" : "light"
      );
    }

    // Apply notification settings
    if (settings.notifications) {
      console.log("Notifications enabled");
      // Request notification permission if needed
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
    } else {
      console.log("Notifications disabled");
    }

    // Apply auto-save setting
    if (settings.autoSave) {
      console.log("Auto-save enabled");
      // Enable auto-save functionality
    } else {
      console.log("Auto-save disabled");
      // Disable auto-save functionality
    }

    // Show success message
    const successMessage = document.createElement("div");
    successMessage.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
      theme === "dark" ? "bg-green-600 text-white" : "bg-green-500 text-white"
    }`;
    successMessage.textContent = "Settings saved successfully!";
    document.body.appendChild(successMessage);

    setTimeout(() => {
      if (document.body.contains(successMessage)) {
        document.body.removeChild(successMessage);
      }
    }, 3000);
  };

  const handleMouseDown = (e) => {
    if (e.target.closest(".no-drag")) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMoveLocal = (e) => {
      if (!isDragging) return;

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      setPosition({
        x: newX,
        y: newY,
      });
    };

    const handleMouseUpLocal = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMoveLocal);
      document.addEventListener("mouseup", handleMouseUpLocal);
      return () => {
        document.removeEventListener("mousemove", handleMouseMoveLocal);
        document.removeEventListener("mouseup", handleMouseUpLocal);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 min-h-screen">
      <div
        ref={modalRef}
        className={`w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl ${
          t.bg
        } ${t.border} border shadow-2xl transition-shadow ${
          isDragging ? "cursor-grabbing shadow-3xl" : "cursor-grab"
        }`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Header */}
        <div
          className={`p-4 border-b ${t.border} flex items-center justify-between no-drag`}
        >
          <div className="flex items-center gap-2">
            <Move size={18} className={t.subtext} />
            <h2 className={`text-xl font-bold ${t.text}`}>Settings</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg ${
              theme === "dark" ? "hover:bg-gray-700/50" : "hover:bg-gray-100/60"
            } transition-colors no-drag`}
          >
            <X size={18} className={t.text} />
          </button>
        </div>

        <div className="p-4">
          {/* Notifications Settings */}
          <div className={`${t.card} rounded-lg p-4 mb-4`}>
            <div className="flex items-center gap-3 mb-4">
              <Bell size={18} className={t.subtext} />
              <h3 className={`text-base font-semibold ${t.text}`}>
                Notifications
              </h3>
            </div>

            <div className="space-y-3">
              <label
                className={`flex items-center justify-between cursor-pointer`}
              >
                <span className={`text-sm ${t.text}`}>
                  Enable Notifications
                </span>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: e.target.checked,
                    })
                  }
                  className={`w-4 h-4 rounded ${t.input}`}
                />
              </label>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className={`${t.card} rounded-lg p-4 mb-4`}>
            <div className="flex items-center gap-3 mb-4">
              <Palette size={18} className={t.subtext} />
              <h3 className={`text-base font-semibold ${t.text}`}>
                Appearance
              </h3>
            </div>

            <div className="space-y-3">
              <label
                className={`flex items-center justify-between cursor-pointer`}
              >
                <span className={`text-sm ${t.text}`}>Dark Mode</span>
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) =>
                    setSettings({ ...settings, darkMode: e.target.checked })
                  }
                  className={`w-4 h-4 rounded ${t.input}`}
                />
              </label>
            </div>
          </div>

          {/* General Settings */}
          <div className={`${t.card} rounded-lg p-4 mb-4`}>
            <div className="flex items-center gap-3 mb-4">
              <Settings size={18} className={t.subtext} />
              <h3 className={`text-base font-semibold ${t.text}`}>General</h3>
            </div>

            <div className="space-y-3">
              <label
                className={`flex items-center justify-between cursor-pointer`}
              >
                <span className={`text-sm ${t.text}`}>Auto Save</span>
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) =>
                    setSettings({ ...settings, autoSave: e.target.checked })
                  }
                  className={`w-4 h-4 rounded ${t.input}`}
                />
              </label>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm ${t.button} transition-colors no-drag`}
          >
            <Save size={14} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
