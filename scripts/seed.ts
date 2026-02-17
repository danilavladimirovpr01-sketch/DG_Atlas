/**
 * Seed script: creates test users and data in Supabase.
 * Run: npx tsx scripts/seed.ts
 */

const SUPABASE_URL = 'https://zerflqzguughbbnphwfw.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplcmZscXpndXVnaGJibnBod2Z3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMwNzIyNywiZXhwIjoyMDg2ODgzMjI3fQ.m7MD1jg3mYI9z8UYMUIFwq1WIGGlIfKVKpQO3sbaNeI';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function createUser(email: string, password: string, fullName: string, role: string, phone?: string) {
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    console.error(`Failed to create user ${email}:`, authError.message);
    return null;
  }

  const userId = authData.user.id;

  // Create profile
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    full_name: fullName,
    role,
    phone: phone || null,
  });

  if (profileError) {
    console.error(`Failed to create profile for ${email}:`, profileError.message);
  }

  console.log(`Created ${role}: ${fullName} (${email}) -> ${userId}`);
  return userId;
}

async function seed() {
  console.log('Seeding DG Atlas...\n');

  // 1. Create admin
  const adminId = await createUser(
    'admin@dgatlas.ru',
    'admin123',
    'Дмитрий Админов',
    'admin'
  );

  // 2. Create managers
  const manager1Id = await createUser(
    'manager1@dgatlas.ru',
    'manager123',
    'Иван Петров',
    'manager'
  );

  const manager2Id = await createUser(
    'manager2@dgatlas.ru',
    'manager123',
    'Анна Сидорова',
    'manager'
  );

  // 3. Create clients
  const client1Id = await createUser(
    'client1@test.ru',
    'client123',
    'Алексей Иванов',
    'client',
    '+79001234567'
  );

  const client2Id = await createUser(
    'client2@test.ru',
    'client123',
    'Мария Козлова',
    'client',
    '+79009876543'
  );

  const client3Id = await createUser(
    'client3@test.ru',
    'client123',
    'Сергей Николаев',
    'client',
    '+79005551234'
  );

  // 4. Create projects
  if (client1Id && manager1Id) {
    const { error } = await supabase.from('projects').insert({
      client_id: client1Id,
      manager_id: manager1Id,
      title: 'ЖК Солнечный',
      current_stage: 7,
      status: 'active',
    });
    if (error) console.error('Project 1 error:', error.message);
    else console.log('Created project: ЖК Солнечный (stage 7)');
  }

  if (client2Id && manager1Id) {
    const { error } = await supabase.from('projects').insert({
      client_id: client2Id,
      manager_id: manager1Id,
      title: 'Коттедж Лесной',
      current_stage: 3,
      status: 'active',
    });
    if (error) console.error('Project 2 error:', error.message);
    else console.log('Created project: Коттедж Лесной (stage 3)');
  }

  if (client3Id && manager2Id) {
    const { error } = await supabase.from('projects').insert({
      client_id: client3Id,
      manager_id: manager2Id,
      title: 'Дом у Озера',
      current_stage: 11,
      status: 'active',
    });
    if (error) console.error('Project 3 error:', error.message);
    else console.log('Created project: Дом у Озера (stage 11)');
  }

  console.log('\n--- Seed complete ---');
  console.log('\nТестовые аккаунты:');
  console.log('  Admin:    admin@dgatlas.ru / admin123');
  console.log('  Manager:  manager1@dgatlas.ru / manager123');
  console.log('  Manager:  manager2@dgatlas.ru / manager123');
  console.log('  Client phones: +79001234567, +79009876543, +79005551234');
}

seed().catch(console.error);
