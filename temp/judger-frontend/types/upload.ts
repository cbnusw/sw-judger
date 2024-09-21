interface UploadResponse {
  uploaded: boolean;
  url: string;
  error: any;
  data: {
    ref: string | null;
    refModel: string | null;
    _id: string;
    url: string;
    filename: string;
    mimetype: string;
    size: number;
    uploader: string;
    uploadedAt: string;
    __v: number;
  };
}
