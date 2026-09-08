export const usersTable = `
CREATE TABLE IF NOT EXISTS users(
id SERIAL PRIMARY KEY,
first_name VARCHAR(100) NOT NULL,
last_name VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL,
password VARCHAR(255) NOT NULL,
gender VARCHAR(10),
role VARCHAR(100) DEFAULT 'customer' CHECK (role IN ('customer', 'vendor', 'admin')),
is_verified   BOOLEAN DEFAULT false,
otp_code   VARCHAR(10),
otp_expires  TIMESTAMP,
reset_otp VARCHAR(10),
reset_otp_expires   TIMESTAMP,
refresh_token   TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

export const alterUsersTable = `
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_code   VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expires  TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_otp VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_otp_expires   TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS refresh_token   TEXT;
`;
