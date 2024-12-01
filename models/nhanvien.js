let db = require("mongoose");

db.connect("mongodb://localhost:27017/csdlnv");

let nhanvienSchema = db.Schema({
  ten: String,
  tuoi: Number,
  hinh: String,
});

let nhanvien = db.model("nhanvien", nhanvienSchema);
module.exports = nhanvien;
