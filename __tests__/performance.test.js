import { ImageService } from '../src/infrastructure/services/ImageService.js';
import sharp from 'sharp';
import DatabaseInitializer from '../src/infrastructure/database/DatabaseInitializer.js';
import { PostgresUserRepository } from '../src/infrastructure/adapters/output/persistence/PostgresUserRepository.js';

describe('Rendimiento de imágenes', () => {
  test('Compresión bajo 1500ms y guardado bajo 1500ms', async () => {
    const service = new ImageService();
    const buf = await sharp({ create: { width: 200, height: 200, channels: 3, background: { r: 255, g: 0, b: 0 } } }).png().toBuffer();
    const t1 = Date.now();
    const compressed = await service.compress(buf, 'image/png');
    const t2 = Date.now();
    expect(t2 - t1).toBeLessThan(1500);

    const db = new DatabaseInitializer();
    await db.initialize();
    const repo = new PostgresUserRepository();
    const user = await repo.save({ email: `perf_${Date.now()}@ex.com`, password: 'x', firstName: 'P', lastName: 'F', role: 'USER', isActive: true });
    const t3 = Date.now();
    await repo.updateProfilePicture(user.id, compressed);
    const t4 = Date.now();
    expect(t4 - t3).toBeLessThan(1500);
  });
});
