import { BugTwoTone } from '@ant-design/icons';
import { Modal } from 'antd';

import { FC } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/addon/fold/foldcode.js'; // 代码折叠
import 'codemirror/addon/fold/foldgutter.js'; // 代码折叠
import 'codemirror/addon/fold/brace-fold.js'; // 代码折叠
import 'codemirror/addon/fold/comment-fold.js'; // 代码折叠
import 'codemirror/addon/hint/javascript-hint.js'; // 自动提示
import 'codemirror/addon/hint/show-hint.js'; // 自动提示
import 'codemirror/addon/lint/lint.js'; // 错误校验
import 'codemirror/addon/lint/javascript-lint.js'; // js错误校验
import 'codemirror/addon/selection/active-line.js'; // 当前行高亮
import 'codemirror/lib/codemirror.js';
import 'codemirror/mode/javascript/javascript.js';
// css
import 'codemirror/addon/fold/foldgutter.css'; // 代码折叠
import 'codemirror/addon/hint/show-hint.css'; // 自动提示
import 'codemirror/addon/lint/lint.css'; // 代码错误提示
import 'codemirror/lib/codemirror.css'; // 编辑器样式
import 'codemirror/theme/idea.css'; // 主题: idea
import 'codemirror/theme/solarized.css';

interface IProps {
  dom: string;
  line: number;
}
const CodemirrorDom: FC<IProps> = (props: any) => {
  const { dom, line } = props;
  const onEditorDidMount = (editor: any) => {
    editor.setSize('700px', '100%');
  };
  return (
    <div style={{ fontSize: '14px' }}>
      <CodeMirror
        value={dom}
        editorDidMount={onEditorDidMount}
        options={{
          mode: { name: 'javascript', json: true },
          theme: 'material', //idea
          lineNumbers: true,
          readOnly: true,
          lineWrapping: true,
          styleActiveLine: true,
          lint: true,
          gutters: ['CodeMirror-lint-markers'],
        }}
        selection={{
          ranges: [
            {
              anchor: { ch: 1, line: line - 1 },
              head: { ch: 1, line: line - 1 },
            },
          ],
          focus: true, // defaults false if not specified
        }}
        onChange={(editor, data, value) => {}}
      />
    </div>
  );
};

export default function ErrCode(props: any) {
  const { data } = props;
  const {
    sourceContent = '',
    originalPosition = {},
    loggerInfo,
    infoData,
  } = data || {};
  const { source, line, name } = originalPosition;
  const { errorType } = infoData;
  debugger;
  const handlePlay = () => {
    Modal.info({
      content: (
        <div id="playBox" style={{ display: 'flex' }}>
          <CodemirrorDom dom={sourceContent} line={line} />
          <div style={{ marginLeft: '20px' }}>
            <p>提示： {loggerInfo}</p>
            <p>类型： {errorType}</p>
            <p>文件： {source}</p>
            <p>name： {name}</p>
          </div>
        </div>
      ),
      width: 1200,
      icon: '',
      okText: '关闭',
    });
  };
  return (
    <BugTwoTone
      style={{ fontSize: 20, marginRight: 10 }}
      onClick={() => {
        handlePlay();
      }}
    />
  );
}
