import ace from 'ace-builds';

import themeMonokaiUrl from 'ace-builds/src-noconflict/theme-monokai?url';
ace.config.setModuleUrl('ace/theme/monokai', themeMonokaiUrl);

import workerBaseUrl from 'ace-builds/src-noconflict/worker-base?url';
ace.config.setModuleUrl('ace/mode/base', workerBaseUrl);

import modeJsonUrl from 'ace-builds/src-noconflict/mode-json?url';
ace.config.setModuleUrl('ace/mode/json', modeJsonUrl);
import workerJsonUrl from 'ace-builds/src-noconflict/worker-json?url';
ace.config.setModuleUrl('ace/mode/json_worker', workerJsonUrl);
import snippetsJsonUrl from 'ace-builds/src-noconflict/snippets/json?url';
ace.config.setModuleUrl('ace/snippets/json', snippetsJsonUrl);

import modeJavascriptUrl from 'ace-builds/src-noconflict/mode-javascript?url';
ace.config.setModuleUrl('ace/mode/javascript', modeJavascriptUrl);
import workerJavascriptUrl from 'ace-builds/src-noconflict/worker-javascript?url';
ace.config.setModuleUrl('ace/mode/javascript_worker', workerJavascriptUrl);
import snippetsJavascriptUrl from 'ace-builds/src-noconflict/snippets/javascript?url';
ace.config.setModuleUrl('ace/snippets/javascript', snippetsJavascriptUrl);

import 'ace-builds/src-noconflict/ext-language_tools';
// ace.require('ace/ext/language_tools');
const langTools = ace.require('ace/ext/language_tools');
langTools.addCompleter({
  getCompletions: function (
    _editor: any,
    _session: any,
    _pos: any,
    prefix: string | any[],
    callback: (
      arg0: null,
      arg1: {
        name: string; //显示的名称
        value: string; //插入的值，
        score: number; //分数
        meta: string; //描述
      }[]
    ) => void
  ) {
    if (prefix.length === 0) {
      callback(null, []);
      return;
    }
    callback(null, [
      {
        name: '$mtEventCallBack',
        value: '$mtEventCallBack(type,$item_info.id)',
        score: 1000,
        meta: '执行订阅回调函数'
      },
      {
        name: '$mtElMessage',
        value: '$mtElMessage.success("成功")',
        score: 1000,
        meta: '消息提示'
      },
      {
        name: '$mtElMessageBox',
        value: `$mtElMessageBox.alert('This is a message', 'Title', {
          confirmButtonText: 'OK',
          callback: (action) => {
            console.log(action)
          },
        })`,
        score: 1000,
        meta: '消息弹出框'
      },
      {
        name: '$item_info',
        value: '$item_info',
        score: 1000,
        meta: '回调函数中获取当前触发事件图形的信息'
      }
    ]);
  }
});
