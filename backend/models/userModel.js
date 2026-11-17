const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const { ObjectId } = mongoose.Schema.Types

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  // Sensitive fields are excluded from query results unless explicitly
  // requested with .select('+field').
  password: {
    type: String,
    required: true,
    select: false
  },
  bio: {
    type: String,
    required: false
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  phoneNumber: {
    type: Number,
    required: false
  },
  imageKey: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
  },
  // SHA-256 hash of the emailed reset token; the raw token is never stored.
  resetToken: { type: String, select: false },
  resetTokenExpiry: { type: Date, select: false },
  followers: [{type: ObjectId, ref: 'User'}],
  following: [{type: ObjectId, ref: 'User'}],

  liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
}, {
  toJSON: {
    // Defense in depth: never serialize secrets even if a query selected them.
    transform: (doc, ret) => {
      delete ret.password
      delete ret.resetToken
      delete ret.resetTokenExpiry
      return ret
    }
  }
})

const isOptionalString = (value) => value === undefined || value === null || typeof value === 'string'

// static signup method
userSchema.statics.signup = async function(username, email, password, firstName, lastName, phoneNumber, bio = "Hello World!") {

  if (!username || !password || !email) {
    throw Error('All fields must be filled')
  }
  if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string'
      || !isOptionalString(firstName) || !isOptionalString(lastName)) {
    throw Error('Invalid input')
  }
  if (username.length > 30) {
    throw Error('Username must be at most 30 characters')
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }

  const emailExists = await this.findOne({ email })

  if (emailExists) {
    throw Error('Email already in use')
  }

  const usernameExists = await this.findOne({ username })

  if (usernameExists) {
    throw Error('Username already in use')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ username, email, password: hash, bio, firstName, lastName, phoneNumber })

  return user
}

// static login method
userSchema.statics.login = async function(username, password) {

  if (!username || !password) {
    throw Error('All fields must be filled')
  }
  if (typeof username !== 'string' || typeof password !== 'string') {
    throw Error('Incorrect username or password')
  }

  // Same message for unknown user and wrong password, so the endpoint does not
  // reveal which usernames exist.
  const user = await this.findOne({ username }).select('+password')
  if (!user) {
    throw Error('Incorrect username or password')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('Incorrect username or password')
  }

  return user
}

module.exports = mongoose.model('User', userSchema)
