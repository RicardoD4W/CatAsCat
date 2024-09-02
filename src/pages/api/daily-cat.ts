import { promises as fs } from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const CACHE_FILE_PATH = path.join(process.cwd(), '/public/cat-image-cache.json')
const CAT_API_URL = 'https://api.thecatapi.com/v1/images/search'
const CATFACT_API_URL = 'https://catfact.ninja/fact'
const CAT_API_KEY = import.meta.env.CAT_API_KEY

interface CatImageResponse {
  id: string
  url: string
  width: number
  height: number
}

interface CatQuoteResponse {
  fact: string
  lenght: number
}

export async function getCatImageOfTheDay(): Promise<{
  date?: string | undefined
  url?: string | undefined
  quote?: string | undefined
}> {
  try {
    let cacheData: {
      date?: string | undefined
      url?: string | undefined
      quote?: string | undefined
    } = {}
    if (await fs.stat(CACHE_FILE_PATH).catch(() => false)) {
      cacheData = JSON.parse(await fs.readFile(CACHE_FILE_PATH, 'utf8'))
    }

    const today = new Date().toISOString().split('T')[0]
    if (cacheData.date === today) {
      return { url: cacheData.url!, quote: cacheData.quote! }
    }

    const response = await fetch(`${CAT_API_URL}?limit=1`, {
      headers: {
        'x-api-key': CAT_API_KEY,
      },
    })
    const response2 = await fetch(`${CATFACT_API_URL}?max_length=120`, {})
    if (!response.ok || !response2.ok) {
      throw new Error('Error al obtener la foto o la frase del gato')
    }

    const dataImg: CatImageResponse[] =
      (await response.json()) as CatImageResponse[]
    const dataQuote = (await response2.json()) as CatQuoteResponse

    const imageUrl = dataImg[0]!.url
    const quote = dataQuote.fact

    cacheData = {
      date: today,
      url: imageUrl,
      quote,
    }
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(cacheData, null, 2))

    return cacheData
  } catch (error) {
    console.error(error)
    throw new Error('No se pudo obtener la imagen del gato del día')
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
