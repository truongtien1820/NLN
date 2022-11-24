import React from 'react'
import { useParams } from 'react-router-dom'
const socket  = require('../connection/socket').socket

//'Join game' là nơi chúng ta thực sự tham gia vào phòng trò chơi.
 


const JoinGameRoom = (gameid, userName, isCreator) => {
    
    const idData = {
        gameId : gameid,
        userName : userName,
        isCreator: isCreator
    }
    socket.emit("playerJoinGame", idData)
}
  
  
const JoinGame = (props) => {

    //     * Trích xuất 'gameId' từ URL.
    //   * 'gameId' là ID gameRoom.
     
    const { gameid } = useParams()
    JoinGameRoom(gameid, props.userName, props.isCreator)
    return <div style={{backgroundColor: "black"}}>
        <h1 style = {{textAlign: "center", color : "white", margin: "0px"}}>Chào mừng bạn đến với game cờ vua của mình</h1>
    </div>
}

export default JoinGame
  
