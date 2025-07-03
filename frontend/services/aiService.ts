
import { UploadedFile, Project, Script, Video, ContentType } from '../types';

// In a real app, this would come from an environment variable
const API_BASE_URL = 'http://127.0.0.1:8000'; 

const processDocuments = async (files: UploadedFile[]): Promise<{ contentType: ContentType, fileSummaries: {id: string, summary: string}[] }> => {
  const requestBody = {
    files: files.map(f => ({ id: f.id, name: f.file.name, type: f.file.mimeType || 'application/octet-stream' }))
  };
  
  const response = await fetch(`${API_BASE_URL}/process-documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const generateScript = async (project: Project): Promise<Script> => {
    const requestBody = {
      project: {
        ...project,
        files: project.files.map(f => ({ id: f.id, name: f.file.name, type: f.file.mimeType || 'application/octet-stream' }))
      }
    };

    const response = await fetch(`${API_BASE_URL}/generate-script`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const generateVideo = async (script: Script, contentType: ContentType): Promise<Video> => {
    const response = await fetch(`${API_BASE_URL}/generate-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, contentType }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const aiService = {
  processDocuments,
  generateScript,
  generateVideo,
};
