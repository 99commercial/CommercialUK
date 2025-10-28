import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export default async function seedAdmin() {
  const adminEmail = "shardul9577@gmail.com";
  const adminPassword = "Shardul@9577";

  const existingAdmin = await User.findOne({
    email: adminEmail,
    role: 'admin',
  });
  if (existingAdmin) {
    console.log('Admin user already exists. Skipping.');
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  await User.create({
    role: 'admin',
    firstName: 'Shardul',
    lastName: 'Chaudhary',
    email: adminEmail,
    phone: '1234567890',
    password: hashedPassword,
    is_active: true,
  });
  console.log('Admin user seeded!');
}
