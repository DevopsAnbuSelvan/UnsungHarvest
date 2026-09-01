import { registerAs } from '@nestjs/config';

export default registerAs('upload', () => ({
  maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '5242880', 10),
  allowedExtensions: (process.env.UPLOAD_ALLOWED_EXTENSIONS || 'jpg,jpeg,png,webp').split(','),
  dest: process.env.UPLOAD_DEST || './uploads',
  blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN,
}));
