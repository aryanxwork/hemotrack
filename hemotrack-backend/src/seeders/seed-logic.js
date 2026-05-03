const bcrypt = require('bcryptjs');
const {
  BloodBank,
  UserAdmin,
  Donor,
  Hospital,
  BloodUnit,
  DonationRecord,
  BloodRequest,
  IssueRecord,
  AuditLog,
  sequelize
} = require('../models');
const { addDays } = require('../utils/dateHelpers');
const logger = require('../utils/logger');

const seedLogic = async () => {
  // Sync database (Wipes existing data for a clean massive seed)
  await sequelize.sync({ force: true });

  // 1. BLOOD_BANKS
  const banks = await BloodBank.bulkCreate([
    { bank_name: 'City Blood Center', location: 'Delhi', contact_no: '9876543210', email: 'city@blood.com' },
    { bank_name: 'LifeCare Blood Bank', location: 'Noida', contact_no: '9123456780', email: 'lifecare@blood.com' }
  ]);

  // 2. USER_ADMINS
  const passwordHash = await bcrypt.hash('password123', 10);
  const admins = await UserAdmin.bulkCreate([
    { username: 'admin1', password: passwordHash, role: 'Admin' },
    { username: 'staff1', password: passwordHash, role: 'Staff' }
  ]);

  // 3. DONORS (8 Donors)
  const donorData = [
    { name: 'Rahul Sharma', age: 25, blood_group: 'A+' },
    { name: 'Priya Patel', age: 30, blood_group: 'B+' },
    { name: 'Amit Singh', age: 40, blood_group: 'O-' },
    { name: 'Sneha Reddy', age: 22, blood_group: 'AB+' },
    { name: 'Vikram Malhotra', age: 35, blood_group: 'A-' },
    { name: 'Anjali Gupta', age: 28, blood_group: 'B-' },
    { name: 'Karan Mehra', age: 45, blood_group: 'O+' },
    { name: 'Riya Sen', age: 31, blood_group: 'AB-' }
  ];
  const donors = await Donor.bulkCreate(donorData.map((d, i) => ({
    ...d,
    gender: i % 2 === 0 ? 'Male' : 'Female',
    phone: `98765432${10 + i}`,
    email: `${d.name.split(' ')[0].toLowerCase()}@email.com`,
    address: i % 2 === 0 ? 'Delhi' : 'Noida',
    last_donation_date: new Date()
  })));

  // 4. HOSPITALS (8 Hospitals)
  const hospitalNames = ['Apollo', 'Fortis', 'Max', 'AIIMS', 'Medanta', 'Sir Ganga Ram', 'Holy Family', 'St. Stephens'];
  const hospitals = await Hospital.bulkCreate(hospitalNames.map((name, i) => ({
    hospital_name: `${name} Hospital`,
    address: i % 2 === 0 ? 'Delhi' : 'Noida',
    contact_no: `98765432${20 + i}`,
    email: `${name.toLowerCase().replace(/ /g, '')}@email.com`
  })));

  // 5. BLOOD_UNITS (8 units per blood group = 64 units)
  const groups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const unitsToCreate = [];
  groups.forEach(group => {
    for (let i = 0; i < 8; i++) {
      unitsToCreate.push({
        blood_group: group,
        collection_date: new Date(),
        expiry_date: addDays(new Date(), 35),
        status: 'Available',
        bank_id: i % 2 === 0 ? banks[0].bank_id : banks[1].bank_id
      });
    }
  });
  await BloodUnit.bulkCreate(unitsToCreate);

  logger.info('Massive database seeding complete');
};

module.exports = seedLogic;
