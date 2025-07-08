import { Button, Input, Popconfirm, message, Modal, Tag, Space } from 'antd';
import { useState, useEffect } from 'react';
import { apiUrl } from '../config/index';

export default function WhiteUser() {
  const [dataSource, setDataSource] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [newUser, setNewUser] = useState('');
  const [errText, setErrText] = useState('');

  // 获取白名单列表
  const fetchWhiteList = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl + '/logdb/whiteUser/get');
      const data = await response.json();
      const list = data.data;
      setDataSource(list);
    } catch (error) {
      setErrText('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除用户
  const handleDelete = async (name: string) => {
    try {
      await fetch(apiUrl + '/logdb/whiteUser/del', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      message.success('删除成功');
      fetchWhiteList(); // 刷新列表
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 新增用户
  const handleAdd = async () => {
    if (!newUser.trim()) {
      message.warning('用户名不能为空');
      return;
    }

    try {
      await fetch(apiUrl + '/logdb/whiteUser/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newUser }),
      });
      message.success('添加成功');
      setAddVisible(false);
      setNewUser('');
      fetchWhiteList(); // 刷新列表
    } catch (error) {
      message.error('添加失败');
    }
  };

  useEffect(() => {
    fetchWhiteList();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Button
        type="primary"
        onClick={() => setAddVisible(true)}
        style={{ marginBottom: 16 }}
      >
        添加用户
      </Button>
      <div></div>
      <div>{errText}</div>
      <Space wrap style={{ marginBottom: 16 }}>
        {' '}
        {/* 新增标签容器 */}
        {dataSource.map((name) => (
          <Tag
            key={name}
            closable
            onClose={(e) => {
              e.preventDefault(); // 阻止默认关闭行为
              handleDelete(name); // 触发删除确认流程
            }}
            style={{
              padding: '8px 15px',
              borderRadius: 20,
              background: '#f0f5ff',
              marginBottom: 8,
            }}
          >
            {name}
          </Tag>
        ))}
      </Space>

      {/* 保持Modal部分不变 */}
      <Modal
        title="添加白名单用户"
        open={addVisible}
        onCancel={() => setAddVisible(false)}
        onOk={handleAdd}
      >
        <Input
          placeholder="请输入用户名"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
          onPressEnter={handleAdd}
        />
      </Modal>
    </div>
  );
}
