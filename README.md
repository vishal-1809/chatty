# Chatty

A full-stack social media platform featuring user authentication, post interactions, messaging, and account management.


## Live Demo 
[🌐 Chatty](https://chatty-ukv3.onrender.com/)

## Features
- **User Authentication**: Secure login and registration.
- **Post Management**: Users can create, edit, and delete posts.
- **Like & Dislike**: React to posts with likes or dislikes.
- **Follow & Unfollow**: Connect with other users.
- **Messaging**: End-to-end encrypted direct messages.
- **Password Management**: Forgot password and change password functionality.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT-based authentication
- **Real-time Updates**: WebSockets with Socket.io

## Installation
### 1. Clone the Repository
```sh
git clone https://github.com/vishal-1809/chatty.git
```

### 2. Install Dependencies
```sh
cd Frontend
npm install
cd ../Backend
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory (Backend) and configure the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ENCRYPTION_KEY=your_encryption_key
NODE_ENV = development/production
```

### 4. Run the Server
```sh
cd Frontend
npm run dev

cd Backend  -- Run individually
npm run dev
```

## Results
![Chatty Preview](/Frontend/src/assets/result-chatty.png)

## Contributing
Feel free to contribute by submitting pull requests. Ensure your code follows best practices and is well-documented.

## Support
If you like this project, please ⭐️ the repository to show your support!

