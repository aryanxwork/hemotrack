const request = require('supertest');
const app = require('../src/app');
const { sequelize, UserAdmin, Hospital, BloodRequest } = require('../src/models');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../src/config/jwt');

let token;
let requestId;
let server;

beforeAll(async () => {
  server = app.listen(0);
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  const admin = await UserAdmin.create({ username: 'admin5', password: 'hash', role: 'Admin' });
  token = jwt.sign({ admin_id: admin.admin_id, role: admin.role }, jwtConfig.secret, { expiresIn: '1h' });

  const hospital = await Hospital.create({ hospital_name: 'Test Hosp' });
  const req = await BloodRequest.create({ hospital_id: hospital.hospital_id, blood_group: 'AB+', quantity: 2, status: 'Pending' });
  requestId = req.request_id;
});

afterAll(async () => {
  await sequelize.close();
  server.close();
});

describe('Request Endpoints', () => {
  it('PUT /api/requests/:id/approve on Pending request -> 200', async () => {
    const res = await request(app)
      .put(`/api/requests/${requestId}/approve`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.status).toBe('Approved');
  });

  it('PUT /api/requests/:id/approve on already Approved -> 409', async () => {
    const res = await request(app)
      .put(`/api/requests/${requestId}/approve`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(409);
  });
});
