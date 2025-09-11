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

// API ĐĂNG NHẬP (username + password)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  let users = [];
  if (fs.existsSync("users.json")) {
    users = JSON.parse(fs.readFileSync("users.json", "utf-8"));
  }

  const found = users.find(
    (user) => user.username === username && user.password === password
  );

  if (found) {
    res.json({ success: true, message: "Đăng nhập thành công!" });
  } else {
    res.json({ success: false, message: "Sai tài khoản hoặc mật khẩu!" });
  }
});

// API đăng nhập bằng email + password (thay cho quên mật khẩu)
app.post("/forgot-password", (req, res) => {
  const { email, password } = req.body;

  if (!fs.existsSync("users.json")) {
    return res.json({ success: false, message: "Chưa có dữ liệu người dùng" });
  }

  let users = JSON.parse(fs.readFileSync("users.json", "utf-8"));
  let user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.json({ success: false, message: "Sai email hoặc mật khẩu!" });
  }

  // Nếu đúng email + mật khẩu => coi như đăng nhập thành công
  res.json({ success: true, message: "Đăng nhập thành công!", user });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
