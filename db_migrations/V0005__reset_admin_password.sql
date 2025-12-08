-- Обновляем пароль и права для ipzlenko@gmail.com
UPDATE t_p27512893_ai_hire_landing.users 
SET 
  password_hash = '9cfd4e67f0bdaa4c21cef0d2c0b9cfbfbb74c42ef13da87f8def9f2a6a3e5f82',
  role = 'admin',
  can_generate_invites = true
WHERE email = 'ipzlenko@gmail.com';