import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import uniqueValidator from 'mongoose-unique-validator'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favourites: [{ type: mongoose.Schema.ObjectId, ref: 'Museum', required: false, unique: false }]
})


// * remove password and email when returning user as json

userSchema.set('toJSON', {
  virtuals: true,
  transform(_doc, json) {
    delete json.password
    delete json.email
    return json
  }
})

// * creating virtual field for password confirmation

userSchema
  .virtual('passwordConfirmation')
  .set(function(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation
  })

// * custom pre validation

userSchema
  .pre('validate', function(next) {
    if (this.isModified('password') && this.password !== this._passwordConfirmation) {
      this.invalidate('passwordConfirmation', 'does not match')
    }
    next()
  })

// * custom pre save

userSchema
  .pre('save', function(next) {
    if (this.isModified('password')) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
    }
    next()
  })

// * defining a custom method that will be avvailable to sue for all instances of the user

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

userSchema.plugin(uniqueValidator)

export default mongoose.model('User', userSchema)