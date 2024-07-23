

# RESTA: Receipt Extract Scan Track and Analysis

RESTA is a web application designed to help users manage and analyze their receipts. The application leverages HTML, JavaScript, CSS, the Mindee API, and Firebase to provide functionalities such as uploading receipts, capturing images, viewing receipts, and extracting expense data.

## Features
1. **File Upload**
   - Users can upload images of receipts.
   - Uploaded images are stored in Firebase Storage with a timestamped filename.
   - The image is sent to the Mindee API for data extraction.
   - Extracted data is processed for null values and stored in Firestore.

2. **Image Capture**
   - Users can capture images of receipts using a JS canvas.
   - Captured images undergo the same processing as uploaded images.

3. **View Receipts**
   - Users can view all receipts.
   - Receipts can be searched by date, month, year, or custom date ranges.

4. **Expense Extraction**
   - Users can extract and analyze total expenses for different timeframes (day, week, month, year).
   - Category-wise expense analysis is available for various durations.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Firebase (Firestore, Storage)
- **API**: Mindee API for data extraction

## Getting Started

### Prerequisites
- Node.js and npm installed
- Firebase project set up
- Mindee API account and API key

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/resta.git
   cd resta
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore and Firebase Storage.
   - Copy the Firebase configuration and replace the configuration in your project.

4. Set up Mindee API:
   - Sign up for a Mindee API account at [Mindee](https://www.mindee.com/).
   - Obtain your API key and add it to your project.

### Configuration
1. Create a `.env` file in the root of your project and add your Firebase and Mindee API credentials:
   ```env
   REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
   MINDEE_API_KEY=your-mindee-api-key
   ```

### Running the Application
1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## Usage
### File Upload
1. Click on the 'Upload' button.
2. Select an image file of a receipt.
3. The image will be uploaded, processed, and stored.

### Image Capture
1. Click on the 'Capture' button.
2. Capture an image of a receipt using the JS canvas.
3. The captured image will be processed and stored.

### View Receipts
1. Click on the 'View Receipts' button.
2. Use the search options to filter receipts by date, month, year, etc.

### Expense Extraction
1. Click on the 'Extract' button.
2. View total and category-wise expenses for different timeframes.

## Contributing
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`.
3. Make your changes and commit them: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-branch`.
5. Submit a pull request.


## Contact
For any questions or suggestions, please contact [harishprasathvg@example.com](mailto:your-email@example.com).

---
