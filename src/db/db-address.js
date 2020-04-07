const mongoose = require('mongoose')

const url = 'mongodb://127.0.0.1:27017/problem'

mongoose.connect(process.env.MONGODB_URI || url , {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})