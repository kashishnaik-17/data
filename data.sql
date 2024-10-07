CREATE TABLE sim_cards (
    sim_number VARCHAR(20) PRIMARY KEY,
    phone_number VARCHAR(15) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'inactive',
    activation_date TIMESTAMP NULL
);
