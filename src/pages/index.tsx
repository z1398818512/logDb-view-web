import { useState, useEffect } from 'react';
import { useLocation } from 'umi';
import { CopyFilled } from '@ant-design/icons';
// import 'antd/dist/antd.css';
import {
  Button,
  DatePicker,
  Table,
  Form,
  Input,
  notification,
  Drawer,
} from 'antd';
import styles from './index.less';
// import initIo from './socket.js';
import { Menu } from 'antd';
import {
  MailOutlined,
  AppstoreOutlined,
  LinkOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import RealLog from './RealLog';
import Replay from './Replay';
import ErrCode from './ErrCode';
import initIo from './wss.js';
// import the react-json-view component
import ReactJson from 'react-json-view';

// use the component in your app!

var socket = {};

export default function IndexPage() {
  const location = useLocation();
  const { roomId } = location.query || {};
  const columns = [
    // { title: '序号', dataIndex: 'id', key: 'id', width: 100, fixed: true },
    { title: '日期', dataIndex: 'time', key: 'time', width: 150, fixed: true },
    {
      title: '类型',
      dataIndex: 'logType',
      key: 'logType',
      width: 200,
      fixed: true,
      render(info, record) {
        const list = info.split('\\n');
        if (list.length <= 1) return info;
        return (
          <div>
            <p style={{ color: 'red' }}>{list[0]}</p>
            <p>{list[1]}</p>
          </div>
        );
      },
    },
    {
      title: '日志内容',
      dataIndex: 'loggerInfo',
      key: 'loggerInfo',
      ellipsis: true,
      textWrap: 'word-break',
      className: 'tablelogInfo',
      render(info, record) {
        if (record.logType === 'recordVideo') {
          return '-';
        }
        return info;
      },
    },
    {
      title: '操作',
      width: 100,
      render(info) {
        let btn = [];
        if (info.recordEvent && info.recordEvent.length) {
          btn.push(<Replay data={info.recordEvent} />);
        }
        if (info.sourceContent && info.originalPosition?.column) {
          btn.push(<ErrCode data={info} />);
        }
        btn.push(
          <CopyFilled
            style={{ fontSize: 20 }}
            onClick={() => {
              const tkl = document.getElementById('copyDom');
              tkl.value = info.loggerInfo;
              tkl.select();
              document.execCommand('Copy');
              notification.success({
                message: '复制成功',
                duration: 1,
              });
            }}
          />,
        );
        return btn;
      },
    },
  ];
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loding, setLoding] = useState(false);
  const [jsonObj, setJsonObj] = useState(null);
  const [textLog, setTextLog] = useState('');
  const [filterData, setFilterData] = useState({});
  const [current, setCurrent] = useState('logInfo');
  const [userId, setUserId] = useState('');
  const [isConnection, setIsConnection] = useState(false);
  const [userList, setUserList] = useState([]);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    pageSizeOptions: [10, 100, 200, 500],
    defaultPageSize: 10,
  });

  useEffect(async () => {
    socket = await initIo({ roomId, onConnection, onClosed, onGetUser });

    socket.on('responseData', ({ data }) => {
      const { dataList, total, pageIndex, pageSize } = data;
      setPagination({
        ...pagination,
        total,
        current: pageIndex,
        pageSize,
      });
      dataList.forEach((item) => {
        if (typeof item.loggerInfo !== 'string') {
          item.loggerInfo = JSON.stringify(item.loggerInfo);
        }
      });
      console.log('请求到参数');
      setData(dataList);
      setLoding(false);
    });

    queryArr();
  }, []);

  const onConnection = ({ userId = '' }) => {
    setUserId(userId);
    setIsConnection(true);
  };
  const onClosed = () => {
    setIsConnection(false);
    setLoding(false);
  };
  const onGetUser = (userList = []) => {
    setUserList(userList);
    if (userList.includes(userId)) {
      onClosed();
    } else {
      setIsConnection(true);
      setLoding(false);
    }
  };
  const queryArr = (parmse: any = {}) => {
    setLoding(true);
    const { current, pageSize } = pagination;
    socket.emit('query', {
      pageSize: pageSize,
      pageIndex: current,
      ...filterData,
      ...parmse,
    });
  };

  const handleClick = (e: any) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const onFinish = (values: any) => {
    console.log('finish:', values);
    const { start, end, logType, infoText } = values;
    const data = {
      start: start ? new Date(start).getTime() : undefined,
      end: end ? new Date(end).getTime() : undefined,
      logType,
      infoText,
    };
    setFilterData(data);
    queryArr({ ...data, pageIndex: 1 });
  };
  const onChange = (pageIndex, pageSize) => {
    setPagination({
      ...pagination,
      current: pageIndex,
      pageSize,
    });
    queryArr({
      pageIndex,
      pageSize,
    });
  };

  const markRows = (record) => {
    switch (record.logType) {
      case 'err':
        return styles.errorRows;
      default:
        return '';
    }
  };
  const handleClickTableH = (rowData = {} as any) => {
    const { loggerInfo } = rowData;
    let isJson = false;
    try {
      let json = JSON.parse(loggerInfo);
      isJson = typeof json === 'object';
    } catch (err) {}
    setSelectedRowKeys([rowData.id]);
    if (isJson) {
      setJsonObj(JSON.parse(loggerInfo));
    } else {
      setJsonObj(null);
      setTextLog(loggerInfo);
    }
  };
  const handleShowUser = () => {
    setIsOpenDrawer(true);
  };
  const onCloseDrawer = () => {
    setIsOpenDrawer(false);
  };
  const handleCheckUser = (user) => {
    window.location.href = window.location.origin + `/?roomId=${user}`;
  };

  return (
    <div className={styles.logIndex}>
      <div className={styles.headMain}>
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
          <Menu.Item key="logInfo" icon={<MailOutlined />}>
            日志详情
          </Menu.Item>
          <Menu.Item key="realLog" icon={<AppstoreOutlined />}>
            实时日志
          </Menu.Item>
        </Menu>
        <div className={styles.connectionMain} onClick={handleShowUser}>
          {userId}
          {isConnection ? (
            <span style={{ color: '#057805', marginLeft: 5 }}>
              <LinkOutlined
                title="已连接"
                style={{ fontSize: 20, color: '#057805' }}
              />
              <span>(已连接)</span>
            </span>
          ) : (
            <span style={{ color: '#E17874', marginLeft: 5 }}>
              <ApiOutlined
                title="已断开"
                style={{ fontSize: 20, color: '#E17874' }}
              />
              {userList.includes(userId) ? (
                <span>(本地未连接)</span>
              ) : (
                <span>(用户已断开)</span>
              )}
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          display: current === 'logInfo' ? 'block' : 'none',
          marginTop: 10,
        }}
      >
        <Form onFinish={onFinish} layout="inline" style={{ marginBottom: 10 }}>
          <Form.Item label="开始时间" name="start">
            <DatePicker showTime />
          </Form.Item>
          <Form.Item label="结束时间" name="end">
            <DatePicker showTime />
          </Form.Item>
          <Form.Item label="类型" name="logType">
            <Input />
          </Form.Item>
          <Form.Item label="内容" name="infoText">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.boxMain}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ ...pagination, onChange }}
            loading={loding}
            scroll={{ y: 650 }}
            expandable={{
              expandedRowRender: (record) => (
                <p style={{ margin: 0 }}>{record.loggerInfo}</p>
              ),
            }}
            rowClassName={markRows}
            rowKey="id"
            className={styles.logTable}
            onRow={(record) => {
              return { onClick: handleClickTableH.bind(null, record) };
            }}
            rowSelection={{
              type: 'radio',
              columnWidth: 0,
              selectedRowKeys,
            }}
          />
          <div className={styles.jsonShow}>
            <h3>日志详情</h3>
            {jsonObj ? (
              <ReactJson
                theme={'bespin'}
                src={jsonObj}
                displayDataTypes={false}
                displayObjectSize={false}
                name={false}
              />
            ) : (
              <div>{textLog}</div>
            )}
          </div>
        </div>
      </div>
      <div style={{ display: current === 'realLog' ? 'block' : 'none' }}>
        <RealLog socket={socket} />
      </div>
      <textarea
        title="复制详情"
        id="copyDom"
        style={{ opacity: 0, position: 'absolute' }}
      />
      <Drawer title="可连接的用户" onClose={onCloseDrawer} open={isOpenDrawer}>
        {userList.map((item) => (
          <Button
            type={item == userId ? 'primary' : 'text'}
            size="small"
            style={{ marginRight: 5 }}
            onClick={handleCheckUser.bind(null, item)}
          >
            {item}
          </Button>
        ))}
      </Drawer>
    </div>
  );
}
