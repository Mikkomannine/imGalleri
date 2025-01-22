const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
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
  password: {
    type: String,
    required: true
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
  followers: [{type: ObjectId, ref: 'User'}],
  following: [{type: ObjectId, ref: 'User'}],

  liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
})

// static signup method
userSchema.statics.signup = async function(username, email, password, firstName, lastName, phoneNumber, imageUrl) {

  // validation
  if (!username || !password) {
    throw Error('All fields must be filled')
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

  const user = await this.create({ username, email, password: hash, firstName, lastName, phoneNumber, imageUrl })

  return user
}

// static login method
userSchema.statics.login = async function(username, password) {

  if (!username || !password) {
    throw Error('All fields must be filled')
  }

  const user = await this.findOne({ username })
  if (!user) {
    throw Error('Incorrect username')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('Incorrect password')
  }

  return user
}

module.exports = mongoose.model('User', userSchema)




module.exports = mongoose.model('User', userSchema)
