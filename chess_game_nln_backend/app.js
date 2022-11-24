const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const gameLogic = require('./game-logic')
const app = express()

// backend flow:
// - kiểm tra xem ID trò chơi được mã hóa trong URL có thuộc về phiên trò chơi hợp lệ đang diễn ra hay không.
// - nếu có, hãy tham gia cùng người được mời vào trò chơi đó.
// - khác, tạo một phiên bản trò chơi mới.
// Đường dẫn * - '/' sẽ dẫn đến một phiên bản trò chơi mới.
// Đường dẫn * - '/ game /: gameid' trước tiên nên tìm kiếm một phiên bản trò chơi, sau đó tham gia nó. Nếu không, sẽ xuất hiện lỗi 404.


const server = http.createServer(app)
const io = socketio(server)

// lấy mã hóa gameID trong URL.
// kiểm tra xem liệu gameID đó có khớp với tất cả các trò chơi hiện có trong phiên hay không.
// tham gia phiên trò chơi hiện có.
// tạo một phiên mới.
// chạy khi máy khách kết nối

io.on('connection', client => {
    gameLogic.initializeGame(io, client)
})

// Cổng kết nối 
server.listen(process.env.PORT || 8000)