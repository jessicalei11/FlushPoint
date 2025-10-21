# FlushPoint
The NYC app that proves the city never sleeps... nor should you have to hold it.

Welcome to FlushPoint, a mobile application that's designed to help you quickly find the nearest clean and accessible public restrooms across New York City. 

## Key Features
* Find nearby bathrooms by using your device's location to view a populated map with all contributed restrooms in your area.

* Users can search for specific bathroom locations.

* Users are able to add new bathroom locations, to make sure the database continuously grows and remains accurate and up-to-date.

* The app allows users to leave detailed ratings and reviews on cleanliness, accessibility, and overall experience, helping the community identify reliably sanitary spots.

## Setup & Installation Guide
**Prerequisites**
* **Node.js**: Ensure you have Node.js **(v22 or higher)** installed. The latest LTS version is recommended for both projects.

* **MongoDB**: A running instance of a MongoDB database. You can use a local installation or a cloud service like MongoDB Atlas.

* **Git**: Git must be installed to clone the repository.

* **npm**: Node package manager.

* **Google Maps API Key**: : A valid key with billing enabled for using Maps/Places features.

* **Cloudinary Account**: An account for managing cloud storage of user-uploaded images.

* **Expo Go App**: For easily testing the mobile app on physical iOS or Android devices.

**Step 1: Clone the Repository** <br>
Clone the project from your Git repository to your local machine. In the terminal:
```
git clone https://github.com/jessicalei11/FlushPoint.git
```
**Step 2: Backend Setup**
Navigate into the backend directory and install the dependencies.
```
cd backend 
npm install 
```

**Step 3:.env Setup**
Create a `.env` file in the `backend` directory and add your environment variables. 
```
PORT=3000
MONGO_URI=<YOUR_MONGO_DB_URI>
JWT_SECRET=<YOUR_VERY_HARD_TO_FIND_SECRET>

CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>
CLOUDINARY_API_KEY=<YOUR_CLOUDINARY_API_KEY>
CLOUDINARY_API_SECRET=<YOUR_CLOUDINARY_API_SECRET>
```

**Step 4: Start the server**
```
npm run dev
```

**Step 5: Frontend Setup**
Open a new terminal, navigate to the `mobile` directory, install the dependencies, and start the expo development server.
```
cd mobile 
npm install
прх ехро
```

## Aditional Information
[Figma](https://www.figma.com/design/aXRgxJseo6pDSljto5GDeW/Untitled?node-id=0-1&t=1jTUm2m4Egth3V54-1)
[Timesheet](https://docs.google.com/spreadsheets/d/1oe3HgWEz1axiPsVEPOCOrG8cxm5t2RXCUKGzKnlUd-4/edit?usp=sharing)
