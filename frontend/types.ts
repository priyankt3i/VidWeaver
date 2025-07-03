
export enum Stage {
  UPLOAD = 'UPLOAD',
  SCRIPT = 'SCRIPT',
  VIDEO = 'VIDEO',
}

export interface UploadedFile {
  id: string;
  file: {
    name: string;
    uri: string;
    mimeType?: string;
    size?: number;
  };
  summary?: string;
}

export enum ContentType {
  TUTORIAL = 'Tutorial',
  STORY = 'Storytelling',
  REVIEW = 'Product Review',
  NEWS = 'News Announcement',
  CRIME = 'True Crime',
  UNKNOWN = 'Unknown'
}

export interface Project {
  name: string;
  files: UploadedFile[];
  contentType: ContentType;
}

export interface Script {
  raw: string;
  intro: string;
  mainContent: string;
  summary: string;
  cta: string;
}

export interface Video {
  url: string;
  thumbnailUrl: string;
  tags: string[];
}
