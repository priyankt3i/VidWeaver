# 🎬 AI Video Producer

An application to transform a collection of documents into a fully produced YouTube video using AI. This app guides users through processing documents, generating a script, and producing a video with AI-powered narration and visuals, designed to run on iOS, Android, and the web.

---

## ✨ Key Features

-   **Multi-Platform:** Built with React Native and Expo to run natively on iOS, Android, and the Web from a single codebase.
-   **Intelligent Document Processing:** Uses AI to parse multiple file types (`.pdf`, `.txt`, `.md`, etc.), understand their content, and classify them.
-   **AI-Powered Script Generation:** Employs Retrieval-Augmented Generation (RAG) to create engaging, YouTube-optimized video scripts.
-   **Automated Video Production:** Generates voice narration, visuals (from user uploads or AI), subtitles, and background music.
-   **Intuitive User Flow:** A simple, three-step process guides the user from raw files to a finished video.
-   **Scalable Backend:** A powerful FastAPI server orchestrates all AI model interactions, ensuring the frontend remains light and responsive.

---

## 🏗️ Architecture & Design

The application is built on a modern, decoupled, full-stack architecture. The frontend (React Native) is responsible for the user interface and user interactions, while the backend (FastAPI) handles all heavy lifting and business logic.

### Architecture Diagram

```mermaid
graph TD
    subgraph User Devices
        A[iOS App]
        B[Android App]
        C[Web Browser]
    end

    subgraph Frontend (React Native + Expo)
        D[UI Components]
        E[State Management]
        F[API Service Layer]
    end

    subgraph Backend (FastAPI on Server)
        G[REST API Endpoints]
        H[AI Orchestration Logic]
        I[Document Processing]
        J[Script Generation - RAG]
        K[Video/Audio Generation]
    end

    subgraph External Services
        L[Google Gemini API]
        M[File Storage (S3/Firebase)]
    end

    A & B & C --> F
    F -- REST API (HTTPS) --> G
    G --> H
    H --> I
    H --> J
    H --> K
    I -- Uses --> L
    J -- Uses --> L
    K -- Uses --> L
    H -- Stores/Retrieves Files --> M
```

### Design Philosophy

The UI/UX is designed to be **minimalist and intuitive**. It follows a clear, linear, step-by-step process, reducing cognitive load on the user. The dark-themed, modern aesthetic uses a clean font (`Inter`) and a focused color palette to create a professional and pleasant user experience.

---

## 🛠️ Technology Stack

| Area      | Technology                                                                                                  |
| :-------- | :---------------------------------------------------------------------------------------------------------- |
| **Frontend**  | [React Native](https://reactnative.dev/), [Expo](https://expo.dev/), [NativeWind](https://www.nativewind.dev/) (for Tailwind CSS), [TypeScript](https://www.typescriptlang.org/) |
| **Backend**   | [Python](https://www.python.org/), [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/) |
| **AI Models** | [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash-preview-04-17`, etc.)                           |
| **Platforms** | iOS, Android, Web                                                                                           |

---

## 📁 Project Structure

The repository is organized into a `frontend` monorepo and a `backend` service.

```
.
├── backend/
│   ├── main.py             # FastAPI application, routes, and logic
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── app.json            # Expo configuration file
│   ├── App.tsx             # Main App component (entry point)
│   ├── package.json        # Node.js dependencies
│   ├── tailwind.config.js  # NativeWind styling configuration
│   ├── components/         # Reusable UI components (e.g., FileUpload, ScriptEditor)
│   ├── services/           # API service to communicate with the backend
│   └── types.ts            # Shared TypeScript types and enums
└── README.md               # You are here!
```

---

## 🚀 Getting Started

Follow these instructions to get the project running locally for development and testing.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (LTS version) and npm/yarn
-   [Python](https://www.python.org/downloads/) 3.8+ and pip
-   [Git](https://git-scm.com/)
-   An API Key from [Google AI Studio](https://ai.google.dev/).

### 1. Backend Setup

First, set up and run the FastAPI server.

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment
python -m venv venv
# On Windows:
# venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Create a .env file in the `backend` directory
# Add your Google AI API key to it:
# API_KEY="YOUR_GOOGLE_AI_API_KEY"

# 5. Run the FastAPI server
# The --reload flag automatically restarts the server on code changes
uvicorn main:app --reload
```

The backend API will now be running at `http://127.0.0.1:8000`.

### 2. Frontend Setup

With the backend running, you can now start the frontend application.

```bash
# 1. Navigate to the frontend directory in a new terminal
cd frontend

# 2. Install Node.js dependencies
npm install

# 3. Start the Expo development server
npx expo start
```

This will open the Expo developer tools in your browser. From here, you can:
-   **Run on iOS:** Scan the QR code with the Expo Go app on your iPhone.
-   **Run on Android:** Scan the QR code with the Expo Go app on your Android device.
-   **Run in Web Browser:** Press `w` in the terminal.

The app will connect to your local backend server to function correctly.

---

## 📝 API Endpoints

The FastAPI backend provides the following endpoints:

| Method | Endpoint             | Description                                          |
| :----- | :------------------- | :--------------------------------------------------- |
| `POST` | `/process-documents` | Analyzes uploaded files and determines content type. |
| `POST` | `/generate-script`   | Generates a video script based on project context.   |
| `POST` | `/generate-video`    | Mocks the generation of the final video and assets.  |
