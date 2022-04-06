import { PlayCircleTwoTone } from '@ant-design/icons';
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';
import { Modal } from 'antd'
export default function Replay(props: any) {
  const { data } = props

  const handlePlay = (data) => {
    Modal.info({
      content: <div id='playBox'></div>,
      width: 1200,
      icon: '',
      okText: '关闭'
    })
    setTimeout(() => {
      const box = document.getElementById('playBox')
      const arr = JSON.parse(data)
      new rrwebPlayer({
        target: box, // 可以自定义 DOM 元素
        // 配置项
        props: {
          events: arr,
        },
      });
    }, 100)

  }
  return <PlayCircleTwoTone style={{ fontSize: 30 }} onClick={() => { handlePlay(data) }} />
}