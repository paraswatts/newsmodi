var mongoose = require('mongoose');
var id = mongoose.Types.ObjectId();
var NewsSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.ObjectId, auto: true },
  source: Object,
  author: String,
  title: String,
  description: String,
  url: String,
  urlToImage: String,
  publishedAt: String,
});
mongoose.model('News', NewsSchema);

module.exports = mongoose.model('News');