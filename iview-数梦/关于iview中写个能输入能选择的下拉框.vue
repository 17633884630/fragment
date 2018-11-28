<template>
    <Input @on-focus="inputClick" class="click_select" v-model="req.name" placeholder="请输入名称" clearable />
    <ul style="list-style:none" class="ulLi clicK_select" v-if="visible">
        <li v-for="item in list" :value="item.name" :key="item.name" @click="ulClick(item.name)">{{ item.name }}</li>
    </ul>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      list: [], //字典项名称
      req: {
        name: ""
      }
    };
  },
  methods: {
    inputClick() {
      this.visible = true;
    },
    ulClick(name) {
      this.req.name = name;
      this.visible = false;
    }
  },
  mounted() {
    //为了点击其他的时候ul隐藏
    document.addEventListener("click", e => {
      if (e.target.className != "ivu-input ivu-input-default") { //这里的类名是iview 组件input的类名
        this.visible = false;
      }
    });
  }
};
</script>
<style>
.ulLi {
  list-style: none;
  position: absolute;
  z-index: 999;
  color: #2d8cf0;
  width: 90%;
  padding: 4px 10px;
  font-size: 12px;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  color: #515a6e;
  margin-top: 5px;
  background: white;
}

.ulLi li {
  padding-left: 5px;
  border-radius: 4px;
}

.ulLi li:hover {
  background: #f3f3f3;
}
</style>

  
//对于ztree树使用
