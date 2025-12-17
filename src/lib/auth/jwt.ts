import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

if (!secret) {
  throw new Error('Missing JWT_SECRET environment variable')
}

export type TokenPayload = {
  id: string
  email: string
  role: 'admin' | 'student'
}

export function signToken(payload: TokenPayload, expiresIn = '7d') {
  return jwt.sign(payload, secret, { expiresIn })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, secret) as TokenPayload
  } catch (e) {
    return null
  }
}
