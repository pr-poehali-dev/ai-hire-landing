CREATE TABLE lead_stages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(50),
    position INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lead_data (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    company VARCHAR(255),
    vacancy VARCHAR(255),
    source VARCHAR(100) NOT NULL,
    stage_id INTEGER DEFAULT 1,
    priority VARCHAR(50) DEFAULT 'medium',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lead_tasks (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(50) DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lead_comments (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL,
    author_name VARCHAR(255),
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lead_calls (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    direction VARCHAR(20) NOT NULL,
    duration INTEGER DEFAULT 0,
    recording_url TEXT,
    status VARCHAR(50) DEFAULT 'completed',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO lead_stages (name, color, position) VALUES
('Новый лид', '#10b981', 1),
('Квалификация', '#3b82f6', 2),
('Презентация', '#f59e0b', 3),
('Согласование', '#8b5cf6', 4),
('Закрыто', '#22c55e', 5),
('Отказ', '#ef4444', 6);