import React, { useEffect, useState } from "react";
import { usePostStore } from "../store/usePostStore";
import ProfilePhoto from "../assests/avatar.png";
import { Heart } from "lucide-react";
import UserInfo from "./UserInfo";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const Posts = () => {
  const [routing, setRouting] = useState(null);
  const {
    setSelectedUser,
    selectedUser,
    getPosts,
    postLst,
    viewProfile,
    likePost,
    likeActivity,
  } = usePostStore();
  const { authUser } = useAuthStore();
  const [postLikeArray, setPostLikeArray] = useState(authUser.postLikes);

  useEffect(() => {
    getPosts();
    setRouting(false);
    likeActivity();
  }, [getPosts, likeActivity]);

  const view = async (id) => {
    const res = await viewProfile({ _id: id });
    if (res) {
      setRouting(res); // Ensure data is valid before setting state
      setSelectedUser(res);
    } else {
      console.error("No data received");
    }
  };

  const like = async (id) => {
    await likePost(id);
    setPostLikeArray([...postLikeArray, id]);
    toast.success("Liked");
  };
  const disLike = async (id) => {
    await likePost(id);
    setPostLikeArray(
      postLikeArray.filter((item) => item.toString() !== id.toString())
    );
    toast.success("Disliked");
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
      {routing ? (
        <UserInfo props={routing} />
      ) : (
        <div className="flex justify-center overflow-hidden">
          <div className="w-80 lg:w-96 md:w-96 m-2">
            {postLst.length === 0 && (
              <div className="text-sm text-center py-2">Nothing to show!</div>
            )}
            {postLst.map((post) => (
              <div className="bg-base-300 rounded-xl m-2 sm:w-80 lg:w-auto md:w-auto mt-4" key={post.userId}>
                <div className="items-center">
                  <div className="flex items-center gap-3 m-2">
                    <div className="avatar mt-2">
                      <div className="size-12 rounded-full relative">
                        <img
                          src={post.profilePic || ProfilePhoto}
                          alt={post.fullName}
                        />
                      </div>
                    </div>
                    <div className="grid grid-flow-col grid-cols-6">
                      <div className="w-full flex justify-start col-span-3 overflow-hidden">
                        <h3 className="font-medium grid grid-flow-row">
                          {post.fullName}{" "}
                          <span className="text-xs text-base-content/70">
                            {post.userName}
                          </span>
                        </h3>
                      </div>
                      <div className="w-full h-fit flex justify-around lg:ml-8 col-span-2 pt-3 ">
                        <button
                          className="text-xs border rounded-lg p-2 bg-primary text-black"
                          onClick={() => view(post.userId)}
                        >
                          View Profile
                        </button>
                      </div>
                      <div></div>
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
                    <span className="font-bold">{post.userName}</span>{" "}
                    <span className="">{post.caption}</span>
                  </div>
                  <div className="flex gap-2 pb-2">
                    {postLikeArray && postLikeArray.includes(post._id) ? (
                      <Heart
                        className=" fill-red-700 cursor-pointer"
                        onClick={() => disLike(post._id, post.likes.length)}
                      />
                    ) : (
                      <Heart
                        className="cursor-pointer"
                        onClick={() => like(post._id, post.likes.length)}
                      />
                    )}
                    {post.likes.length} Likes
                  </div>
                  <div className="text-xs pb-4">
                    {formatTimeAgo(post.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
