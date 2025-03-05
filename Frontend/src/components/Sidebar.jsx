import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import ProfilPhoto from "../assests/avatar.png";

const Sidebar = () => {
  const {
    getUsers,
    users,
    notFollowing,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    getNotification,
    notifications,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
    getNotification(authUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [
    getUsers,
    selectedUser,
    getNotification,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  const userNotification = (userIdToFind) => {
    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].userId.toString() === userIdToFind.toString()) {
        return notifications[i].notify === 0 ? "" : notifications[i].notify;
      }
    }
    return "";
  };

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const filteredUsers1 = showOnlineOnly
    ? notFollowing.filter((user) => onlineUsers.includes(user._id))
    : notFollowing;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({Math.max(onlineUsers.length - 1, 0)} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        <div className="text-xs text-center font-bold">
          People you follow
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-sm text-center py-2">Empty!</div>
        )}

        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || ProfilPhoto}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              <span
                className="absolute bottom-0 right-0 size-4 bg-gray-500 
                  rounded-full ring-2 ring-zinc-900 text-xs font-bold text-white italic"
              >
                {userNotification(user._id)}
              </span>
              {onlineUsers && onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-4 bg-green-500 
                  rounded-full ring-2 ring-zinc-900 text-xs font-bold text-white italic"
                >
                  {userNotification(user._id)}
                </span>
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              {/* <div className="text-xs text-zinc-400">{user.userName}</div> */}
              <div className="text-xs text-zinc-400">
                {user.userName} |{" "}
                {onlineUsers ? (
                  onlineUsers.includes(user._id) ? (
                    "Online"
                  ) : (
                    "Offline"
                  )
                ) : (
                  <></>
                )}
              </div>
            </div>
          </button>
        ))}

        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />

        <div className="text-xs text-center font-bold">
          People you may know
        </div>
        {filteredUsers1.length === 0 && (
          <div className="text-center py-4">Empty!</div>
        )}
        {filteredUsers1.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors aimation
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || ProfilPhoto}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              <span
                className="absolute bottom-0 right-0 size-4 bg-gray-500 
                  rounded-full ring-2 ring-zinc-900 text-xs font-bold text-white italic"
              >
                {userNotification(user._id)}
              </span>
              {onlineUsers && onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-4 bg-green-500 
                  rounded-full ring-2 ring-zinc-900 text-xs font-bold text-white italic"
                >
                  {userNotification(user._id)}
                </span>
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              {/* <div className="text-xs text-zinc-400">{user.userName}</div> */}
              <div className="text-xs text-zinc-400">
                {user.userName} |{" "}
                {onlineUsers ? (
                  onlineUsers.includes(user._id) ? (
                    "Online"
                  ) : (
                    "Offline"
                  )
                ) : (
                  <></>
                )}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length + filteredUsers1.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
