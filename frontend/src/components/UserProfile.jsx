import React, { useState, useRef, useEffect } from "react";
import { User, Mail, Phone, Edit, Save, X, Move } from "lucide-react";

const UserProfile = ({ user, theme, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "Administrator",
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
      danger: "bg-red-600 hover:bg-red-700 text-white",
    },
    light: {
      bg: "bg-white/95 backdrop-blur-xl",
      card: "bg-gray-50/50",
      text: "text-gray-900",
      subtext: "text-gray-600",
      border: "border-gray-200",
      input: "bg-white/50 border-gray-300 text-gray-900",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      danger: "bg-red-600 hover:bg-red-700 text-white",
    },
  };

  const t = themeClasses[theme] || themeClasses.dark;

  const handleSave = () => {
    onUpdate(editedUser);
    setIsEditing(false);

    const successMessage = document.createElement("div");
    successMessage.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
      theme === "dark" ? "bg-green-600 text-white" : "bg-green-500 text-white"
    }`;
    successMessage.textContent = "Profile updated successfully!";
    document.body.appendChild(successMessage);

    setTimeout(() => {
      document.body.removeChild(successMessage);
    }, 3000);
  };

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      role: user?.role || "Administrator",
    });
    setIsEditing(false);
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
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      setPosition({
        x: newX,
        y: newY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
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
            <h2 className={`text-xl font-bold ${t.text}`}>User Profile</h2>
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
          {/* Profile Header */}
          <div className={`${t.card} rounded-lg p-4 mb-4`}>
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
                    : "bg-gradient-to-br from-blue-500 to-cyan-600 text-white"
                }`}
              >
                {editedUser.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-bold ${t.text}`}>
                  {editedUser.name}
                </h3>
                <p className={`text-sm ${t.subtext}`}>{editedUser.role}</p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${t.button} transition-colors no-drag`}
                >
                  <Edit size={14} />
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* User Information */}
          <div className={`${t.card} rounded-lg p-4`}>
            <h3 className={`text-base font-semibold ${t.text} mb-3`}>
              Information
            </h3>

            <div className="space-y-3">
              {/* Name */}
              <div>
                <label className={`block text-xs font-medium ${t.text} mb-1`}>
                  Name
                </label>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`w-full px-3 py-1.5 rounded-lg border text-sm ${
                    t.input
                  } ${!isEditing && "opacity-60"}`}
                />
              </div>

              {/* Email */}
              <div>
                <label className={`block text-xs font-medium ${t.text} mb-1`}>
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={14}
                    className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 ${t.subtext}`}
                  />
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full pl-8 pr-3 py-1.5 rounded-lg border text-sm ${
                      t.input
                    } ${!isEditing && "opacity-60"}`}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={`block text-xs font-medium ${t.text} mb-1`}>
                  Phone
                </label>
                <div className="relative">
                  <Phone
                    size={14}
                    className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 ${t.subtext}`}
                  />
                  <input
                    type="tel"
                    value={editedUser.phone}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full pl-8 pr-3 py-1.5 rounded-lg border text-sm ${
                      t.input
                    } ${!isEditing && "opacity-60"}`}
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className={`block text-xs font-medium ${t.text} mb-1`}>
                  Role
                </label>
                <div className="relative">
                  <User
                    size={14}
                    className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 ${t.subtext}`}
                  />
                  <input
                    type="text"
                    value={editedUser.role}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, role: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full pl-8 pr-3 py-1.5 rounded-lg border text-sm ${
                      t.input
                    } ${!isEditing && "opacity-60"}`}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSave}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${t.button} transition-colors no-drag`}
                >
                  <Save size={14} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${
                    theme === "dark"
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-gray-300 hover:bg-gray-400"
                  } ${t.text} transition-colors no-drag`}
                >
                  <X size={14} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
