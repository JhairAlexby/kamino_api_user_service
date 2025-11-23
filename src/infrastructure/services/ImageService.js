import sharp from 'sharp';

export class ImageService {
  constructor(maxSizeBytes = 5 * 1024 * 1024) {
    this.maxSizeBytes = maxSizeBytes;
    this.allowedMime = new Set(['image/jpeg', 'image/png']);
  }

  validate(buffer, mimetype) {
    if (!this.allowedMime.has(mimetype)) {
      const error = new Error('Formato de imagen no soportado');
      error.status = 415;
      throw error;
    }
    if (buffer.length > this.maxSizeBytes) {
      const error = new Error('La imagen excede el tamaño máximo de 5MB');
      error.status = 413;
      throw error;
    }
  }

  async compress(buffer, mimetype) {
    if (mimetype === 'image/jpeg') {
      return sharp(buffer).jpeg({ quality: 80 }).toBuffer();
    }
    if (mimetype === 'image/png') {
      return sharp(buffer).png({ compressionLevel: 9 }).toBuffer();
    }
    return buffer;
  }

  async validateAndCompress(buffer, mimetype) {
    this.validate(buffer, mimetype);
    return this.compress(buffer, mimetype);
  }
}

