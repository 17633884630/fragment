import global from './index'

const sxZTreeSelect = function (options) {
  var defaults = {
    //加载组件的元素
    id: '#orgTree',
    //用于捕获节点被点击的事件回调函数
    onClick: function (event, treeId, treeNode) {
      //			console.log(treeNode.id);
    },
    //用于捕获异步加载正常结束的事件回调函数
    onAsyncSuccess: function (event, treeId, treeNode, msg) {
      let treeObj = $.fn.zTree.getZTreeObj('' + treeId);
      if (!treeNode) {
        let nodes = treeObj.getNodes();

        //				treeObj.selectNode(nodes[0]);
      }
    },
    //是否显示节点的图标
    showIcon: true,
    //双击节点时，是否自动展开父节点的标识
    dblClickExpand: false,
    //设置是否允许同时选中多个节点
    selectedMulti: false,
    //ajax获取数据的 URL 地址
    asyncUrl: global.getUrl('organization/findNodes'),
    // asyncUrl: global.getUrl('sys/dictionary/findAllParent'),
    //asyncUrl : 'http://10.27.162.27:8800/api-matter/sys/org/findNodes',
    //异步加载时需要自动提交父节点属性的参数
    autoParam: ["id=parentId"],
    //Ajax请求提交的静态参数键值对
    otherParam: [],
    //是否使用简单数据模式
    simpleDataEnable: true,
    //设置 zTree 的节点上是否显示 checkbox / radio
    checkEnable: false,
    dataFilter: function (treeId, parentNode, responseData) {
      return responseData.data;
    }
  };
  let opts = $.extend(defaults, options);
  let self = $(opts.id);
  let sxTreeInit = function (e) {
    let setting = {
      callback: {
        onClick: opts.onClick,
        onAsyncSuccess: opts.onAsyncSuccess,
        onCheck:opts.onCheck
      },
      view: {
        showIcon: opts.showIcon,
        dblClickExpand: opts.dblClickExpand,
        selectedMulti: opts.selectedMulti
      },
      async: {
        enable: true,
        dataType: "json",
        type: "get",
        url: opts.asyncUrl,
        autoParam: opts.autoParam,
        otherParam: opts.otherParam,
        dataFilter: opts.dataFilter
      },
      data: {
        simpleData: {
          enable: opts.simpleDataEnable
        }
      },
      check: {
        enable: opts.checkEnable
      }
    };
    $.fn.zTree.init(self, setting);
  };

  sxTreeInit();

};
export default {
  sxZTreeSelect
}
