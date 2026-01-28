export interface UploadFile {
  id?: string;
  name: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt?: string;
  status?: string;
}

export interface IFileServiceHandler {
  handleUpload(file: File): Promise<UploadFile>;
  handleDelete(url: string): Promise<void>;
  handleDeleteMany?(url: string): Promise<UploadFile>;
}

export type UploadHandler = (file: File) => Promise<UploadFile>;
export type DeleteHandler = (url: string) => Promise<void>;
