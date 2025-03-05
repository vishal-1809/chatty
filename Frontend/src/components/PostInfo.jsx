import React, { useEffect, useState } from "react";
import { usePostStore } from "../store/usePostStore";
import ProfilePhoto from "../assests/avatar.png";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const PostInfo = () => {
  const navigate = useNavigate();
  const { likes, likeList, selectedPost, setSelectedPost, gettingLikes } =
    usePostStore();
  const { authUser, onlineUsers } = useAuthStore();

  useEffect(() => {
    if (!selectedPost) {
      navigate("/");
    }
  }, [selectedPost]);

  return (
    <div>
      {selectedPost ? (
        gettingLikes ? (
          <div className="pt-10 h-screen md:h-screen lg:h-screen">
            <div className="flex justify-center w-full h-full items-center">
              <div className="text-xl">
                {/* <span className="p-2"> </span> */}
                <span className="loading loading-dots loading-xl"></span>
                {/* <span className="loading loading-dots loading-xl"></span> */}
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-10 h-auto md:h-screen lg:h-screen">
            <div className="max-w-2xl mx-auto p-4 py-8">
              <div className="bg-base-300 rounded-xl p-6 space-y-8">
                <div className="grid grid-flow-col grid-cols-3 h-[35rem]">
                  {/* Post  */}
                  <div className="flex justify-center overflow-hidden col-span-2 overflow-y-scroll">
                    <div className="w-80 lg:w-96 md:w-96 m-1">
                      <div className="bg-base-300 rounded-xl m-2 sm:w-80 lg:w-auto md:w-auto">
                        <div className="items-center">
                          <div className="flex items-center gap-3 m-2">
                            <div className="avatar mt-1">
                              <div className="size-12 rounded-full relative">
                                <img
                                  src={likes.profilePic || ProfilePhoto}
                                  alt={likes.fullName}
                                />
                              </div>
                            </div>
                            <div className="w-full flex justify-start">
                              <h3 className="font-medium grid grid-flow-row">
                                {likes.fullName}{" "}
                                <span className="text-xs text-base-content/70">
                                  {likes.userName}
                                </span>
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-b border-zinc-700"></div>

                        <div className="m-2 ml-6">
                          <img
                            className="h-80 w-64 md:h-96 md:w-80 lg:h-96 lg:w-80"
                            src={likes.post}
                            alt={likes.caption}
                          />
                          <div className="caption w-80 mt-2 lg:pr-0 md:pr-0 pr-12">
                            <span className="font-bold">{likes.userName}</span>{" "}
                            <span className="">{likes.caption}</span>
                          </div>

                          <div className="text-xs pb-4 pt-1">
                            {" "}
                            <strong>Posted At: </strong>
                            {formatMessageTime(likes.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Liked By */}
                  <div className="overflow-y-scroll">
                    <div className="text-center pt-10 font-bold">
                      Liked By {likes.likes.length || 0} People
                    </div>
                    {likes.likes.map((user) => (
                      <div key={user.userId}>
                        <div className="">
                          <button className="-ml-1w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors cursor-pointer -ml-10 md:ml-0 lg:ml-0">
                            <div className="relative mx-auto lg:mx-0">
                              <img
                                src={user.profilePhoto || ProfilePhoto}
                                alt={user.name}
                                className="size-12 object-cover rounded-full"
                              />
                              <span
                                className="absolute bottom-0 right-0 size-4 bg-gray-500 
                                                                              rounded-full ring-2 ring-zinc-900 text-xs font-bold text-white italic"
                              ></span>
                              {onlineUsers && onlineUsers.includes(user.userId) && (
                                <span
                                  className="absolute bottom-0 right-0 size-4 bg-green-500 
                                                                              rounded-full ring-2 ring-zinc-900 text-xs font-bold text-white italic"
                                ></span>
                              )}
                            </div>

                            {/* User info - only visible on larger screens */}
                            <div className="lg:block text-left min-w-0">
                              <div className="font-medium truncate">
                                {user.fullName}
                              </div>
                              {/* <div className="text-xs text-zinc-400">{user.userName}</div> */}
                              <div className="text-xs text-zinc-400">
                                {user.userName}
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <div>Go Back</div>
      )}
    </div>
  );
};

export default PostInfo;
