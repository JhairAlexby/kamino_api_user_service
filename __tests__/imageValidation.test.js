import { ImageService } from '../src/infrastructure/services/ImageService.js';

describe('Validación de imágenes', () => {
  test('Rechaza imágenes mayores a 5MB', async () => {
    const service = new ImageService();
    const buf = Buffer.alloc(6 * 1024 * 1024, 0);
    expect(() => service.validate(buf, 'image/png')).toThrow('La imagen excede el tamaño máximo de 5MB');
  });

  test('Rechaza formatos no soportados', async () => {
    const service = new ImageService();
    const buf = Buffer.alloc(1024, 0);
    expect(() => service.validate(buf, 'image/gif')).toThrow('Formato de imagen no soportado');
  });
});

