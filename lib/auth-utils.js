import bcrypt from 'bcryptjs'

export async function hashPin(pin) {
    // Hash with salt rounds = 10
    return await bcrypt.hash(pin, 10)
}

export async function verifyPin(pin, hash) {
    return await bcrypt.compare(pin, hash)
}

export function isValidPin(pin) {
    return /^\d{4,6}$/.test(pin)
}

export function isValidUsername(username) {
    return /^[a-zA-Z0-9_]{3,20}$/.test(username)
}
