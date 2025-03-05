import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { Loader } from "lucide-react";
import { Toaster } from 'react-hot-toast';
import CreatePost from './components/CreatePost';
import PostInfo from './components/PostInfo';
import ChangePassword from './components/ChangePassword';
import ForgotPassword from './components/ForgotPassword';
import AboutUs from './pages/AboutUs';


const App = () => {

  const {authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();


  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // console.log({ authUser });

  if(isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>
  )

  return (
    <div data-theme={theme}>
      <NavBar/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login'/>}/>
        <Route path='/chat' element={authUser ? <ChatPage/> : <Navigate to='/login'/>}/>
        <Route path='/signup' element={!authUser ? <SignUpPage/> : <Navigate to='/' />}/>
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to='/' />}/>
        <Route path='/settings' element={<SettingsPage/>}/>
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to='/login'/>}/>
        <Route path='/create' element={authUser ? <CreatePost/> : <Navigate to='/login'/>}/>
        <Route path='/postInfo' element={authUser ? <PostInfo/> : <Navigate to='/login'/>}/>
        <Route path='/changePassword' element={authUser ? <ChangePassword/> : <Navigate to='/login'/>}/>
        <Route path='/forgotPassword' element={!authUser ? <ForgotPassword/> : <Navigate to='/'/>}/>
        <Route path='/aboutUs' element={authUser ? <AboutUs/> : <Navigate to='/login'/>}/>
      </Routes>

      <Toaster />
    </div>
  )
}

export default App;
