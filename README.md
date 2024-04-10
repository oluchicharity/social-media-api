This repository contains a social media API built with Express.js and TypeScript. In this Application, a user can Register, login, follow other users, unfollow, like and comments on posts, get details of a post(number of likes and comments) on a post. 

Dependencies
Before running the API, ensure you have the following dependencies installed:

"dependencies": {
    "@types/mongoose": "^5.11.97",
    "@types/node": "^20.12.4",
    "bcrypt": "^5.1.1",
    "body-parser": "^1.20.2",
    "cloudinary": "^1.41.3",
    "concurrently": "^8.2.2",
    "express": "^4.19.2",
    "express-validator": "^7.0.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.3.0",
    "multer": "^1.4.5-lts.1",
    "multer-storage-cloudinary": "^4.0.0",
    "nodemon": "^3.1.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.4"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/dotenv": "^8.2.0",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/multer": "^1.4.11",
    "dotenv": "^16.4.5"
  }
}

Create a .env file in the root directory and configure the following environment variables:

PORT=2003

SECRET=SECRET

CLOUDINARY_CLOUD_NAME=dheu5jnjj

CLOUDINARY_API_KEY=728462279138892

CLOUDINARY_API_SECRET=xVkBFIfq68y7nLotoUJWs7RYCD8

Running the API
Once the installation is complete and the environment variables are configured, you can run the API using the following command:
"start": "node build/server.js",
    "build": "tsc",
    "watch": "tsc -w",
    "dev": "concurrently \"npm run watch\" \"npm run start\""
    
The API will start running on the port specified in the .env file (default is port 2003).

API Endpoints

POST https://social-media-api-nxpy.onrender.com/api/v1/register: Register a new user.
POST https://social-media-api-nxpy.onrender.com/api/v1/login: Log in an existing user.
GET https://social-media-api-nxpy.onrender.com/api/v1/6611580a6102382f9e846958/getOne: Get details of a specific user.
POST https://social-media-api-nxpy.onrender.com/api/v1/posts: Create a new post.
GET https://social-media-api-nxpy.onrender.com/api/v1/661509361d32e993fc6fe6d7: Get details of a specific post.
POST https://social-media-api-nxpy.onrender.com/api/v1/661509361d32e993fc6fe6d7/comment: Add a comment to a post.
POST https://social-media-api-nxpy.onrender.com/api/v1/661509361d32e993fc6fe6d7/like: Like a post.
POST https://social-media-api-nxpy.onrender.com/api/v1/follow: Follow a user.
POST https://social-media-api-nxpy.onrender.com/api/v1/unFollow: Unfollow a user.
GET https://social-media-api-nxpy.onrender.com/api/v1/feed?page=1&limit=10: See posts made by your followers.

Testing
You can test the API endpoints using Postman.

Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to open an issue or create a pull request.

