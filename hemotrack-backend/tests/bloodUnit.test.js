const request = require('supertest');
const app = require('../src/app');
const { sequelize, UserAdmin, BloodBank, BloodUnit } = require('../src/models');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../src/config/jwt');
const { addDays } = require('../src/utils/dateHelpers');

let token;
let bankId;
let server;

beforeAll(async () => {
  server = app.listen(0);
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  const admin = await UserAdmin.create({ username: 'admin3', password: 'hash', role: 'Admin' });
  token = jwt.sign({ admin_id: admin.admin_id, role: admin.role }, jwtConfig.secret, { expiresIn: '1h' });

  const bank = await BloodBank.create({ bank_name: 'Test Bank', contact_no: '111', email: 'b@b.com' });
  bankId = bank.bank_id;
});

afterAll(async () => {
  await sequelize.close();
  server.close();
});

describe('Blood Unit Endpoints', () => {
  it('POST /api/blood-units with expiry_date in the past -> status auto-set to Expired', async () => {
    const pastDate = addDays(new Date(), -5);
    
    const res = await request(app)
      .post('/api/blood-units')
      .set('Authorization', `Bearer ${token}`)
      .send({
        blood_group: 'A+',
        collection_date: new Date().toISOString(),
        expiry_date: pastDate.toISOString(),
        bank_id: bankId
      });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.status).toBe('Expired');
  });

  it('GET /api/blood-units/stock/A+ -> returns integer', async () => {
    const res = await request(app)
      .get('/api/blood-units/stock/A+')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    expect(typeof res.body.data.stock).toBe('number');
  });
});
