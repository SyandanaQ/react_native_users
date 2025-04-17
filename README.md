# React Native CRUD Users App

This is a simple React Native CRUD app using Expo to manage a list of users (name and email) with backend integration (Express.js + MySQL).

## Tech Stack:
- **Frontend**: React Native (Expo)
- **Backend**: Express.js
- **Database**: MySQL
- **State Management**: React Hooks
- **API Communication**: Axios

## Setup Instructions

### 1. Clone the repository:
```bash
git clone https://github.com/SyandanaQ/react_native_users.git
cd react_native_users
```
### 2. Backend Setup:
Go to backend folder and install dependencies:
```bash
cd folder_backend
npm install
```
Set up MySQL Database:
```bash
CREATE DATABASE name_db;
CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100));
```
Configure backend API in config.js with your MySQL credentials.
Start the backend server:
```bash
npm start
```
### 3. Frontend Setup:
Go to frontend folder and install dependencies:
```bash
cd path/to/react_native_users-main
npm install
```
Configure the API URL in .env file:
```bash
EXPO_PUBLIC_API_URL=http://localhost:3001
```
Start the React Native app:
```bash
npm start
```
### 4. Running the App:
Scan the QR code with Expo Go on your phone, or use an emulator.
