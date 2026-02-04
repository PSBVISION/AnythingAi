// MongoDB initialization script
// Creates the application database and user

db = db.getSiblingDB('anything-ai');

db.createUser({
    user: 'appuser',
    pwd: 'apppassword123',
    roles: [
        {
            role: 'readWrite',
            db: 'anything-ai'
        }
    ]
});

// Create initial collections
db.createCollection('users');

print('Database initialized successfully!');
