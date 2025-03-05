import React, { useEffect } from "react";
import SearchBar from "./SearchBar";
import { usePostStore } from "../store/usePostStore";
import UserInfo from "./UserInfo";
import Posts from "./Posts";

const MidSection = () => {
  const { selectedUser, setSelectedUser } = usePostStore();

  // useEffect(() => {
  //   selectedUser;
  // }, [selectedUser]);
  return (
    <aside className="h-full lg:w-72 border-r border-base-300 transition-all duration-200 flex-1 overflow-auto">
      {/* <aside className="flex-1 flex flex-col overflow-auto"> */}
      <SearchBar />
      {selectedUser ? <UserInfo props={selectedUser} /> : <Posts />}
    </aside>
  );
};

export default MidSection;
