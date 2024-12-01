var express = require("express");
var router = express.Router();

let nhanvien = require("../models/nhanvien.js");
let nguoidung= require("../models/nguoidung.js");
let bcrypt = require("bcrypt");
//====================ĐĂNG KÝ===========================================
router.get("/dangky", function (req, res, next) {
  res.render("dangky.ejs");
});
router.post("/dangky", function (req, res, next) {
  var user = new nguoidung({
    taikhoan: req.body.txtUsername,
    matkhau: req.body.txtPassword,
    // email: req.body.txtEmail,
  })
  user.save()
  .then((kq) => {
    res.redirect('/dangnhap')
  })
  .catch((err) =>console.log("dang ky that bai", err))
});
//====================ĐĂNG NHẬP===========================================
router.get("/*", function (req, res, next) {
  res.locals.userId = req.session.userId;
  next();
});
router.get("/dangnhap", function (req, res, next) {
  res.render("dangnhap.ejs");
});
router.post("/dangnhap", function (req, res, next) {
 nguoidung
    .findOne({taikhoan: req.body.txtUsername})
    .then((nguoidung) => {
      bcrypt.compare(req.body.txtPassword, nguoidung.matkhau, (err,same) => {
        if(same){
          req.session.userId = nguoidung._id;
          res.redirect('/')
        }else res.redirect("/dangnhap")
      })
    })
    .catch((err) =>console.log("dang nhap that bai", err))
  })
//====================ĐĂNG XUẤT===========================================
router.get("/dangxuat", function (req, res, next) {
 req.session.userId = undefined;
 res.redirect("/");
});
//=====================THÊM NHÂN VIÊN===========================================
router.get("/them", function (req, res, next) {
  res.render("themnv.ejs");
});

router.post("/them", function (req, res, next) {
  var sampleFile, uploadPath
  if(!req.files || Object.keys(req.files).length == 0 ){
    var nv = new nhanvien({ten: req.body.txtTen, tuoi: req.body.txtTuoi})
    nv.save() 
    .then (kq => res.redirect('/'))
    .catch(err => console.log('thất bại',err))
  }else {
    
      sampleFile = req.files.txtHinh
      uploadPath = 'public/img/' + sampleFile.name

      sampleFile.mv(uploadPath,function(err) {
        if(err) 
          return res.status(500).send(err)
    
        var nv = new nhanvien({
          ten: req.body.txtTen,
          tuoi: req.body.txtTuoi,
          hinh: sampleFile.name,
        });
      nv.save()
        .then((kq) => res.redirect("/"))
        .catch((err) =>console.log("them that bai", err))
      })
  }
});
//=======================SỬA NHÂN VIÊN=========================================
router.get("/sua/:maso", function (req, res, next) {
  nhanvien
    .findOne({ _id: req.params.maso })
    .then((nv) => res.render("suanv.ejs", { nv }))
    .catch((err) => res.send("ko sửa được"));
});

router.post("/sua", function (req, res, next) { 
      nhanvien
      .findOne({ _id: req.body.txtId})
      .then((nv) => {
        if(!req.files || Object.keys(req.files).length == 0 ){
          nv.ten = req.body.txtTen;
          nv.tuoi = req.body.txtTuoi;
          nv.save()
          .then((kq) => res.redirect("/"))
          .catch((err) => console.log("sua that bai", err));
        }else{
          var sampleFile = req.files.txtHinh
          var uploadPath = 'public/img/' + sampleFile.name
          sampleFile.mv(uploadPath,function(err) {
            if(err) 
              return res.status(500).send(err)
            nv.ten = req.body.txtTen;
            nv.tuoi = req.body.txtTuoi;
            nv.hinh= sampleFile.name;
            nv.save()
              .then((kq) => res.redirect("/"))
              .catch((err) => console.log("sua that bai", err));
          });
      }
    })
    .catch((err) => res.send("ko tìm thấy"));
});

//=======================XÓA NHÂN VIÊN=========================================
router.get("/xoa/:maso", function (req, res, next) {
  nhanvien
    .deleteOne({ _id: req.params.maso })
    .then((kq) => res.redirect("/"))
    .catch((err) => res.send("ko xóa được"));
});

//=======================FUNCTION HIỆN THỊ=========================================
let dieukien = {}

function HienThi(req, res) {
    let tranghientai = req.params.page || 1;
    let soluong = 3;
    let tongsonhanvien;

    nhanvien.find(dieukien)
        .countDocuments()
        .then(count => {
            tongsonhanvien = count;
            const trangcuoicung = Math.ceil(tongsonhanvien / soluong);
           nhanvien.find(dieukien)
                .skip((tranghientai - 1) * soluong)
                .limit(soluong)
                .then(dsnv => {
                    res.render('index.ejs', { dsnv, tranghientai, tongsonhanvien, trangcuoicung });
            });
      });
}

//====================TÌM NHÂN VIÊN ============================================
router.get("/tim", function (req, res, next) {
  res.render('timnv.ejs');
});
router.post("/tim", function (req, res, next) {
  dieukien =  ({ ten: {$regex:req.body.txtTen, $options:'i' }})
    HienThi(req,res)
});

//localhost:3000/
router.get("/", function (req, res, next) {
  dieukien = {}
  res.redirect('/1')
});
router.get("/:page", function (req, res, next) {
  HienThi(req, res)
});

module.exports = router;








//====================================================
//localhost:3000/them
// router.get("/them", function (req, res, next) {
//   res.render("themnv.ejs");
// });
// router.post("/them", function (req, res, next) {
//   res.send("da bat dc du lieu");
// });
// router.get("/xuly", function (req, res, next) {
//   res.send(" du lieu bi ro ri");
// });
// router.post("/xuly", function (req, res, next) {
//   res.send(" tui xu ly nhe");
// });