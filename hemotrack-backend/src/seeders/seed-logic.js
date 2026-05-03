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
  // Sync database
  await sequelize.sync({ force: true });

  // 1. BLOOD_BANK
  const banks = await BloodBank.bulkCreate([
    { bank_name: 'City Blood Center', location: 'Delhi', contact_no: '9876543210', email: 'city@blood.com' },
    { bank_name: 'LifeCare Blood Bank', location: 'Noida', contact_no: '9123456780', email: 'lifecare@blood.com' }
  ]);

  // 2. USER_ADMIN
  const passwordHash = await bcrypt.hash('password123', 10);
  const admins = await UserAdmin.bulkCreate([
    { username: 'admin1', password: passwordHash, role: 'Admin' },
    { username: 'staff1', password: passwordHash, role: 'Staff' }
  ]);

  // 3. DONOR
  const donors = await Donor.bulkCreate([
    { name: 'Rahul Sharma', age: 25, gender: 'Male', blood_group: 'A+', phone: '9876543211', email: 'rahul@email.com', address: 'Delhi', last_donation_date: new Date() },
    { name: 'Priya Patel', age: 30, gender: 'Female', blood_group: 'B+', phone: '9876543212', email: 'priya@email.com', address: 'Noida', last_donation_date: new Date() }
  ]);

  // 4. HOSPITAL
  const hospitals = await Hospital.bulkCreate([
    { hospital_name: 'Apollo Hospital', address: 'Delhi', contact_no: '9876543214', email: 'apollo@email.com' },
    { hospital_name: 'Fortis Hospital', address: 'Noida', contact_no: '9876543215', email: 'fortis@email.com' }
  ]);

  // 5. BLOOD_UNIT
  const units = await BloodUnit.bulkCreate([
    { blood_group: 'A+', collection_date: new Date(), expiry_date: addDays(new Date(), 35), status: 'Available', bank_id: banks[0].bank_id },
    { blood_group: 'B+', collection_date: new Date(), expiry_date: addDays(new Date(), 35), status: 'Available', bank_id: banks[1].bank_id }
  ]);

  // 6. DONATION_RECORD
  await DonationRecord.bulkCreate([
    { donor_id: donors[0].donor_id, unit_id: units[0].unit_id, remarks: 'Healthy' }
  ]);

  // 7. BLOOD_REQUEST
  await BloodRequest.bulkCreate([
    { hospital_id: hospitals[0].hospital_id, blood_group: 'A+', quantity: 2, status: 'Pending' }
  ]);

  logger.info('Database seeded successfully via API');
};

module.exports = seedLogic;
