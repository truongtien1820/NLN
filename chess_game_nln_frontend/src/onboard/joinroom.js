import React from 'react'
import JoinGame from './joingame'
import ChessGame from '../chess/ui/chessgame'


/**
 * Onboard là nơi tạo phòng để chơi cờ
 */

class JoinRoom extends React.Component {
    state = {
        didGetUserName: false,
        inputText: ""
    }

    constructor(props) {
        super(props);
        this.textArea = React.createRef();
    }

    typingUserName = () => {
        // lấy văn bản đầu vào từ trường từ DOM
        const typedText = this.textArea.current.value
        
        // đặt trạng thái với văn bản đó
        this.setState({
            inputText: typedText
        })
    }

    render() {
    
        return (<React.Fragment>
            {
                this.state.didGetUserName ? 
                <React.Fragment>
                    <JoinGame userName = {this.state.inputText} isCreator = {false}/>
                    <ChessGame myUserName = {this.state.inputText}/>
                </React.Fragment>
            :
               <div >
                    <h1 style={{textAlign: "center", marginTop: String((window.innerHeight / 3)) + "px"}}>Tên của bạn:</h1>

                    <input style={{marginLeft: String((window.innerWidth / 2) - 120) + "px", width: "240px", marginTop: "62px"}} 
                           ref = {this.textArea}
                           onInput = {this.typingUserName}></input>
                           
                    <button className="btn btn-primary" 
                        style = {{marginLeft: String((window.innerWidth / 2) - 60) + "px", width: "120px", marginTop: "62px"}} 
                        disabled = {!(this.state.inputText.length > 0)} 
                        onClick = {() => {
                            // Khi nút 'submit' được nhấn từ màn hình tên người dùng,
                            // tôi nên gửi yêu cầu tới máy chủ để tạo một phòng mới với
                            // uuid mà  tôi tạo ở đây.
                            this.setState({
                                didGetUserName: true
                            })
                        }}>Xác nhận</button>
                </div>
            }
            </React.Fragment>)
    }
}

export default JoinRoom