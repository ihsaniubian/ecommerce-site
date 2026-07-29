// Run once with: node scripts/create-admin.js
// Reads ADMIN_EMAIL / ADMIN_PASSWORD from .env.local and creates (or promotes) that user to admin.

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function main() {
  const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD must be set in .env.local");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);

  const UserSchema = new mongoose.Schema({}, { strict: false });
  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  let user = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

  if (user) {
    user.role = "admin";
    await user.save();
    console.log(`Existing user ${ADMIN_EMAIL} promoted to admin.`);
  } else {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    user = await User.create({
      name: "Admin",
      email: ADMIN_EMAIL.toLowerCase(),
      password: hashedPassword,
      role: "admin",
      addresses: [],
      wishlist: [],
    });
    console.log(`Admin account created: ${ADMIN_EMAIL}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
