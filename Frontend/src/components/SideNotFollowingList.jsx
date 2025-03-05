import React, { useEffect } from "react";
import { usePostStore } from "../store/usePostStore";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ProfilPhoto from "../assests/avatar.png";

const SideNotFollowingList = () => {
  const {
    noOfPost,
    noOfFollowers,
    noOfFollowing,
    followerLst,
    followingLst,
    notFollowingLst,
    selectedUser,
    othersFollowing,
    setSelectedUser,
    follow,
  } = usePostStore();

  const { getUsers, users, followers, notFollowing } = useChatStore();

  const { onlineUsers, authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    getUsers();
    // checkAuth();
  }, [getUsers, selectedUser ]);


  return (
    <div className="hidden lg:flex overflow-y-scroll">
      <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        <div className="text-center m-2">People you may know</div>
        {notFollowing.map((user) => (
          <div
            key={user._id}
            className={`grid grid-cols-4 hover:bg-base-300 m-1 ${
              selectedUser?._id === user._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }`}
          >
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                        w-full p-3 flex items-center gap-3
                        hover:bg-base-300 transition-colors col-span-3
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
                ></span>
                {onlineUsers && onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-4 bg-green-500 
                            rounded-full ring-2 ring-zinc-900 text-xs font-bold text-white italic"
                  ></span>
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                {/* <div className="text-xs text-zinc-400">{user.userName}</div> */}
                <div className="text-xs text-zinc-400">{user.userName}</div>
              </div>
            </button>
            <button className="m-1">
              <div
                onClick={() => {
                  follow({ userName: user.userName });
                  setSelectedUser(null);
                }}
                className="border rounded-lg p-1 text-sm bg-primary btn-primary"
              >
                Follow
              </div>
            </button>
          </div>
        ))}
      </aside>
    </div>
  );
};

export default SideNotFollowingList;
