import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import JoinRoom from './onboard/joinroom'
import { ColorContext} from './context/colorcontext';
import Onboard from './onboard/onboard'
import JoinGame from './onboard/joingame'
import ChessGame from './chess/ui/chessgame'
/*
*
 * Quy trình giao diện người dùng:
 *
 * 1. lần đầu tiên người dùng mở ứng dụng này trong trình duyệt.
 * 2. màn hình xuất hiện yêu cầu người dùng gửi cho bạn bè của họ URL trò chơi của họ để bắt đầu trò chơi.
 * 3. người dùng gửi cho bạn bè của họ URL trò chơi của họ
 * 4. người dùng nhấp vào nút 'bắt đầu' và đợi người chơi khác tham gia.
 * 5. Ngay sau khi người chơi khác tham gia, trò chơi bắt đầu.
 *
 *
 * Luồng trình phát khác:
 * 1. người dùng nhận được liên kết do bạn bè của họ gửi
 * 2. người dùng nhấp vào liên kết và nó chuyển hướng đến trò chơi của họ. Nếu 'máy chủ' chưa nhấp vào nút 'bắt đầu', người dùng sẽ đợi khi máy chủ nhấp vào nút bắt đầu.
 * Nếu người tổ chức quyết định rời đi trước khi họ nhấp vào nút "bắt đầu", người dùng sẽ được thông báo rằng người dẫn chương trình đã kết thúc phiên.
 * 3. Sau khi người dẫn chương trình nhấp vào nút bắt đầu hoặc nút bắt đầu đã được nhấp vào
 * trước đó, đó là khi trò chơi bắt đầu.
 * Giới thiệu màn hình =====> Trò chơi bắt đầu.
 *
 * Mỗi khi người dùng mở trang web của chúng tôi từ đường dẫn '/', một phiên bản trò chơi mới sẽ tự động được tạo
 * ở mặt sau. Chúng ta nên tạo uuid trên giao diện người dùng, gửi yêu cầu cùng với uuid
 * như một phần của nội dung yêu cầu. Nếu bất kỳ người chơi nào bỏ đi, thì người chơi còn lại sẽ tự động thắng.
 *
 */


function App() {

  const [didRedirect, setDidRedirect] = React.useState(false)

  const playerDidRedirect = React.useCallback(() => {
    setDidRedirect(true)
  }, [])

  const playerDidNotRedirect = React.useCallback(() => {
    setDidRedirect(false)
  }, [])

  const [userName, setUserName] = React.useState('')

  return (
    <ColorContext.Provider value = {{didRedirect: didRedirect, playerDidRedirect: playerDidRedirect, playerDidNotRedirect: playerDidNotRedirect}}>
      <Router>
        <Switch>
          <Route path = "/" exact>
            <Onboard setUserName = {setUserName}/>
          </Route>
          <Route path = "/game/:gameid" exact>
            {didRedirect ? 
              <React.Fragment>
                    <JoinGame userName = {userName} isCreator = {true} />
                    <ChessGame myUserName = {userName} />
              </React.Fragment> 
              :
              <JoinRoom />}
          </Route>
          <Redirect to = "/" />
        </Switch>
      </Router>
    </ColorContext.Provider>);
}

export default App;
