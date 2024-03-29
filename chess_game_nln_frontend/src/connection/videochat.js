import React, { useEffect, useState, useRef } from 'react';
import Peer from "simple-peer";
import styled from "styled-components";
const socket  = require('../connection/socket').socket


const Container = styled.div`
  height: 100vh;
  width: 100%;
  flex-direction: column;
`;

const Row = styled.div`
  width: 100%;
`;

const Video = styled.video`
  border: 1px solid blue;
`;

function VideoChatApp(props) {
    // * trạng thái ban đầu: cả hai người chơi đều trung lập và có tùy chọn gọi lẫn nhau
    // *
    // * người chơi 1 gọi người chơi 2: Người chơi 1 sẽ hiển thị: 'Đang gọi {tên người dùng của người chơi 2},' và
    // * Nút 'CallPeer' sẽ biến mất đối với Người chơi 1.
    // * Người chơi 2 sẽ hiển thị '{tên người dùng 1 người chơi} đang gọi bạn' và
    // * nút 'CallPeer' cho Người chơi 2 cũng sẽ biến mất.
    // *
    // * Trường hợp 1: người chơi 2 chấp nhận cuộc gọi - cuộc trò chuyện video bắt đầu và không có nút nào để kết thúc cuộc gọi.
    // *
    // * Trường hợp 2: người chơi 2 bỏ qua cuộc gọi của người chơi 1 - không có gì xảy ra. Chờ cho đến khi hết thời gian kết nối.

  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [isCalling, setIsCalling] = useState(false)
  const userVideo = useRef();
  const partnerVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })

    socket.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    })
  }, []);

  function callPeer(id) {
    setIsCalling(true)
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", data => {
      socket.emit("callUser", { userToCall: id, signalData: data, from: props.mySocketId})
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    })

  }

  function acceptCall() {
    setCallAccepted(true);
    setIsCalling(false)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <Video playsInline muted ref={userVideo} autoPlay style = {{width: "50%", height: "50%"}} />
    );
  }

  let mainView;

  if (callAccepted) {
    mainView = (
      <Video playsInline ref={partnerVideo} autoPlay style = {{width: "100%", height: "100%"}} />
    );
  } else if (receivingCall) {
    mainView = (
      <div>
        <h1 style={{ color: "white" }}>{props.opponentUserName} Đang gọi cho bạn</h1>
        <button onClick={acceptCall}><h1>Chấp nhận </h1></button>
      </div>
    )
  } else if (isCalling) {
    mainView = (
      <div>
        <h1 style={{ color: "white" }}>Đang gọi {props.opponentUserName}...</h1>
      </div>
    )
  } else {
    mainView = (
      <button onClick = {() => {
        callPeer(props.opponentSocketId) 
      }} ><h1 >Trò chuyện với bạn của bạn!</h1></button>
    )
  }



  return (<Container>
      <Row>
        {mainView}
        {UserVideo}
      </Row>
    </Container>);
}

export default VideoChatApp;
