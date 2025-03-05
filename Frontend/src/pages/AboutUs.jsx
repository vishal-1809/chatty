import { useState } from "react";
import { Camera, Captions } from "lucide-react";
import toast from "react-hot-toast";
import { usePostStore } from "../store/usePostStore";
import Blank from "../assests/blank.png";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
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
    <div className="pt-20 h-auto">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="max-w-3xl mx-auto p-6 shadow-lg rounded-lg mt-2">
            <h1 className="text-3xl font-bold text-center mb-6">
              About Us
            </h1>
            <p className="text-lg text-center">
              Welcome to{" "}
              <span className="font-semibold">Chatty</span>, the
              ultimate social platform designed to bring people closer! Our
              mission is to create a space where users can connect, express
              themselves, and engage with content that matters to them.
            </p>

            <div className="mt-6">
              <h2 className="text-2xl font-semibold">
                What We Offer
              </h2>
              <ul className="list-disc list-inside mt-3">
                <li>
                  📢 <strong>Create & Share Posts</strong> – Express your
                  thoughts and creativity.
                </li>
                <li>
                  👍 <strong>Like & Dislike Feature</strong> – Engage with
                  content effortlessly.
                </li>
                <li>
                  🔗 <strong>Follow & Unfollow</strong> – Connect with your
                  favorite people.
                </li>
                <li>
                  💬 <strong>Real-time Messaging (End-to-End Encrypted)</strong>{" "}
                  – Secure and private conversations.
                </li>
                <li>
                  🖼 <strong>Profile Customization</strong> – Update your profile
                  with ease.
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-semibold">
                Our Vision
              </h2>
              <p className="mt-2">
                We believe in building an interactive and engaging social space
                where users feel valued, heard, and connected. Whether it's
                sharing updates, engaging in discussions, or making new friends,
                <span className="font-semibold"> Chatty Application </span> is
                here to make every interaction meaningful.
              </p>
              <p className="mt-2">
                🔐 <strong>Your privacy is our priority.</strong> Our messaging
                system is{" "}
                <span className="font-semibold">end-to-end encrypted</span>,
                ensuring that only you and the recipient can read your
                conversations—no one else, not even us!
              </p>
            </div>

            <div className="text-center mt-6">
              <p className="text-lg font-semibold">
                Join us today and be part of a growing digital community! 🚀
              </p>
            </div>

            <div className="text-center mt-6">For more queries contact with Vishal Yadav (vy34365@gmail.com)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutUs;
