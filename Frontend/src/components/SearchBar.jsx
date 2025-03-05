import React from "react";
import { Search } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import ProfilPhoto from "../assests/avatar.png";
import { usePostStore } from "../store/usePostStore";

const SearchBar = () => {
  const { users, notFollowing } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const { selectedUser, setSelectedUser } = usePostStore();

  const finalList = [...users, ...notFollowing, authUser];

  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [noResult, setNoResult] = useState(false);

  // Search Function
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    if (searchTerm === "") {
      setFilteredUsers([]);
      setNoResult(false);
      return;
    }
    // setQuery(searchTerm);
    setNoResult(true);

    const results = finalList.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchTerm) ||
        user.userName.toLowerCase().includes(searchTerm)
    );

    setFilteredUsers(results);
  };

  return (
    <div className="m-2">
      <div className="max-w-screen-sm mx-auto">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium sr-only"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <Search />
          </div>
          <input
            autoComplete="off"
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm"
            placeholder="Search Users..."
            // value={query}
            onChange={handleSearch}
            required
          />
          <button
            type="submit"
            className="absolute end-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 bg-none mx-5"
          >
            Search
          </button>
        </div>
        <div className="mt-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <button
                className="-ml-1w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors cursor-pointer"
                onClick={() => setSelectedUser(user)}
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
                <div className="lg:block text-left min-w-0">
                  <div className="font-medium truncate">{user.fullName}</div>
                  {/* <div className="text-xs text-zinc-400">{user.userName}</div> */}
                  <div className="text-xs text-zinc-400">{user.userName}</div>
                </div>
              </button>
            ))
          ) : noResult ? (
            <li className="p-2 text-gray-500">No results found</li>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
