const request = require('supertest');
const app = require('../src/app');
const { sequelize, UserAdmin, Hospital, BloodBank, BloodUnit, AuditLog } = require('../src/models');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../src/config/jwt');
const { addDays } = require('../src/utils/dateHelpers');

let token;
let unitId;
let hospitalId;
let expiredUnitId;
let server;

beforeAll(async () => {
  server = app.listen(0);
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  const admin = await UserAdmin.create({ username: 'admin4', password: 'hash', role: 'Admin' });
  token = jwt.sign({ admin_id: admin.admin_id, role: admin.role }, jwtConfig.secret, { expiresIn: '1h' });

  const hospital = await Hospital.create({ hospital_name: 'Test Hosp' });
  hospitalId = hospital.hospital_id;

  const bank = await BloodBank.create({ bank_name: 'Bank' });

  const validUnit = await BloodUnit.create({ blood_group: 'B+', collection_date: new Date(), expiry_date: addDays(new Date(), 10), status: 'Available', bank_id: bank.bank_id });
  unitId = validUnit.unit_id;

  const expiredUnit = await BloodUnit.create({ blood_group: 'O+', collection_date: new Date(), expiry_date: addDays(new Date(), -1), status: 'Expired', bank_id: bank.bank_id });
  expiredUnitId = expiredUnit.unit_id;
});

afterAll(async () => {
  await sequelize.close();
  server.close();
});

describe('Issue Blood Endpoints', () => {
  it('POST /api/issue with non-Available unit -> 409', async () => {
    const res = await request(app)
      .post('/api/issue')
      .set('Authorization', `Bearer ${token}`)
      .send({ unit_id: expiredUnitId, hospital_id: hospitalId });
      
    expect(res.statusCode).toEqual(409);
  });

  it('POST /api/issue with valid data -> 201, unit status becomes Issued', async () => {
    const res = await request(app)
      .post('/api/issue')
      .set('Authorization', `Bearer ${token}`)
      .send({ unit_id: unitId, hospital_id: hospitalId });
      
    expect(res.statusCode).toEqual(201);

    const unit = await BloodUnit.findByPk(unitId);
    expect(unit.status).toBe('Issued');

    const logs = await AuditLog.findAll();
    expect(logs.length).toBeGreaterThan(0);
  });

  it('POST /api/issue with same unit again -> 409', async () => {
    const res = await request(app)
      .post('/api/issue')
      .set('Authorization', `Bearer ${token}`)
      .send({ unit_id: unitId, hospital_id: hospitalId });
      
    expect(res.statusCode).toEqual(409);
  });
});
