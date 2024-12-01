let db = require("mongoose");
let bcrypt = require("bcrypt");

db.connect("mongodb://localhost:27017/csdlnv");

let nguoidungSchema = db.Schema({
    taikhoan: String,
    matkhau: String,
},{versionKey: false});

//mã khóa mật khẩu
nguoidungSchema.pre('save', function (next) {
    let user = this
    bcrypt.hash(user.matkhau,10, (err,encryted) => {
        user.matkhau = encryted;
        next();
    })
})

let nguoidung = db.model("nguoidung", nguoidungSchema);
module.exports = nguoidung;
