const mongoose = require('mongoose');

async function testConnection(uri) {
  try {
    await mongoose.connect(uri);
    console.log(`Connected with ${uri}`);
    process.exit(0);
  } catch (error) {
    console.log(`Failed with ${uri}:`, error.message);
  }
}

async function runTests() {
  const usernames = ['zaidmalik', 'zaidmalik904', 'ZaidMalik', 'ZaidMalik904', 'educationpurpose904', 'education.purpose904', 'admin', 'upvc'];
  for (const user of usernames) {
    const uri = `mongodb+srv://${user}:wObkqoLl2tugdVHl@upvc-project.7ixtc5d.mongodb.net/test?appName=upvc-project`;
    console.log(`Trying ${user}...`);
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
        console.log(`SUCCESS! Username is ${user}`);
        process.exit(0);
    } catch(e) {
        console.log(`Failed for ${user}`);
    }
  }
  process.exit(1);
}

runTests();
