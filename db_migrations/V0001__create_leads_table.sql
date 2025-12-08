-- Таблица для хранения заявок с сайта
CREATE TABLE IF NOT EXISTS t_p27512893_ai_hire_landing.leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    company VARCHAR(255),
    vacancy VARCHAR(255),
    source VARCHAR(50) DEFAULT 'main_form',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'new'
);

-- Индекс для быстрого поиска по статусу и дате
CREATE INDEX idx_leads_status_created ON t_p27512893_ai_hire_landing.leads(status, created_at DESC);

-- Индекс для поиска по телефону
CREATE INDEX idx_leads_phone ON t_p27512893_ai_hire_landing.leads(phone);