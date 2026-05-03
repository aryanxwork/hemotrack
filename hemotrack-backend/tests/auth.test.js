const request = require('supertest');
const app = require('../src/app');
const { sequelize, UserAdmin } = require('../src/models');
const bcrypt = require('bcryptjs');

let server;

beforeAll(async () => {
  server = app.listen(0);
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  
  const passwordHash = await bcrypt.hash('password123', 10);
  await UserAdmin.create({ username: 'testadmin', password: passwordHash, role: 'Admin' });
});

afterAll(async () => {
  await sequelize.close();
  server.close();
});

describe('Auth Endpoints', () => {
  it('POST /api/auth/login with valid credentials -> 200 + token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testadmin', password: 'password123' });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('POST /api/auth/login with wrong password -> 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testadmin', password: 'wrongpassword' });
      
    expect(res.statusCode).toEqual(401);
  });

  it('Access protected route without token -> 401', async () => {
    const res = await request(app).get('/api/donors');
    expect(res.statusCode).toEqual(401);
  });
});
