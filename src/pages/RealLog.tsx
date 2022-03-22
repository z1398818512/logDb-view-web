import { Button,Input} from "antd";
const { TextArea } = Input;
import { useState } from "react";

export default function RealLog({
  socket
}:any) {
  const [logData,setLogData] = useState({
    index:0,
    value:''
  })
  const [isopen,setIsopen] = useState(false)
  const handleCb = function({data}:any){
    console.log(data,isopen)
    setLogData({
      index:logData.index+= 1,
      value:logData.value+= `${logData.index}. （${data.time}） ${data.loggerInfo} \n`
    })
  }
  const handleOpen = ()=>{
    if(!socket.on){
      alert('socket未连接')
      return false
    }
    socket.emit('openRealLog', true)
    setIsopen(true)
    socket.on('onCeLogData',handleCb)
  }
  const reset = ()=>{
    setLogData({
      index:0,
      value:''
    })
  }
  const handleSend = ()=>{
      const txt = document.getElementById('scriptTxt').value;
      socket.emit('sendScirpt', txt)
  }
  
  return (
    <div>
      <div style={{margin:'10px'}}>
        <Button style={{marginRight:'10px'}} onClick={handleOpen} type="primary">{isopen?'开启中...':'开启'}</Button>
        <Button onClick={reset}>清空</Button>
      </div>
      <TextArea
        value={logData.value}
        rows={25}
      />
     
      <div style={{marginTop:10}}>
        控制台执行指令：
        <TextArea id="scriptTxt" rows={10} allowClear></TextArea>
      </div>
      <div style={{margin:10}}>
          <Button  onClick={handleSend}>发送指令</Button>
      </div>
     
    </div>
  )
}