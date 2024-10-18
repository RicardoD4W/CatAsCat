export const prerender = false

import { db } from '@/data/db'
import type { CatImageResponse, CatQuoteResponse } from '@/types/api'

const CAT_API_URL = 'https://api.thecatapi.com/v1/images/search'
const CATFACT_API_URL = 'https://catfact.ninja/fact'
const CAT_API_KEY = import.meta.env.CAT_API_KEY

const getCurrentDateTime = (clientDate: string) => {
  const today = clientDate
  return today.slice(0, 19).replace('T', ' ')
}

export async function getCatImageOfTheDay(clientDate: string) {
  const todayDate = getCurrentDateTime(clientDate).split(' ')[0]
  const todayDateTime = getCurrentDateTime(clientDate)

  try {
    const connection = await db.getConnection()
    const [rows] = await connection.query(
      'SELECT * FROM daily_cat WHERE DATE(date) = ?',
      [todayDate]
    )

    if ((rows as any[]).length > 0) {
      // Si existe una entrada, devolverla
      connection.release()
      // @ts-ignore
      return rows[0]
    } else {
      let firstDate = todayDate && todayDate.split('-').at(-1)
      let aux = new Date().toISOString()
      let secondDate = getCurrentDateTime(aux).split(' ')[0]!.split('-').at(-1)

      if (firstDate! > secondDate!) {
        return {
          status: 307,
          headers: { Location: '/your-cat-daily' },
        }
      }

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
        [todayDateTime, imageUrl, quote]
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
    return new Response('Something went wrong', { status: 500 })
  }
}
