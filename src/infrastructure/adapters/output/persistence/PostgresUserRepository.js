import { pool } from '../../../config/database.config.js';
import { User } from '../../../../domain/entities/User.js';

export class PostgresUserRepository {
  _rowToUser(row) {
    if (!row) return null;
    
    return new User({
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      password: row.password,
      role: row.role,
      isActive: row.is_active,
      profilePhotoUrl: row.profile_photo_url,
      gender: row.gender,
      age: row.age,
      favoritePlaces: row.favorite_places || [],
      visitedPlaces: row.visited_places || [],
      preferredTags: row.preferred_tags || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    
    if (result.rows.length === 0) return null;
    
    return this._rowToUser(result.rows[0]);
  }

  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) return null;
    
    return this._rowToUser(result.rows[0]);
  }

  async save(user) {
    const query = `
      INSERT INTO users (
        email, password, first_name, last_name, role, is_active, 
        profile_photo_url, gender, age, favorite_places, visited_places,
        preferred_tags, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
      RETURNING *
    `;
    
    const values = [
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.role,
      user.isActive,
      user.profilePhotoUrl ?? null,
      user.gender ?? null,
      user.age ?? null,
      JSON.stringify(user.favoritePlaces || []),
      JSON.stringify(user.visitedPlaces || []),
      JSON.stringify(user.preferredTags || [])
    ];
    
    const result = await pool.query(query, values);
    
    return this._rowToUser(result.rows[0]);
  }

  async saveRefreshToken(userId, token) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const query = `
      INSERT INTO refresh_tokens (user_id, token, expires_at, created_at)
      VALUES ($1, $2, $3, NOW())
    `;
    await pool.query(query, [userId, token, expiresAt]);
  }

  async deleteRefreshToken(token) {
    const query = 'DELETE FROM refresh_tokens WHERE token = $1';
    await pool.query(query, [token]);
  }

  async findRefreshToken(token) {
    const query = 'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()';
    const result = await pool.query(query, [token]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async findAll() {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);

    return result.rows.map(row => this._rowToUser(row));
  }

  async updateById(id, updates) {
    const allowed = {
      first_name: updates.firstName,
      last_name: updates.lastName,
      role: updates.role,
      is_active: updates.isActive,
      profile_photo_url: updates.profilePhotoUrl,
      gender: updates.gender,
      age: updates.age,
      favorite_places: updates.favoritePlaces !== undefined
        ? JSON.stringify(updates.favoritePlaces) 
        : undefined,
      visited_places: updates.visitedPlaces !== undefined
        ? JSON.stringify(updates.visitedPlaces) 
        : undefined,
      preferred_tags: updates.preferredTags !== undefined
        ? JSON.stringify(updates.preferredTags)
        : undefined
    };

    const entries = Object.entries(allowed).filter(([_, v]) => v !== undefined);
    
    if (entries.length === 0) {
      return await this.findById(id);
    }

    const setClauses = entries.map(([k], i) => `${k} = $${i + 2}`).join(', ');
    const values = [id, ...entries.map(([, v]) => v)];

    const query = `UPDATE users SET ${setClauses}, updated_at = NOW() WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) return null;
    
    return this._rowToUser(result.rows[0]);
  }

  async deleteById(id) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
}
