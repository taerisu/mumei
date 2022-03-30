import { config } from '../deps.ts'

const inits = () => {
  if (Deno.env.get('MODE') === 'NOFS') {
    return Deno.env.toObject()
  } else {
    return config()
  }
}

const env = inits()

export default env
