# Feedback API

## Description
This project is a Feedback API built with Node.js and Express. It allows users to submit feedback, view all feedback, and delete their own feedback. The API is structured to separate concerns, with routes, controllers, models, and middleware organized into distinct files.

## Project Structure
```
feedback-api
├── src
│   ├── index.js               # Entry point of the application
│   ├── db.js                  # Database connection and queries
│   ├── controllers            # Contains controller files
│   │   └── feedbackController.js # Handles feedback-related operations
│   ├── routes                 # Contains route files
│   │   └── feedbacks.js       # Defines feedback routes
│   ├── models                 # Contains model files
│   │   └── feedbackModel.js    # Defines the Feedback model
│   └── middlewares            # Contains middleware files
│       └── auth.js            # Authentication middleware
├── package.json                # NPM configuration file
├── .env                        # Environment variables
├── .gitignore                  # Git ignore file
└── README.md                   # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd feedback-api
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Create a `.env` file in the root directory and add your environment variables.
2. Start the server:
   ```
   npm start
   ```
3. The API will be running on `http://localhost:3001`.

## API Endpoints
- `GET /feedbacks` - Retrieve all feedback
- `POST /feedbacks` - Submit new feedback
- `DELETE /feedbacks/:id` - Delete feedback by ID (only by the owner)

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License.