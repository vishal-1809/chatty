import { useState } from "react";
import { Camera, Captions } from "lucide-react";
import toast from "react-hot-toast";
import { usePostStore } from "../store/usePostStore";
import Blank from "../assests/blank.png";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { isUpdatingPost, likes, createPost } = usePostStore();
  const navigate = useNavigate(); // Initialize navigation

  const [selectedImg, setSelectedImg] = useState(null);
  const [caption, setCaption] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
    };
  };

  const handleCaption = (e) => {
    setCaption(e.replace(/\s+/g, " ").trim());
  };

  const submit = async () => {
    if (!selectedImg) {
      toast.error("Select Image to post");
      return;
    }
    const res = await createPost({ post: selectedImg, caption: caption });
    setSelectedImg(null);
    setCaption("");
    if (res === "Success") navigate("/"); // Navigate after success
  };

  return (
    <div className="pt-20 h-auto md:h-screen lg:h-screen ">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          {/* Image Post/Upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || Blank}
                alt="Post"
                className="size-64 object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingPost ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingPost}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingPost
                ? "Uploading..."
                : "Click the camera icon to upload your photo"}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <Captions />
              Caption
            </div>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border flex">
              <input
                className="flex-1 outline-none"
                suppressContentEditableWarning={true}
                onInput={(e) => handleCaption(e.target.value)}
              ></input>
            </p>
          </div>

          <div className="flex justify-center">
            {/* <button className="border p-1 w-20 rounded-lg" onClick={submit}>
              Create
            </button> */}
            <button className="btn btn-primary w-full" onClick={submit}>Create Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
