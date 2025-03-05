import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Camera,
  Mail,
  User,
  Edit,
  Check,
  X,
  UserRoundPlus,
  UserRoundCheck,
  Grid,
  InfoIcon,
  ItalicIcon,
  Info
} from "lucide-react";
import profilePic from "../assests/avatar.png";
import toast from "react-hot-toast";
import { usePostStore } from "../store/usePostStore";
import List from "../components/List";
import ProfilePhoto from "../assests/avatar.png";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate(); // Initialize navigation
  const {
    authUser,
    isUpdatingProfile,
    updateProfile,
    updateFullName,
    updateEmail,
    updateUsername,
    checkAuth,
    post,
    followers,
    following,
    onlineUsers,
  } = useAuthStore();

  const { otherFollowingList, otherFollowersList, getUsersforOthers } =
    usePostStore();

  const [selectedImg, setSelectedImg] = useState(null);

  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [email, setEmail] = useState(authUser?.email);

  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [fullName, setFullName] = useState(authUser?.fullName);

  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [userName, setUsername] = useState(authUser?.userName);

  const [section, setSection] = useState("Post");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const fullNameChange = (e) => {
    setFullName(e.trim());
  };
  const updatingFullName = async () => {
    if (authUser?.fullName === fullName) {
      toast.success("No Change!");
    } else {
      await updateFullName({ fullName: fullName });
    }
  };

  const emailChange = (e) => {
    setEmail(e.trim());
  };
  const updatingEmail = async () => {
    if (authUser?.email === email) {
      toast.success("No Change!");
    } else {
      await updateEmail({ email: email });
    }
  };

  const usernameChange = (e) => {
    setUsername(e.trim());
  };
  const updatingUsername = async () => {
    if (authUser?.userName === userName) {
      toast.success("No Change!");
    } else {
      const response = await updateUsername({ userName: userName });
    }
  };

  useEffect(() => {
    // getUsersforOthers({ userName: authUser?.userName });
    checkAuth();
  }, [otherFollowingList, otherFollowersList]);

  return (
    <div className="pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || profilePic}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Basic details */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border flex">
                <p
                  className="flex-1 outline-none"
                  contentEditable={isUpdatingName}
                  suppressContentEditableWarning={true}
                  onInput={(e) => fullNameChange(e.target.innerText)}
                >
                  {authUser?.fullName}
                </p>
                {!isUpdatingName ? (
                  <Edit
                    className="flex-none cursor-pointer"
                    onClick={() => setIsUpdatingName(true)}
                  ></Edit>
                ) : (
                  <>
                    <Check
                      className="flex-none cursor-pointer"
                      onClick={() => {
                        setIsUpdatingName(false), updatingFullName();
                      }}
                    ></Check>
                    {/* <X
                      className="flex-none cursor-pointer"
                      onClick={() => { setIsUpdatingName(false), notUpdatingFullName() }}
                    ></X> */}
                  </>
                )}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border flex">
                <p
                  className="flex-1 outline-none"
                  contentEditable={isUpdatingEmail}
                  suppressContentEditableWarning={true}
                  onInput={(e) => emailChange(e.target.innerText)}
                >
                  {authUser?.email}
                </p>
                {!isUpdatingEmail ? (
                  <Edit
                    className="flex-none cursor-pointer"
                    onClick={() => setIsUpdatingEmail(true)}
                  ></Edit>
                ) : (
                  <>
                    <Check
                      className="flex-none cursor-pointer"
                      onClick={() => {
                        setIsUpdatingEmail(false), updatingEmail();
                      }}
                    ></Check>
                    {/* <X
                      className="flex-none cursor-pointer"
                      onClick={() => setIsUpdatingEmail(false)}
                    ></X> */}
                  </>
                )}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border flex">
                <p
                  className="flex-1 outline-none"
                  contentEditable={isUpdatingUsername}
                  suppressContentEditableWarning={true}
                  onInput={(e) => usernameChange(e.target.innerText)}
                >
                  {authUser?.userName}
                </p>
                {!isUpdatingUsername ? (
                  <Edit
                    className="flex-none cursor-pointer"
                    onClick={() => setIsUpdatingUsername(true)}
                  ></Edit>
                ) : (
                  <>
                    <Check
                      className="flex-none cursor-pointer"
                      onClick={() => {
                        setIsUpdatingUsername(false), updatingUsername();
                      }}
                    ></Check>
                    {/* <X
                      className="flex-none cursor-pointer"
                      onClick={() => setIsUpdatingUsername(false)}
                    ></X> */}
                  </>
                )}
              </p>
            </div>
          </div>

          <div
            onClick={() => navigate("/changePassword")}
            className="cursor-pointer"
          >
            <button className="btn btn-primary w-full"> Change Password</button>
          </div>

          {/* Following and Followers */}
          {/* <div className="flex justify-center">
            <div className="grid grid-flow-col">
              <div
                className={`mx-3 p-2 cursor-pointer ${
                  section === "Post" ? "bg-base-100" : ""
                }`}
                onClick={() => {
                  setSection("Post");
                }}
              >
                <Grid className="h-10 w-20" />
                <div className="text-center">{post} Posts</div>
              </div>
              <div
                className={`mx-3 p-2 cursor-pointer ${
                  section === "Followers" ? "bg-base-100" : ""
                }`}
                onClick={() => {
                  setSection("Followers");
                }}
              >
                <UserRoundPlus className="h-10 w-20" />
                <div className="text-center">{followers} Followers</div>
              </div>
              <div
                className={`mx-3 p-2 cursor-pointer ${
                  section === "Following" ? "bg-base-100" : ""
                }`}
                onClick={() => {
                  setSection("Following");
                }}
              >
                <UserRoundCheck className="h-10 w-20" />
                <div className="text-center">{following} Following</div>
              </div>
            </div>
          </div> */}

          {/* <div className="overflow-y-scroll h-40">
            <div className="h-full">
              {section === "Following" ? (
                <div>
                  {otherFollowingList.map((user) => (
                    <div className="ml-10 lg:ml-20">
                      <button className="-ml-1w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors cursor-pointer -ml-10 md:ml-0 lg:ml-0">
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
                          {onlineUsers.includes(user._id) && (
                            <span
                              className="absolute bottom-0 right-0 size-4 bg-green-500 
                                                          rounded-full ring-2 ring-zinc-900 text-xs font-bold text-white italic"
                            ></span>
                          )}
                        </div>

                        <div className="lg:block text-left min-w-0">
                          <div className="font-medium truncate">
                            {user.fullName}
                          </div>
                          <div className="text-xs text-zinc-400">
                            {user.userName}
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              ) : section === "Followers" ? (
                <div>
                  {otherFollowersList.map((user) => (
                    <div className="ml-10 lg:ml-20">
                      <button className="-ml-1w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors cursor-pointer -ml-10 md:ml-0 lg:ml-0">
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
                          {onlineUsers.includes(user._id) && (
                            <span
                              className="absolute bottom-0 right-0 size-4 bg-green-500 
                                                          rounded-full ring-2 ring-zinc-900 text-xs font-bold text-white italic"
                            ></span>
                          )}
                        </div>

                        <div className="lg:block text-left min-w-0">
                          <div className="font-medium truncate">
                            {user.fullName}
                          </div>
                          <div className="text-xs text-zinc-400">
                            {user.userName}
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <>Work in Progres</>
              )}
            </div>
          </div> */}
          <div className="flex items-center justify-between py-2 border-b border-zinc-700"></div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl pl-6 cursor-pointer" onClick={()=>navigate('/aboutUs')}>
            <h2 className="text-lg font-medium mb-4 flex gap-2">About Us <Info className="mt-1"></Info></h2>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
