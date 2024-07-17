
require('dotenv').config()

const PORT = 3001;
const MONGO_URI = "mongodb+srv://mikko2981:170102@mycluster.r7bwpkk.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster";
  
module.exports = {
    MONGO_URI,
    PORT
}