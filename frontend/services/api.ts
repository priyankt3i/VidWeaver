import { UploadedFile, Project, Script, Video, ContentType } from '../types';
//import { config } from '../config';
import Constants from 'expo-constants';

// The README specifies the backend runs on port 8000.
// For native mobile, you might need to use your machine's local IP address instead of 'localhost'.
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl; // config.apiBaseUrl;

/**
 * A generic handler for API responses.
 * @param response The fetch Response object.
 * @returns The JSON body of the response.
 * @throws An error if the response is not ok.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    // Try to parse for a more specific backend error message
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.detail || `API Error: ${response.status} ${response.statusText}`);
    } catch {
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }
  }
  return response.json() as Promise<T>;
}

async function processDocuments(files: UploadedFile[]): Promise<{ contentType: ContentType; fileSummaries: { id: string; summary: string }[] }> {
  const formData = new FormData();

  for (const uploadedFile of files) {
    // In React Native, we can pass an object with uri, name, and type to FormData
    formData.append('files', {
      uri: uploadedFile.file.uri,
      name: uploadedFile.file.name,
      type: uploadedFile.file.mimeType,
    } as any);
    // We also send the client-side ID to map summaries back on the client
    formData.append('file_ids', uploadedFile.id);
  }

  const response = await fetch(`${API_BASE_URL}/process-documents`, { method: 'POST', body: formData });
  return handleResponse(response);
}

async function generateScript(project: Project): Promise<Script> {
  const response = await fetch(`${API_BASE_URL}/generate-script`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(project) });
  return handleResponse(response);
}

async function generateVideo(script: Script, contentType: ContentType): Promise<Video> {
  const response = await fetch(`${API_BASE_URL}/generate-video`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ script, content_type: contentType }) });
  return handleResponse(response);
}

export const apiService = {
  processDocuments,
  generateScript,
  generateVideo,
};
