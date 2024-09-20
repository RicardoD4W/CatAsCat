export const prerender = false
import { db } from '@/data/db'

const connection = await db.getConnection()

export async function getAllDailiesCats() {
  try {
    const [rows] = await connection.query('SELECT * FROM daily_cat')

    return rows
  } catch (error) {
    return 'Something went wrong'
  }
}

export async function getOneDailyCatById(id: number) {
  try {
    const [rows] = await connection.query(
      'SELECT * FROM daily_cat WHERE id = ?',
      [id]
    )

    // @ts-ignore
    return rows[0]
  } catch (error) {
    return 'Something went wrong'
  }
}

export async function getLastCatId() {
  try {
    const [rows] = await connection.query(
      'SELECT id FROM daily_cat ORDER BY id DESC LIMIT 1'
    )

    // @ts-ignore
    return rows[0].id
  } catch (error) {
    return 'Something went wrong'
  }
}
