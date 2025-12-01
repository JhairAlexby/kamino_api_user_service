import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const { Client } = pg;

// Datos de los 15 usuarios con sus preferencias
const TEST_USERS = [
  {
    email: 'carlos.rodriguez@test.com',
    password: 'test123',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    age: 25,
    gender: 'MALE',
    preferredTags: ['Arte', 'Cultura', 'Historia'],
    favoritePlaces: ['0a045b82-4614-462b-bc53-19f74a3005c6', '65f2abfb-d814-4c29-9ac2-5fca0d5a0971'],
    visitedPlaces: ['0a045b82-4614-462b-bc53-19f74a3005c6', '65f2abfb-d814-4c29-9ac2-5fca0d5a0971', 'd35822e3-d343-448f-b1e8-3764a9a7517e']
  },
  {
    email: 'maria.gonzalez@test.com',
    password: 'test123',
    firstName: 'María',
    lastName: 'González',
    age: 30,
    gender: 'FEMALE',
    preferredTags: ['Gastronomía', 'Música', 'Tradicional'],
    favoritePlaces: ['8b23090f-1bd5-44b1-b6d7-838a5dd0324d', 'b6b975d5-4adb-4fcd-99c7-51b9883123a5', '234fd02d-baf8-4aa1-8e75-197ce161983e'],
    visitedPlaces: ['8b23090f-1bd5-44b1-b6d7-838a5dd0324d', 'b6b975d5-4adb-4fcd-99c7-51b9883123a5', '234fd02d-baf8-4aa1-8e75-197ce161983e', 'f5865bde-0ec3-49c7-9222-ffbb83939cea']
  },
  {
    email: 'luis.martinez@test.com',
    password: 'test123',
    firstName: 'Luis',
    lastName: 'Martínez',
    age: 28,
    gender: 'MALE',
    preferredTags: ['Naturaleza', 'Aventura', 'Familia'],
    favoritePlaces: ['7a7031f9-99bc-4405-8ff8-c8d17a4496e5', '37e886e3-1c0a-4b35-a4e4-7e95603ee629'],
    visitedPlaces: ['7a7031f9-99bc-4405-8ff8-c8d17a4496e5', '37e886e3-1c0a-4b35-a4e4-7e95603ee629', '242dcb4d-22f6-4d92-bc80-e9e598e07544', 'e916df67-77cf-4e2d-8662-c5c28e276082', '0dae51f8-fab9-4c5c-b1c7-e376a38a4bf6']
  },
  {
    email: 'ana.lopez@test.com',
    password: 'test123',
    firstName: 'Ana',
    lastName: 'López',
    age: 22,
    gender: 'FEMALE',
    preferredTags: ['Arte', 'Música', 'Cultura'],
    favoritePlaces: ['f5865bde-0ec3-49c7-9222-ffbb83939cea', '0a045b82-4614-462b-bc53-19f74a3005c6'],
    visitedPlaces: ['f5865bde-0ec3-49c7-9222-ffbb83939cea', '0dae51f8-fab9-4c5c-b1c7-e376a38a4bf6']
  },
  {
    email: 'jorge.perez@test.com',
    password: 'test123',
    firstName: 'Jorge',
    lastName: 'Pérez',
    age: 35,
    gender: 'MALE',
    preferredTags: ['Historia', 'Educativo', 'Ciencia'],
    favoritePlaces: ['763e598a-2108-4212-a0d5-095efc81fcc6', '91ae10c0-432b-445c-8760-75544188bd1e', '65f2abfb-d814-4c29-9ac2-5fca0d5a0971'],
    visitedPlaces: ['763e598a-2108-4212-a0d5-095efc81fcc6', '91ae10c0-432b-445c-8760-75544188bd1e', '65f2abfb-d814-4c29-9ac2-5fca0d5a0971', 'd35822e3-d343-448f-b1e8-3764a9a7517e']
  },
  {
    email: 'sofia.ramirez@test.com',
    password: 'test123',
    firstName: 'Sofía',
    lastName: 'Ramírez',
    age: 27,
    gender: 'FEMALE',
    preferredTags: ['Gastronomía', 'Familia', 'Tradicional'],
    favoritePlaces: ['234fd02d-baf8-4aa1-8e75-197ce161983e', '8b23090f-1bd5-44b1-b6d7-838a5dd0324d'],
    visitedPlaces: ['234fd02d-baf8-4aa1-8e75-197ce161983e', '8b23090f-1bd5-44b1-b6d7-838a5dd0324d', 'b6b975d5-4adb-4fcd-99c7-51b9883123a5']
  },
  {
    email: 'diego.torres@test.com',
    password: 'test123',
    firstName: 'Diego',
    lastName: 'Torres',
    age: 31,
    gender: 'MALE',
    preferredTags: ['Tecnología', 'Ciencia', 'Educativo'],
    favoritePlaces: ['91ae10c0-432b-445c-8760-75544188bd1e', '763e598a-2108-4212-a0d5-095efc81fcc6'],
    visitedPlaces: ['91ae10c0-432b-445c-8760-75544188bd1e', '763e598a-2108-4212-a0d5-095efc81fcc6']
  },
  {
    email: 'laura.hernandez@test.com',
    password: 'test123',
    firstName: 'Laura',
    lastName: 'Hernández',
    age: 24,
    gender: 'FEMALE',
    preferredTags: ['Música', 'Arte', 'Aventura'],
    favoritePlaces: ['f5865bde-0ec3-49c7-9222-ffbb83939cea', '0dae51f8-fab9-4c5c-b1c7-e376a38a4bf6', '7a7031f9-99bc-4405-8ff8-c8d17a4496e5'],
    visitedPlaces: ['f5865bde-0ec3-49c7-9222-ffbb83939cea', '0dae51f8-fab9-4c5c-b1c7-e376a38a4bf6', '7a7031f9-99bc-4405-8ff8-c8d17a4496e5', '37e886e3-1c0a-4b35-a4e4-7e95603ee629']
  },
  {
    email: 'roberto.garcia@test.com',
    password: 'test123',
    firstName: 'Roberto',
    lastName: 'García',
    age: 29,
    gender: 'MALE',
    preferredTags: ['Naturaleza', 'Aventura', 'Familia'],
    favoritePlaces: ['e916df67-77cf-4e2d-8662-c5c28e276082', '242dcb4d-22f6-4d92-bc80-e9e598e07544'],
    visitedPlaces: ['e916df67-77cf-4e2d-8662-c5c28e276082', '242dcb4d-22f6-4d92-bc80-e9e598e07544', '7a7031f9-99bc-4405-8ff8-c8d17a4496e5', '37e886e3-1c0a-4b35-a4e4-7e95603ee629', '0dae51f8-fab9-4c5c-b1c7-e376a38a4bf6']
  },
  {
    email: 'patricia.vargas@test.com',
    password: 'test123',
    firstName: 'Patricia',
    lastName: 'Vargas',
    age: 26,
    gender: 'FEMALE',
    preferredTags: ['Cultura', 'Historia', 'Arte'],
    favoritePlaces: ['0a045b82-4614-462b-bc53-19f74a3005c6', 'd35822e3-d343-448f-b1e8-3764a9a7517e', '65f2abfb-d814-4c29-9ac2-5fca0d5a0971'],
    visitedPlaces: ['0a045b82-4614-462b-bc53-19f74a3005c6', 'd35822e3-d343-448f-b1e8-3764a9a7517e']
  },
  {
    email: 'fernando.castro@test.com',
    password: 'test123',
    firstName: 'Fernando',
    lastName: 'Castro',
    age: 33,
    gender: 'MALE',
    preferredTags: ['Gastronomía', 'Música', 'Tradicional'],
    favoritePlaces: ['b6b975d5-4adb-4fcd-99c7-51b9883123a5', '234fd02d-baf8-4aa1-8e75-197ce161983e'],
    visitedPlaces: ['b6b975d5-4adb-4fcd-99c7-51b9883123a5', '234fd02d-baf8-4aa1-8e75-197ce161983e', '8b23090f-1bd5-44b1-b6d7-838a5dd0324d']
  },
  {
    email: 'elena.morales@test.com',
    password: 'test123',
    firstName: 'Elena',
    lastName: 'Morales',
    age: 23,
    gender: 'FEMALE',
    preferredTags: ['Familia', 'Naturaleza', 'Aventura'],
    favoritePlaces: ['0dae51f8-fab9-4c5c-b1c7-e376a38a4bf6', '7a7031f9-99bc-4405-8ff8-c8d17a4496e5'],
    visitedPlaces: ['0dae51f8-fab9-4c5c-b1c7-e376a38a4bf6', '7a7031f9-99bc-4405-8ff8-c8d17a4496e5', '37e886e3-1c0a-4b35-a4e4-7e95603ee629', 'e916df67-77cf-4e2d-8662-c5c28e276082']
  },
  {
    email: 'miguel.ortiz@test.com',
    password: 'test123',
    firstName: 'Miguel',
    lastName: 'Ortiz',
    age: 32,
    gender: 'MALE',
    preferredTags: ['Ciencia', 'Tecnología', 'Educativo'],
    favoritePlaces: ['763e598a-2108-4212-a0d5-095efc81fcc6', '91ae10c0-432b-445c-8760-75544188bd1e', '65f2abfb-d814-4c29-9ac2-5fca0d5a0971'],
    visitedPlaces: ['763e598a-2108-4212-a0d5-095efc81fcc6', '91ae10c0-432b-445c-8760-75544188bd1e']
  },
  {
    email: 'carmen.jimenez@test.com',
    password: 'test123',
    firstName: 'Carmen',
    lastName: 'Jiménez',
    age: 28,
    gender: 'FEMALE',
    preferredTags: ['Arte', 'Cultura', 'Música'],
    favoritePlaces: ['f5865bde-0ec3-49c7-9222-ffbb83939cea', '0a045b82-4614-462b-bc53-19f74a3005c6'],
    visitedPlaces: ['f5865bde-0ec3-49c7-9222-ffbb83939cea', '0a045b82-4614-462b-bc53-19f74a3005c6', '0dae51f8-fab9-4c5c-b1c7-e376a38a4bf6', 'd35822e3-d343-448f-b1e8-3764a9a7517e', '65f2abfb-d814-4c29-9ac2-5fca0d5a0971']
  },
  {
    email: 'ricardo.flores@test.com',
    password: 'test123',
    firstName: 'Ricardo',
    lastName: 'Flores',
    age: 30,
    gender: 'MALE',
    preferredTags: ['Historia', 'Tradicional', 'Cultura'],
    favoritePlaces: ['d35822e3-d343-448f-b1e8-3764a9a7517e', '0a045b82-4614-462b-bc53-19f74a3005c6', '65f2abfb-d814-4c29-9ac2-5fca0d5a0971'],
    visitedPlaces: ['d35822e3-d343-448f-b1e8-3764a9a7517e', '0a045b82-4614-462b-bc53-19f74a3005c6', '65f2abfb-d814-4c29-9ac2-5fca0d5a0971']
  }
];

