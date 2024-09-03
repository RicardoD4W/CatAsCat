export const prerender = false

import { db } from '@/data/db'
import type { CatImageResponse, CatQuoteResponse } from '@/types/api'

const CAT_API_URL = 'https://api.thecatapi.com/v1/images/search'
const CATFACT_API_URL = 'https://catfact.ninja/fact'
const CAT_API_KEY = import.meta.env.CAT_API_KEY

const getCurrentDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

export async function getCatImageOfTheDay() {
  const today = getCurrentDate()

  try {
    const connection = await db.getConnection()
    const [rows] = await connection.query(
      'SELECT * FROM daily_cat WHERE date = ?',
      [today]
    )

    if ((rows as any[]).length > 0) {
      // Si existe una entrada, devolverla
      connection.release()
      // @ts-ignore
      return rows[0]
    } else {
      // Si no existe, crear una nueva entrada
      const response = await fetch(`${CAT_API_URL}?limit=1`, {
        headers: {
          'x-api-key': CAT_API_KEY,
        },
      })
      const response2 = await fetch(`${CATFACT_API_URL}?max_length=120`)
      if (!response.ok || !response2.ok) {
        throw new Error('Error al obtener la foto o la frase del gato')
      }

      const dataImg: CatImageResponse[] =
        (await response.json()) as CatImageResponse[]
      const dataQuote = (await response2.json()) as CatQuoteResponse

      const imageUrl = dataImg[0]!.url
      const quote = dataQuote.fact

      const [result] = await connection.query(
        'INSERT INTO daily_cat (date, url, quote) VALUES (?, ?, ?)',
        [today, imageUrl, quote]
      )

      const [newRow] = await connection.query(
        'SELECT * FROM daily_cat WHERE id = ?',
        // @ts-ignore
        [result.insertId]
      )
      connection.release()
      // @ts-ignore
      return newRow[0]
    }
  } catch (error) {
    return new Response('Somethins wrong', { status: 500 })
  }
}

export async function GET() {
  try {
    const data = await getCatImageOfTheDay()
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
