const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {type: String, require: true},
    password: {type: String, require: true},
    rolUser: [{type: mongoose.Types.ObjectId, ref: 'Rol', required: true}]
});

userSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password,this.password);
}

userSchema.pre('save', async function(){
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
    }
});

const User = mongoose.model('User',userSchema);

module.exports = User;