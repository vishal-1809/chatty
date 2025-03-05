import React, { useEffect, useState } from "react";
import {
  User,
  Grid,
  UserRoundPlus,
  UserRoundCheck,
  Mail,
  MoveLeft,
  LockKeyhole,
} from "lucide-react";
import { Link } from "react-router-dom";
import ProfilPhoto from "../assests/avatar.png";
import { usePostStore } from "../store/usePostStore";
import { useAuthStore } from "../store/useAuthStore";
import List from "./List";

const UserInfo = (props) => {
  const user = props.props;
  const [section, setSection] = useState("Post");
  const {
    userDetails,
    selectedUser,
    setSelectedUser,
    getUsersforOthers,
    otherFollowingList,
    otherFollowersList,
    othersFollowing,
    othersFollowers,
    follow,
    unfollow,
    checker, 
    isFollow, 
  } = usePostStore();
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();


  useEffect(() => {
    // userDetails({ userName: user.userName });
    checkAuth();
    // if(authUser.following.includes(selectedUser.userName)) {
      getUsersforOthers({ userName: selectedUser.userName });
    // }
    // }, [otherFollowingList, otherFollowersList, selectedUser]);
  }, [selectedUser]);

  if(isCheckingAuth && (!(authUser.following) || !(authUser.followers))) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>
  )

  useEffect(() => {
    setSection("Post");
  }, [follow, unfollow]);

  

  return (
    <div className="mr-10 ml-10">
      <div className="flex">
        <MoveLeft
          onClick={() => setSelectedUser(null)}
          className="cursor-pointer -ml-10 md:-ml-0 lg:-ml-0"
        />
      </div>
      <div className="mx-4 flex flex-col items-center justify-center">
        <div className="flex gap-8 md:gap-15 lg:gap-20">
          <div className="w-20 md:w-auto lg:w-auto">
            <img
              src={user.profilePic || ProfilPhoto}
              alt="Profile"
              className="size-20 md:size-24 lg:size-32 rounded-full object-cover border-4"
            />
            {/* <div className="text-center text-xs md:text-sm lg:text-base">
              {user.fullName}
            </div> */}
            <div className="text-center text-xs md:text-sm lg:text-base mt-1">
              {user.userName}
            </div>
          </div>

          {/* Following and Followers */}
          <div className="flex flex-col justify-center content-center">
            <div className="text-xs md:text-sm lg:text-base p-2">
              {user.fullName}
            </div>
            {/* <div className="text-center text-xs md:text-sm lg:text-base">
              {user.userName}
            </div> */}
            <div className="flex justify-center">
              <div className="grid grid-flow-col gap-2">
                <div className="mx-1 cursor-pointer">
                  {/* <Grid className="h-10 w-20" /> */}
                  <div className="text-center text-1xl md:text-2xl lg:text-3xl">
                    {user.post.length}
                  </div>
                  <div className="text-center text-xs md:text-sm lg:text-base">
                    Post
                  </div>
                </div>
                <div className="mx-1 cursor-pointer">
                  {/* <UserRoundPlus className="h-10 w-20" /> */}
                  <div className="text-center text-1xl md:text-2xl lg:text-3xl">
                    {user.followers.length}
                  </div>
                  <div className="text-center text-xs md:text-sm lg:text-base">
                    Followers
                  </div>
                </div>
                <div className="mx-1 cursor-pointer">
                  {/* <UserRoundCheck className="h-10 w-20" /> */}
                  <div className="text-center text-1xl md:text-2xl lg:text-3xl">
                    {user.following.length}
                  </div>
                  <div className="text-center text-xs md:text-sm lg:text-base">
                    Following
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full flex justify-center border rounded-md my-1 p-1 bg-primary btn-primary">
              {authUser.userName === user.userName ? (
                <Link to="/profile" className='w-full'>Edit Profile</Link>
              ) : authUser.following &&  authUser.following.includes(user.userName) ? (
                <div
                  onClick={() => {
                    
                    unfollow({ userName: user.userName });
                    setSelectedUser(null);
                  }}
                  className="w-full"
                >
                  Unfollow
                </div>
              ) : (
                <div
                  onClick={() => {
                    
                    follow({ userName: user.userName });
                    setSelectedUser(null);
                  }}
                  className="w-full"
                >
                  Follow
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Icon div */}
      <div className="m-2 lg:items-center mt-8">
        <div className="grid lg:grid-cols-8 grid-cols-3 -ml-2 -mr-2">
          <div className="hidden lg:block"></div>
          <div
            className={`flex justify-center p-2 lg:col-span-2 border cursor-pointer ${
              section === "Post" ? "bg" : "bg-base-300"
            }`}
            onClick={() => setSection("Post")}
          >
            <Grid />
          </div>
          <div
            className={`flex justify-center p-2 lg:col-span-2 border cursor-pointer ${
              section === "Followers" ? "" : "bg-base-300"
            }`}
            onClick={() => setSection("Followers")}
          >
            <UserRoundPlus />
          </div>
          <div
            className={`flex justify-center p-2 lg:col-span-2 border cursor-pointer ${
              section === "Following" ? "" : "bg-base-300"
            }`}
            onClick={() => setSection("Following")}
          >
            <UserRoundCheck />
          </div>
          <div className="hidden lg:block"></div>
        </div>
      </div>

      {authUser.following &&  authUser.following.includes(user.userName) ? (
        <List
          props={{
            userName: user.userName,
            section,
            authUser,
            otherFollowingList,
            otherFollowersList,
          }}
        />
      ) : authUser.userName === user.userName ? (
        <List
          props={{
            userName: user.userName,
            section,
            authUser,
            otherFollowingList,
            otherFollowersList,
          }}
        />
      ) : (
        <div className="text-2xl flex text-center justify-center m-10">
          <div className="text-center">
            <LockKeyhole className="h-20 w-20" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
