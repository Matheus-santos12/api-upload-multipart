export interface UploadFile {
  name: string;
  size: number;
  stream: NodeJS.ReadableStream;
}

export interface FileMetaData {
  id: string;
  name: string;
  size: number;
  url: string;
}

export abstract class StorageProvider {
  abstract upload(file: UploadFile): Promise<FileMetaData>;
  abstract delete(id: string): Promise<void>;
}
