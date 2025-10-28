import connectDB from '../config/connect.db.js';
import seedAdmin from './admin.seed.js';

async function runSeeders() {
  try {
    await connectDB();
    await seedAdmin();
    console.log('All seeders ran successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

runSeeders();
