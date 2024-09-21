export const prerender = false
import { db } from '@/data/db'

export async function getAllDailiesCats() {
  const connection = await db.getConnection()
  try {
    const [rows] = await connection.query('SELECT * FROM daily_cat')
    return rows
  } catch (error) {
    console.log('getAllDailiesCats: ', error)
    return 'Something went wrong'
  } finally {
    connection.release()
  }
}

export async function getOneDailyCatById(id: number) {
  const connection = await db.getConnection()
  try {
    const [rows] = await connection.query(
      'SELECT * FROM daily_cat WHERE id = ?',
      [id]
    )
    // @ts-ignore
    return rows[0]
  } catch (error) {
    console.log('getOneDailyCatById: ', error)
    return 'Something went wrong'
  } finally {
    connection.release()
  }
}

export async function getLastCatId() {
  const connection = await db.getConnection()
  try {
    const [rows] = await connection.query(
      'SELECT id FROM daily_cat ORDER BY id DESC LIMIT 1'
    )
    // @ts-ignore
    return rows[0]?.id
  } catch (error) {
    console.log('getLastCatId: ', error)
    return 'Something went wrong'
  } finally {
    connection.release()
  }
}
