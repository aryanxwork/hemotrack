const request = require('supertest');
const app = require('../src/app');
const { sequelize, UserAdmin } = require('../src/models');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../src/config/jwt');

let token;
let server;

beforeAll(async () => {
  server = app.listen(0);
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  const admin = await UserAdmin.create({ username: 'testadmin2', password: 'hash', role: 'Admin' });
  token = jwt.sign({ admin_id: admin.admin_id, role: admin.role }, jwtConfig.secret, { expiresIn: '1h' });
});

afterAll(async () => {
  await sequelize.close();
  server.close();
});

describe('Donor Endpoints', () => {
  it('POST /api/donors with age 17 -> 400', async () => {
    const res = await request(app)
      .post('/api/donors')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test', age: 17, gender: 'Male', blood_group: 'A+', phone: '1234567890' });
      
    expect(res.statusCode).toEqual(400);
  });

  it('POST /api/donors with age 70 -> 400', async () => {
    const res = await request(app)
      .post('/api/donors')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test', age: 70, gender: 'Male', blood_group: 'A+', phone: '1234567890' });
      
    expect(res.statusCode).toEqual(400);
  });

  it('POST /api/donors with valid data -> 201', async () => {
    const res = await request(app)
      .post('/api/donors')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Valid Donor', age: 30, gender: 'Female', blood_group: 'O+', phone: '9876543210' });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/donors with duplicate phone -> 409', async () => {
    const res = await request(app)
      .post('/api/donors')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Another Donor', age: 35, gender: 'Male', blood_group: 'B+', phone: '9876543210' });
      
    expect(res.statusCode).toEqual(409);
  });

  it('GET /api/donors -> 200 + array', async () => {
    const res = await request(app)
      .get('/api/donors')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
