export class UploadAdapter {
  loader: { file: Promise<File> };
  uploadService: { upload: (file: File) => Promise<UploadResponse> };

  constructor(
    loader: { file: Promise<File> },
    uploadService: { upload: (file: File) => Promise<UploadResponse> },
  ) {
    this.loader = loader;
    this.uploadService = uploadService;
  }

  upload(): Promise<{ default: string }> {
    return this.loader.file
      .then((file: File) => this.uploadService.upload(file))
      .then((response: UploadResponse) => {
        return { default: response.data.url };
      })
      .catch((error: any) => {
        console.error(error);
        throw error;
      });
  }
}
