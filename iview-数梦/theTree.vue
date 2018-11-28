<template>
  <div id="theTree">
    <div class="panel panel-default ztree-store-div">
      <div id="orgTree" class="ztree"></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "theTree",
    data: function () {
      return {
        setting: {
          callback: {
            onClick: this.onClick,
            onAsyncSuccess: this.onAsyncSuccess
          },
          view: {
            showIcon: this.showIcon,
            dblClickExpand: this.dblClickExpand,
            selectedMulti: this.selectedMulti
          },
          async: {
            enable: true,
            dataType: "json",
            type: "get",
            url: this.$global.getUrl("organization/findNodes?userId=" + $cookies.get("user_id")), //链接
            // url:this.$global.getUrl('sys/dictionary/findAllParent'),//链接
            //url: 'http://10.27.162.27:8800/api-matter/sys/org/findNodes',//链接
            autoParam: ["id=parentId"],
            otherParam: [],
            dataFilter: this.dataFilter
          },
          data: {
            simpleData: {
              enable: true
            }
          },
          check: {
            enable: this.checkEnable
          }
        },
        nodes: []
      };
    },
    methods: {
      onAsyncSuccess(event, treeId, treeNode, msg) {
        var treeObj = $.fn.zTree.getZTreeObj("" + treeId);
        if (!treeNode) {
          var nodes = treeObj.getNodes();
          treeObj.selectNode(nodes[0]);
          //				console.log(nodes[0].id)
          this.$store.state.app.theTreeComponentNodeId = nodes[0].id;
          this.$store.state.app.theTreeName = nodes[0].name;
          this.$store.state.app.theTreeDeptCode = nodes[0].deptCode;
        }
      },
      onClick(event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("orgTree");
        zTree.expandNode(treeNode);
        this.$store.state.app.theTreeComponentNodeId = treeNode.id;
        this.$store.state.app.theTreeName = treeNode.name;
        this.$store.state.app.theTreeDeptCode = treeNode.deptCode;
      },
      dataFilter(treeId, parentNode, responseData) {
        return responseData.data;
      }
    },
    mounted() {
      console.log(this.setting);
      $.fn.zTree.init($("#orgTree"), this.setting, this.nodes);
    },
    beforeMount() {
      this.$sxZTreeSelect.sxZTreeSelect();
    }
  };
</script>
<style>
  #areaTree {
    border: 1px solid #e5e5e5;
    margin-bottom: 2px;
    border-radius: 4px;
    overflow: hidden;
  }

  .box-title {
    border-radius: 3px 3px 0 0;
    background-color: #f5f5f5;
  }

  .box-title a {
    color: #2fa4e7;
    text-decoration: none;
    font-size: 14px;
    display: block;
    padding: 8px 15px;
    cursor: pointer;
  }

  .box-title .fa {
    float: right;
    line-height: 20px;
  }
</style>
