require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('./models/user');
const sequelize = require('./utils/db-connection'); 

async function seedAdmin() {
  try {
    await sequelize.authenticate();
   
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    const [admin, created] = await User.findOrCreate({
      where: { email: process.env.ADMIN_EMAIL },
      defaults: {
        name: process.env.ADMIN_NAME,
        password: hashedPassword,
        role: 'admin',
        status: 'approved'
      }
    });

    if (created) {
      console.log('Admin created');
    } else {
      console.log('Admin already exists.');
    }

    process.exit();
  } catch (err) {
    console.error('Failed to seed admin:', err);
    process.exit(1);
  }
}

seedAdmin();
