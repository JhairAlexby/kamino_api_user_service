import request from 'supertest';
import { createApp } from '../src/app.js';
import DatabaseInitializer from '../src/infrastructure/database/DatabaseInitializer.js';

const email = `test_user_${Date.now()}@example.com`;
const password = 'P@ssw0rd!';

describe('CRUD Fotos de perfil', () => {
  let app;
  let userId;
  let cookies;

  beforeAll(async () => {
    const db = new DatabaseInitializer();
    await db.initialize();
    app = createApp();
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({ email, password, firstName: 'Test', lastName: 'User' });
    userId = regRes.body.id;
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
    cookies = loginRes.headers['set-cookie'];
  });

  test('POST subir nueva foto', async () => {
    const png = Buffer.from('89504E470D0A1A0A', 'hex');
    const res = await request(app)
      .post(`/api/users/${userId}/profile-picture`)
      .set('Cookie', cookies)
      .attach('file', png, { filename: 'a.png', contentType: 'image/png' });
    expect(res.status).toBe(201);
  });

  test('PUT actualizar foto', async () => {
    const jpeg = Buffer.from('FFD8FFE0', 'hex');
    const res = await request(app)
      .put(`/api/users/${userId}/profile-picture`)
      .set('Cookie', cookies)
      .attach('file', jpeg, { filename: 'b.jpg', contentType: 'image/jpeg' });
    expect(res.status).toBe(200);
  });

  test('DELETE eliminar foto', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}/profile-picture`)
      .set('Cookie', cookies);
    expect(res.status).toBe(200);
  });
});
