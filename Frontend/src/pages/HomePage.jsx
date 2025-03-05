import React, { useEffect } from "react";
import SideFollowingList from "../components/SideFollowingList";
import SideNotFollowingList from "../components/SideNotFollowingList";
import MidSection from "../components/MidSection";
import SearchBar from "../components/SearchBar";
import CreatePost from "../components/CreatePost";
import { Link } from "react-router-dom";
import { Plus, Loader } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";



const HomePage = () => {
  const {authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  if(isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>
  )
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-8xl h-[calc(100vh-8rem)]">
          {/* <SearchBar /> */}
          <div className="flex h-full rounded-lg overflow-hidden">
            <SideFollowingList className="hidden" />
            <MidSection />
            <SideNotFollowingList />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        {/* <CreatePost /> */}
        <Link to="/create">
          <Plus className="border-4 rounded-full h-10 w-10 cursor-pointer" />
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
