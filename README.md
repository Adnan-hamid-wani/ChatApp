Chat App

A real-time chat application built with Node.js, React.js, Socket.IO, and Vite. This project demonstrates how to create a fully functional chat system with a responsive frontend and a WebSocket-based backend for instant communication.

Features

Real-time communication with Socket.IO.

Modern frontend built with React.js and Vite.

Scalable and efficient backend using Node.js.

Support for multiple chat rooms.

Clean and responsive UI.

Technologies Used

Frontend:

React.js: For building the user interface.

Vite: For fast and modern development tooling.

Yarn: For dependency management.

Backend:

Node.js: Backend runtime environment.

Express.js: Web framework for creating APIs.

Socket.IO: For real-time WebSocket communication.

Installation

Prerequisites

Node.js (v14 or later)

Yarn (latest version)

Steps

Clone the repository:

git clone https://github.com/your-repo/chat-app.git

Navigate to the project directory:

cd chat-app

Install dependencies for the frontend:

cd frontend
yarn install

Install dependencies for the backend:

cd ../backend
yarn install

Running the Application

Start the Backend

Navigate to the backend folder:

cd backend

Start the server:

yarn start

Start the Frontend

Open a new terminal and navigate to the frontend folder:

cd frontend

Start the development server:

yarn dev

Open your browser and navigate to:

http://localhost:3000

Project Structure

chat-app/
├── frontend/     # Frontend code (React, Vite)
│   ├── public/   # Static assets
│   ├── src/      # React components
│   └── package.json
├── server/      # Backend code (Node.js, Express, Socket.IO)
│   |--index.js
│   └── package.json
└── README.md     # Project documentation

Usage

Start Chatting: Open the application in multiple browser tabs or devices, join the same chat room, and start exchanging messages in real time.

License

This project is licensed under the MIT License. Feel free to use and modify it as needed.

Acknowledgments

Node.js

React.js

Socket.IO

Vite
