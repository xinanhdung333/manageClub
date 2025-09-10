const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Mặc định vào / sẽ trả signin.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "signin.html"));
});
// API ĐĂNG NHẬP
app.post("/login", (req, res) => {
  const { username, email, password } = req.body;

  let users = [];
  if (fs.existsSync("users.json")) {
    users = JSON.parse(fs.readFileSync("users.json", "utf-8"));
  }

  const found = users.find(
    (user) =>
      ((user.username === username) || (user.email === email) || (user.email === username)) 
      && user.password === password
  );

  if (found) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Sai tài khoản hoặc mật khẩu!" });
  }
});

// API quên mật khẩu
app.post("/forgot-password", (req, res) => {
  const { email, newPassword } = req.body;

  if (!fs.existsSync("users.json")) {
    return res.json({ success: false, message: "Chưa có dữ liệu người dùng" });
  }

  let users = JSON.parse(fs.readFileSync("users.json", "utf-8"));
  let user = users.find(u => u.email === email);

  if (!user) {
    return res.json({ success: false, message: "Email không tồn tại!" });
  }

  // cập nhật mật khẩu mới
  user.password = newPassword;
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

  res.json({ success: true, message: "Đổi mật khẩu thành công!" });
});

// API xem danh sách user (chỉ test, nên xoá khi deploy)
app.get("/users", (req, res) => {
  if (fs.existsSync("users.json")) {
    const users = JSON.parse(fs.readFileSync("users.json", "utf-8"));
    res.json(users);
  } else {
    res.json([]);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
console.log("Body nhận được:", req.body);
console.log("Danh sách users:", users);

});
