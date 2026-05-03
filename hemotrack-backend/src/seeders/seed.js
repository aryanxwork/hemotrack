const bcrypt = require('bcryptjs');
const {
  sequelize,
  BloodBank,
  UserAdmin,
  Donor,
  Hospital,
  BloodUnit,
  DonationRecord,
  BloodRequest,
  IssueRecord,
  AuditLog
} = require('../models');
const { addDays } = require('../utils/dateHelpers');
const logger = require('../utils/logger');

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Reset DB for seeding

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
      { name: 'Priya Patel', age: 30, gender: 'Female', blood_group: 'B+', phone: '9876543212', email: 'priya@email.com', address: 'Noida', last_donation_date: new Date() },
      { name: 'Amit Singh', age: 40, gender: 'Male', blood_group: 'O-', phone: '9876543213', email: 'amit@email.com', address: 'Gurgaon', last_donation_date: new Date() }
    ]);

    // 4. HOSPITAL
    const hospitals = await Hospital.bulkCreate([
      { hospital_name: 'Apollo Hospital', address: 'Delhi', contact_no: '9876543214', email: 'apollo@email.com' },
      { hospital_name: 'Fortis Hospital', address: 'Noida', contact_no: '9876543215', email: 'fortis@email.com' }
    ]);

    // 5. BLOOD_UNIT
    const units = await BloodUnit.bulkCreate([
      { blood_group: 'A+', collection_date: new Date(), expiry_date: addDays(new Date(), 35), status: 'Available', bank_id: banks[0].bank_id },
      { blood_group: 'B+', collection_date: new Date(), expiry_date: addDays(new Date(), 35), status: 'Available', bank_id: banks[1].bank_id },
      { blood_group: 'O-', collection_date: new Date(), expiry_date: addDays(new Date(), -1), status: 'Expired', bank_id: banks[0].bank_id } // Intentionally expired
    ]);

    // 6. DONATION_RECORD
    await DonationRecord.bulkCreate([
      { donor_id: donors[0].donor_id, unit_id: units[0].unit_id, remarks: 'Healthy' },
      { donor_id: donors[1].donor_id, unit_id: units[1].unit_id, remarks: 'Healthy' }
    ]);

    // 7. BLOOD_REQUEST
    await BloodRequest.bulkCreate([
      { hospital_id: hospitals[0].hospital_id, blood_group: 'A+', quantity: 2, status: 'Pending' },
      { hospital_id: hospitals[1].hospital_id, blood_group: 'O-', quantity: 1, status: 'Approved' }
    ]);

    // 8. ISSUE_RECORD & 9. AUDIT_LOG
    const issue = await IssueRecord.create({
      unit_id: units[1].unit_id,
      hospital_id: hospitals[0].hospital_id,
      handled_by: admins[0].admin_id
    });
    
    // Update unit status to Issued
    await BloodUnit.update({ status: 'Issued' }, { where: { unit_id: units[1].unit_id }});

    await AuditLog.create({
      admin_id: admins[0].admin_id,
      action: 'ISSUE_BLOOD',
      table_name: 'ISSUE_RECORD',
      record_id: issue.issue_id
    });

    logger.info('Seeding complete');
    process.exit(0);
  } catch (error) {
    logger.error('Error during seeding:', error);
    process.exit(1);
  }
};

seed();
