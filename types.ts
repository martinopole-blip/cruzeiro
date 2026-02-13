export interface UploadedImage {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}

export interface GenerationState {
  isLoading: boolean;
  resultImage?: string;
  error?: string;
}

export enum Gender {
  MALE = 'Homem',
  FEMALE = 'Mulher',
  COUPLE = 'Casal',
}