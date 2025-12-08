-- Создание таблицы для логов вебхуков
CREATE TABLE IF NOT EXISTS webhook_logs (
  id SERIAL PRIMARY KEY,
  source VARCHAR(50) NOT NULL,
  event_type VARCHAR(100),
  payload JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'received',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP
);

-- Индекс для быстрого поиска по источнику и времени
CREATE INDEX idx_webhook_logs_source_created ON webhook_logs(source, created_at DESC);

-- Индекс для поиска по статусу
CREATE INDEX idx_webhook_logs_status ON webhook_logs(status);