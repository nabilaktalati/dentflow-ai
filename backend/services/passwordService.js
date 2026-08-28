import bcrypt from 'bcrypt'
import crypto from 'crypto'


const SALT_ROUNDS = 12

const TEMP_PASSWORD_LENGTH = 16

const UPPERCASE =
  'ABCDEFGHJKLMNPQRSTUVWXYZ'

const LOWERCASE =
  'abcdefghijkmnopqrstuvwxyz'

const NUMBERS =
  '23456789'

const SYMBOLS =
  '!@#$%&*?'

const ALL_CHARACTERS =
  UPPERCASE +
  LOWERCASE +
  NUMBERS +
  SYMBOLS


const getRandomCharacter = (
  characters,
) => {
  const index =
    crypto.randomInt(
      0,
      characters.length,
    )

  return characters[index]
}


const secureShuffle = (
  characters,
) => {
  const result = [
    ...characters,
  ]

  for (
    let index =
      result.length - 1;
    index > 0;
    index -= 1
  ) {
    const randomIndex =
      crypto.randomInt(
        0,
        index + 1,
      )

    ;[
      result[index],
      result[randomIndex],
    ] = [
      result[randomIndex],
      result[index],
    ]
  }

  return result.join('')
}


export const generateTemporaryPassword =
  () => {
    const characters = [
      getRandomCharacter(
        UPPERCASE,
      ),
      getRandomCharacter(
        LOWERCASE,
      ),
      getRandomCharacter(
        NUMBERS,
      ),
      getRandomCharacter(
        SYMBOLS,
      ),
    ]

    while (
      characters.length <
      TEMP_PASSWORD_LENGTH
    ) {
      characters.push(
        getRandomCharacter(
          ALL_CHARACTERS,
        ),
      )
    }

    return secureShuffle(
      characters,
    )
  }


export const hashPassword = async (
  password,
) => {
  return bcrypt.hash(
    password,
    SALT_ROUNDS,
  )
}


export const comparePassword = async (
  password,
  passwordHash,
) => {
  return bcrypt.compare(
    password,
    passwordHash,
  )
}