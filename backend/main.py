import os
import json
from typing import List, Optional, Dict

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# --- Environment and API Configuration ---

load_dotenv()

API_KEY = os.getenv("API_KEY")
if not API_KEY:
    raise ValueError("API_KEY not found in .env file")


genai.configure(api_key=API_KEY)

app = FastAPI(
    title="AI Video Producer API",
    description="Backend service for the AI Video Producer application.",
    version="1.0.0"
)

# --- CORS Configuration ---
# Allows the frontend (running on a different port) to communicate with this backend.

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models for Data Validation ---
# These models ensure that the data sent from the frontend matches the expected structure.

class FileInfo(BaseModel):
    name: str

class UploadedFileModel(BaseModel):
    id: str
    file: FileInfo
    summary: Optional[str] = None

class ProjectModel(BaseModel):
    name: str
    files: List[UploadedFileModel]
    contentType: str

class SceneModel(BaseModel):
    scene: int
    text: str
    visual: str

class ScriptModel(BaseModel):
    raw: str
    scenes: List[SceneModel]

class GenerateVideoBody(BaseModel):
    script: ScriptModel
    content_type: str = Field(..., alias="contentType")

class VideoModel(BaseModel):
    url: str
    thumbnailUrl: str
    tags: List[str]

class FileSummary(BaseModel):
    id: str
    summary: str

class ProcessDocumentsResponse(BaseModel):
    contentType: str
    fileSummaries: List[FileSummary]

# --- Helper Functions ---

def get_gemini_model():
    """Initializes and returns the Gemini model."""
    return genai.GenerativeModel('gemini-1.5-flash')

# --- API Endpoints ---

@app.get("/")
def read_root():
    """A simple endpoint to confirm the API is running."""
    return {"status": "ok", "message": "Welcome to the AI Video Producer API!"}

@app.post("/process-documents", response_model=ProcessDocumentsResponse)
async def process_documents(
    files: List[UploadFile] = File(...),
    file_ids: List[str] = Form(...)
):
    """
    Analyzes uploaded files, determines content type, and generates summaries.
    """
    if len(files) != len(file_ids):
        raise HTTPException(status_code=400, detail="Mismatch between number of files and file IDs.")

    model = get_gemini_model()
    file_contents = []
    file_summaries = []

    try:
        for i, file in enumerate(files):
            content = await file.read()
            file_contents.append(f"--- FILE: {file.filename} ---\n{content.decode('utf-8', errors='ignore')}")

            # Generate summary for each file
            summary_prompt = f"Summarize the following document in one or two sentences:\n\n{content.decode('utf-8', errors='ignore')}"
            summary_response = await model.generate_content_async(summary_prompt)
            file_summaries.append(FileSummary(id=file_ids[i], summary=summary_response.text.strip()))

        # Determine overall content type
        combined_content = "\n\n".join(file_contents)
        type_prompt = f"""
        Analyze the combined content of the following documents and determine the most likely content type for a YouTube video.
        Choose one from: 'Tutorial', 'Documentary', 'Commentary', 'Code Walkthrough', 'Presentation', 'Listicle', 'News Report', 'Story Narration'.
        
        Content:
        {combined_content[:4000]}
        
        Respond with only the content type name.
        """
        type_response = await model.generate_content_async(type_prompt)
        content_type = type_response.text.strip()

        return ProcessDocumentsResponse(contentType=content_type, fileSummaries=file_summaries)
    except Exception as e:
        print(f"Error processing documents: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the documents: {str(e)}")

@app.post("/generate-script", response_model=ScriptModel)
async def generate_script(project: ProjectModel):
    """
    Generates a video script based on the project context using RAG.
    """
    model = get_gemini_model()
    file_summaries = "\n".join([f"- {f.file.name}: {f.summary}" for f in project.files if f.summary])

    prompt = f"""
    You are a professional YouTube scriptwriter. Your task is to create a compelling video script based on the provided documents.

    Project Name: "{project.name}"
    Video Content Type: "{project.contentType}"
    Source Document Summaries:
    {file_summaries}

    Instructions:
    1. Write a script that is engaging, clear, and optimized for YouTube.
    2. The script should have a hook, main content, and a conclusion with a call to action.
    3. For each scene, provide the narration text and a simple, clear visual suggestion (e.g., "A-roll of speaker", "B-roll of code on screen", "Animated graphic of a chart").
    4. Return the response as a single, valid JSON object with two keys: "raw" (the full script as a single string) and "scenes" (a list of objects, each with "scene", "text", and "visual" keys).

    Example JSON format:
    {{
      "raw": "The entire script text goes here...",
      "scenes": [
        {{"scene": 1, "text": "Hello and welcome!", "visual": "Presenter smiling at the camera."}},
        {{"scene": 2, "text": "Today we're talking about...", "visual": "Title card with the video topic."}}
      ]
    }}
    """
    try:
        response = await model.generate_content_async(prompt)
        # Clean the response to ensure it's valid JSON
        cleaned_text = response.text.strip().replace("```json", "").replace("```", "")
        script_data = json.loads(cleaned_text)
        return ScriptModel(**script_data)
    except Exception as e:
        print(f"Error generating script: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate script. The AI model may have returned an invalid format. {str(e)}")

@app.post("/generate-video", response_model=VideoModel)
async def generate_video(body: GenerateVideoBody):
    """
    Mocks the generation of the final video and assets.
    In a real application, this would trigger a video rendering pipeline.
    """
    # This is a mock endpoint. It returns static data.
    return VideoModel(
        url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnailUrl=f"https://picsum.photos/seed/{body.script.raw[:20]}/1280/720",
        tags=["AI Generated", "Demo", body.content_type, "FastAPI", "React Native"]
    )