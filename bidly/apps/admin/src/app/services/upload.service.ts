import { Injectable } from '@angular/core';
import { FileDto } from '@api-client';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UploadService {
  async upload(file: File): Promise<FileDto> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${environment.baseUrl}/api/storage?bucket=biddly`,
        {
          method: 'POST',
          body: formData,
        },
      );

      const results = (await response.json()) as FileDto;

      return results;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  async delete(url: string): Promise<void> {
    const encodeUrl = encodeURIComponent(url);
    await fetch(`${environment.baseUrl}/api/storage/${encodeUrl}`, {
      method: 'DELETE',
    });

    return;
  }
}
