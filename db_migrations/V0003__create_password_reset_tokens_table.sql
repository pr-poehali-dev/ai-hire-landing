CREATE TABLE IF NOT EXISTS t_p27512893_ai_hire_landing.password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_password_reset_token ON t_p27512893_ai_hire_landing.password_reset_tokens(token);
CREATE INDEX idx_password_reset_user_id ON t_p27512893_ai_hire_landing.password_reset_tokens(user_id);
