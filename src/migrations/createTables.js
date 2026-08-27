export const usersTable = `
CREATE TABLE IF NOT EXISTS users(
id SERIAL PRIMARY KEY,
first_name VARCHAR(100) NOT NULL,
last_name VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL,
password VARCHAR(255) NOT NULL,
gender VARCHAR(10),
role VARCHAR(100) DEFAULT 'customer' CHECK (role IN ('customer', 'vendor', 'admin')),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;