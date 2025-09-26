const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database.sqlite');

// Open the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log(' Connected to SQLite database');
});

// Function to view all tables
function viewTables() {
  console.log('\n Database Tables:');
  console.log('==================');
  
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
    if (err) {
      console.error('Error fetching tables:', err.message);
      return;
    }
    
    if (rows.length === 0) {
      console.log('No tables found in the database.');
      db.close();
      return;
    }
    
    rows.forEach((row) => {
      console.log(` Table: ${row.name}`);
    });
    
    // View users table if it exists
    viewUsers();
  });
}

// Function to view users
function viewUsers() {
  console.log('\n Users Data:');
  console.log('=============');
  
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err.message);
      if (err.message.includes('no such table')) {
        console.log('ℹ  Users table not created yet. Try registering a user first!');
      }
      db.close();
      return;
    }
    
    if (rows.length === 0) {
      console.log('No users found. Try registering a user first!');
    } else {
      console.table(rows);
    }
    
    db.close();
  });
}

// Function to show table structure
function showTableStructure() {
  console.log('\n Table Structure:');
  console.log('==================');
  
  db.all("PRAGMA table_info(users)", (err, rows) => {
    if (err) {
      console.error('Error fetching table structure:', err.message);
      return;
    }
    
    if (rows.length > 0) {
      console.log('Users table columns:');
      rows.forEach((row) => {
        console.log(`  - ${row.name} (${row.type}) ${row.notnull ? 'NOT NULL' : ''} ${row.pk ? 'PRIMARY KEY' : ''}`);
      });
    }
  });
}

// Start the viewer
console.log(' SQLite Database Viewer');
console.log('========================');
console.log(`Database path: ${dbPath}`);

viewTables();
showTableStructure();