async function seedTestUsers() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'kamino_user_service',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    ssl: false
  });

  try {
    await client.connect();
    console.log('🔄 Conectado a la base de datos');
    console.log('');

    // Verificar si ya existen usuarios de prueba
    const checkQuery = `SELECT COUNT(*) as count FROM users WHERE email LIKE '%@test.com'`;
    const checkResult = await client.query(checkQuery);
    
    if (parseInt(checkResult.rows[0].count) > 0) {
      console.log('⚠️  Ya existen usuarios de prueba.');
      console.log('💡 Eliminando usuarios anteriores...');
      await client.query(`DELETE FROM users WHERE email LIKE '%@test.com'`);
      console.log('✅ Usuarios anteriores eliminados');
      console.log('');
    }

    console.log('📝 Insertando 15 usuarios de prueba con favoritos y visitados...');
    console.log('');

    let insertedCount = 0;

    for (const user of TEST_USERS) {
      // Hash de contraseña
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const query = `
        INSERT INTO users (
          email, password, first_name, last_name, role, is_active,
          gender, age, favorite_places, visited_places, preferred_tags,
          created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
        RETURNING id, email, first_name
      `;

      const values = [
        user.email,
        hashedPassword,
        user.firstName,
        user.lastName,
        'USER',
        true,
        user.gender,
        user.age,
        JSON.stringify(user.favoritePlaces),
        JSON.stringify(user.visitedPlaces),
        JSON.stringify(user.preferredTags)
      ];

      const result = await client.query(query, values);
      insertedCount++;
      
      console.log(`✅ ${insertedCount}/15 - ${result.rows[0].first_name} (${result.rows[0].email})`);
      console.log(`   Tags: ${user.preferredTags.join(', ')}`);
      console.log(`   Favoritos: ${user.favoritePlaces.length}`);
      console.log(`   Visitados: ${user.visitedPlaces.length}`);
      console.log('');
    }

    console.log('');
    console.log('✅ ¡Seed completado exitosamente!');
    console.log('');
    console.log('📊 Resumen:');
    console.log(`   Total usuarios: ${insertedCount}`);
    console.log(`   Contraseña para todos: test123`);
    console.log('');
    console.log('🧪 Prueba con:');
    console.log('   curl http://localhost:3000/api/users/ml-data');
    
  } catch (error) {
    console.error('');
    console.error('❌ Error en seed:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  } finally {
    await client.end();
    process.exit(0);
  }
}

seedTestUsers();
