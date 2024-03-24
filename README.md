# Country Explorer README

## Project Name
Country Explorer

## Description
Country Explorer is a web application designed to allow users to explore and interact with various landmarks around the world. Users can add locations by specifying the name, description, latitude, longitude, and upload an image for each landmark. This application is built with Firebase, Hapi, and Node.js, providing a robust back-end architecture and a user-friendly interface for landmark management.

## Installation

1. **Clone the Repository**: 
   git clone https://github.com/GuineaCoding/Country_Explorer.git 

2. **Navigate to the Project Directory**:
   ```bash
   cd country-explorer
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Firebase Setup**:
   - Set up a Firebase project and obtain your Firebase credentials.
   - Create a `.env` file in the project root and a file called strategic-reef-146715-firebase-adminsdk-xvlx3-d16ab10c2d.json with your Firebase app credentials.

5. **Start the Application**:
   ```bash
   npm start
   ```

## Features
- User Authentication: Signup and login functionality with secure password handling.
- Landmark Management: Users can add, view, and manage landmarks with detailed information.
- Admin Dashboard: Special privileges for admin users, including user management and viewing user statistics.
- User Profile Editing: Users can update their profile information.

## Usage
After installation, navigate to the application URL (typically `http://localhost:3000`) and follow the intuitive user interface to interact with landmarks or manage user accounts (if logged in as an admin).

## Contributing
Contributions to Country Explorer are welcome. Please ensure that your code adheres to the existing style and that all tests pass before submitting a pull request.

## License
This project is licensed under the ISC License.

## Controllers Overview
Country Explorer's functionality is managed by several controllers:

- **Accounts Controller**: Manages user authentication, signup, login, and profile editing.
- **Admin Controller**: Handles admin functionalities like user management and viewing analytics.
- **Edit Account Controller**: Allows users to edit their personal profiles.

Each controller plays a vital role in maintaining the application's workflow and ensuring a seamless user experience.

## Version Information
- Node.js: `>=16`
- Hapi: `^21.3.2`
- Firebase: `^10.8.0`
- Other dependencies are listed in the `package.json` file.