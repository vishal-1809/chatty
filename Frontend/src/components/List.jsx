import React, { useEffect, useState } from "react";
import ProfilePhoto from "../assests/avatar.png";
import { useAuthStore } from "../store/useAuthStore";
import { usePostStore } from "../store/usePostStore";
import { X, Heart, EllipsisVertical } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const List = (props) => {
  const [smallScreen, setSmallScreen] = useState(false);
  const navigate = useNavigate();

  const { onlineUsers, authUser } = useAuthStore();
  const {
    selectedUser,
    setSelectedUser,
    getPostsbyUser,
    postLstofUser,
    likePost,
    likeActivity,
    likes,
    likeList,
    setSelectedPost,
    selectedPost,
    deletePost,
  } = usePostStore();

  const [postLikeArray, setPostLikeArray] = useState(authUser.postLikes);
  const [postLikeMap, setPostLikeMap] = useState(new Map());

  const section = props.props.section;
  const users =
    section === "Followers"
      ? props.props.otherFollowersList
      : props.props.otherFollowingList;

  useEffect(() => {
    getPostsbyUser({ _id: selectedUser._id, userName: selectedUser.userName });
    if (postLstofUser?.length) {
      setPostLikeMap(
        new Map(postLstofUser.map((post) => [post.postUnique, post.likes]))
      );
      // setGetShowLikes(new Map(postLstofUser.map((post) => [post.postUnique, 0])));
    }
    likeActivity();
  }, [getPostsbyUser, selectedUser, likeActivity, postLstofUser, deletePost]);

  // To handle the small screen
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)"); // Tailwind md: starts at 768px

    const handleResize = () => setSmallScreen(!mediaQuery.matches);

    mediaQuery.addEventListener("change", handleResize);
    handleResize(); // Initial check

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // setvalue for small screen
  const postView = () => {
    setSmallScreen(true);
  };

  const like = async (id) => {
    await likePost(id);
    setPostLikeArray([...postLikeArray, id]);
    setPostLikeMap((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
    toast.success("Liked");
  };
  const disLike = async (id) => {
    await likePost(id);
    setPostLikeArray(
      postLikeArray.filter((item) => item.toString() !== id.toString())
    );
    setPostLikeMap((prev) => ({
      ...prev,
      [id]: prev[id] - 1,
    }));
    toast.success("Disliked");
  };

  const viewLike = async (id) => {
    await setSelectedPost(id);
    navigate("/postInfo");
  };

  const deletingPost = async (id) => {
    await deletePost(id);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now - past;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 1) {
      return "Today";
    } else if (diffInDays === 1) {
      return "1 day ago";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    }
  };

  return (
    <div>
      {section === "Post" ? (
        <div>
          <div
            className={
              smallScreen
                ? `flex justify-end pr-10 lg:pr-20 cursor-pointer`
                : `hidden`
            }
            onClick={() => setSmallScreen(false)}
          >
            <X className="md:block hidden" />
          </div>
          {postLstofUser.length === 0 ? (
            <div className="text-2xl flex text-center justify-center m-10">
              <div className="text-center"> Nothing to show</div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className={smallScreen ? `` : `grid grid-cols-3`}>
                {postLstofUser.map((post) =>
                  smallScreen ? (
                    <div key={post.postUnique}>
                      <div className="flex justify-center overflow-hidden">
                        <div className="w-80 lg:w-96 md:w-96 m-2">
                          <div className="bg-base-300 rounded-xl m-2 sm:w-80 lg:w-auto md:w-auto mt-4">
                            <div className="items-center">
                              <div className="flex items-center gap-3 m-2">
                                <div className="avatar mt-2">
                                  <div className="size-12 rounded-full relative">
                                    <img
                                      src={post.profilePhoto || ProfilePhoto}
                                      alt={post.fullName}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-flow-col grid-cols-6">
                                  <div className="w-full flex justify-start col-span-4 overflow-hidden">
                                    <h3 className="font-medium grid grid-flow-row">
                                      {selectedUser.fullName}{" "}
                                      <span className="text-xs text-base-content/70">
                                        {selectedUser.userName}
                                      </span>
                                    </h3>
                                  </div>
                                  <div className="w-full h-fit flex justify-end ml-4 md:ml-6 lg:ml-8 col-span-2 pt-3">
                                    {selectedUser.userName ===
                                    authUser.userName ? (
                                      <button
                                        className="text-xs border rounded-sm p-2 bg-primary btn-primary"
                                        onClick={() =>
                                          deletingPost(post.postUnique)
                                        }
                                      >
                                        Delete
                                      </button>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between border-b border-zinc-700"></div>

                            <div className="m-2 ml-6">
                              <img
                                className="h-80 w-64 md:h-96 md:w-80 lg:h-96 lg:w-80"
                                src={post.post}
                                alt={post.caption}
                              />
                              <div className="caption w-80 mt-2 lg:pr-0 md:pr-0 pr-12">
                                <span className="font-bold">
                                  {selectedUser.userName}
                                </span>{" "}
                                <span className="">{post.caption}</span>
                              </div>
                              <div className="grid grid-flow-col grid-cols-3 pb-2 pt-1">
                                <div className="flex gap-2 pb-2 col-span-2">
                                  {postLikeArray && postLikeArray.includes(post.postUnique) ? (
                                    <Heart
                                      className=" fill-red-700 cursor-pointer"
                                      onClick={() =>
                                        disLike(post.postUnique, post.likes)
                                      }
                                    />
                                  ) : (
                                    <Heart
                                      className="cursor-pointer"
                                      onClick={() =>
                                        like(post.postUnique, post.likes)
                                      }
                                    />
                                  )}
                                  <div>
                                    {postLikeMap[post.postUnique] || post.likes}{" "}
                                    Likes{" "}
                                  </div>
                                </div>
                                <div className="flex justify-around">
                                  <button
                                    className="text-xs border rounded-sm p-1 bg-primary btn-primary"
                                    onClick={() => viewLike(post.postUnique)}
                                  >
                                    View Details
                                  </button>
                                </div>
                              </div>
                              <div className="text-xs pb-4">
                                {formatTimeAgo(post.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="gap-2 cursor-pointer" onClick={postView} key={post.postUnique}>
                      <img
                        src={post.post}
                        alt={post.caption}
                        className="lg:h-48 md:w-48 p-2 ml-2 mr-2 "
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* <div className="flex justify-center">{users.length === 0 ? ("") : (section)}</div> */}
          {users.length === 0 ? (
            <div className="text-2xl flex text-center justify-center m-10">
              <div className="text-center"> Nothing to show</div>
            </div>
          ) : (
            users.map((user) => (
              <div className="lg:ml-20" key={user._id}>
                <button
                  className="-ml-1w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors cursor-pointer -ml-10 md:ml-0 lg:ml-0"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="relative mx-auto lg:mx-0">
                    <img
                      src={user.profilePic || ProfilePhoto}
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
                  <div className="lg:block text-left min-w-0">
                    <div className="font-medium truncate">{user.fullName}</div>
                    {/* <div className="text-xs text-zinc-400">{user.userName}</div> */}
                    <div className="text-xs text-zinc-400">{user.userName}</div>
                  </div>
                </button>
              </div>
            ))
          )}
        </div>
      )}
      {/* {section === "Following" ? <div>Following</div> : <></>} */}
    </div>
  );
};

export default List;
