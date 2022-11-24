


  // Đây là nơi chúng ta nên đăng ký bộ nghe và bộ phát sự kiện.
 

var io
var gameSocket
 // gamesInSession lưu trữ một loạt tất cả các kết nối socket đang hoạt động
var gamesInSession = []


const initializeGame = (sio, socket) => {
    // initializeGame thiết lập tất cả các trình nghe sự kiện socket.
     

    // khởi tạo các biến toàn cục.
    io = sio 
    gameSocket = socket 

    // đẩy socket này vào một mảng lưu trữ tất cả các socket đang hoạt động.
    gamesInSession.push(gameSocket)

    // Chạy mã khi máy khách ngắt kết nối khỏi phiên socket của họ.
    gameSocket.on("disconnect", onDisconnect)

    // Gửi chuyển động mới đến phiên socket khác trong cùng một phòng.
    gameSocket.on("new move", newMove)

    // Người dùng tạo phòng trò chơi mới sau khi nhấp vào 'submit' trên giao diện người dùng
    gameSocket.on("createNewGame", createNewGame)

    // Người dùng tham gia gameRoom sau khi truy cập URL có '/ game /: gameId'
    gameSocket.on("playerJoinGame", playerJoinsGame)

    gameSocket.on('request username', requestUserName)

    gameSocket.on('recieved userName', recievedUserName)

    // đăng ký người nghe sự kiện cho ứng dụng trò chuyện video:
    videoChatBackend()
}


function videoChatBackend() {
    // hàm chính cho người gọi video
    gameSocket.on("callUser", (data) => {
        io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
    })

    gameSocket.on("acceptCall", (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    })
}   



function playerJoinsGame(idData) {
    /**
     *Tham gia socket đã cho vào một phiên với gameId của người chơi
     */

    // Tham chiếu đến đối tượng socket Socket.IO của người chơi
    var sock = this
    
    // Tra cứu ID phòng trong đối tượng trình quản lý Socket.IO.
    var room = io.sockets.adapter.rooms[idData.gameId]
   // console.log(room)

    // nếu phòng không hợp lệ
    if (room === undefined) {
        this.emit('status' , "Phiên bản này không hợp lệ" );
        return
    }
    if (room.length < 2) {
        // đính kèm id socket vào đối tượng
        idData.mySocketId = sock.id;

        // join vào phòng
        sock.join(idData.gameId);

        console.log(room.length)

        if (room.length === 2) {
            io.sockets.in(idData.gameId).emit('start game', idData.userName)
        }

        // tạo ra một sự kiện thông báo cho khách hàng rằng người chơi đã tham gia phòng.
        io.sockets.in(idData.gameId).emit('playerJoinedRoom', idData);

    } else {
        // Nếu không, gửi lại thông báo lỗi cho người chơi.
        this.emit('status' , " Đã có 2 người chơi trong phòng này." );
    }
}


function createNewGame(gameId) {
    // Trả lại ID Room (gameId) và ID Socket (mySocketId) cho ứng dụng khách trình duyệt
    this.emit('createNewGame', {gameId: gameId, mySocketId: this.id});

    // vào Room và đợi người chơi khác
    this.join(gameId)
}


function newMove(move) {
    /**
     * 
     */
    
    const gameId = move.gameId 
    
    io.to(gameId).emit('opponent move', move);
}

function onDisconnect() {
    var i = gamesInSession.indexOf(gameSocket);
    gamesInSession.splice(i, 1);
}


function requestUserName(gameId) {
    io.to(gameId).emit('give userName', this.id);
}

function recievedUserName(data) {
    data.socketId = this.id
    io.to(data.gameId).emit('get Opponent UserName', data);
}

exports.initializeGame = initializeGame