<!--第一次写(写了3种)-->
<template>
	<!--在iview中显示高亮效果,(适合菜单权限缓存到localStorage,cookie,sessionStorage中的) !!!👇下面有升级版(适合内存缓存)
	https://www.jianshu.com/p/5f239ce7643b(使用路由判断的);
	结合上面的自己写个适合自己项目的(写的不好,欢迎指教,你的指教就是我的进步,谢谢!!!)-->
	<Menu width="auto" :active-name="activemenu" @on-select="selectName" :open-names='openmenu' :accordion="true">
		<template v-for='(item,i) in menus'>
			<Submenu v-if="item.children && item.children.length > 0" :name='i' :key='i'>
				<template slot="title">
					<Icon :type='item.icon' />
					<span>{{item.title}}</span>
				</template>
				<MenuItem v-for='(it,j) in item.children' :name='i + "-" + j' :to='it.to' :key='i + "-" + j'>
				<span>{{it.title}}</span>
				</MenuItem>
			</Submenu>
			<MenuItem v-else :name='i' :to="item.to" :target="item.target">
			<Icon :type='item.icon'></Icon>
			<span>{{item.title}}</span>
			</MenuItem>
		</template>
	</Menu>
	<!--在如果有用户话把localStorage清空就行了!!!
	思路直接操作iview中 active-name open-names 的值 刷新直接把值放到缓存中,刷新之后取出来就行
	写的不好,欢迎指导!!!你的指导就是我的进步,谢谢!!!-->
</template>

<script>
	export default {
		data() {
			return {
				menus: [], //菜单列表...
				activemenu: 0,
				selectMenu: null,
				openmenu: []
			}
		},
		methods: {
			selectName(name) { //iview方法(返回name 上面的name 父级0 子级 0 - 1 形式
				localStorage.setItem('selectMenu', name);
				var openName; //父级需要处理 name 不放回父级
				if(name == 0) { //因为没有子级的只有一个就直接判断了
					openName = 0;
				} else {
					openName = name.charAt(0); //name都是子级 1 - 1 获取 1(字符串)
				}
				localStorage.setItem('openName', openName);
			}
		},
		created() {
			var selectMenu = localStorage.getItem('selectMenu');
			var openName = parseInt(localStorage.getItem('openName')); //因为openmenu值需要数字
			if(selectMenu == 0 || selectMenu == null) { //初始进来为null
				this.activemenu = 0
			} else {
				this.openmenu.push(openName);
				this.activemenu = selectMenu;
			}
		}
	}
</script>

<!--第二次写(写了3种)-->
<template>
	<!--升级版(调整需求把本地缓存的数据存内存里) 就是数据源改变了
	技术点:
	@on-select 选择菜单（MenuItem）时触发
	@on-open-change 当 展开/收起 子菜单时触发
	updateOpened 手动更新展开的子目录，注意要在 $nextTick 里调用
	updateActiveName 手动更新当前选择项，注意要在 $nextTick 里调用
	口才不好!!!直接上代码-->
	<Menu ref="side_menu" width="auto" :active-name="activeName" :open-names='openNames' @on-select="onSelect" @on-open-change="onOpenChange">
		<template v-for='(item,i) in menus'>
			<Submenu v-if="item.children && item.children.length > 0" :name='item.code' :key='i'>
				<template slot="title">
					<Icon :type='item.icon' />
					<span>{{item.title}}</span>
				</template>
				<MenuItem v-for='(it,j) in item.children' v-if="it.title" :name='it.code' :to='it.to' :key='i + "-" + j'>
				<span>{{it.title}}</span>
				</MenuItem>
			</Submenu>
			<MenuItem v-else :name='item.code' :to="item.to" :target="item.target">
			<Icon :type='item.icon'></Icon>
			<span>{{item.title}}</span>
			</MenuItem>
		</template>
	</Menu>
</template>

<script>
	export default {
		data() {
			return {
				menus: [], //菜单列表... (这个就是一刷新就请求的数据....不细说了)
				activeName: [],
				openNames: []
			}
		},
		methods: {
			//子菜单()
			//https://segmentfault.com/q/1010000011821642/a-1020000011845869 (根据这个写的)
			onSelect(name) {
				//设置菜单激活的name
				localStorage.setItem('menu_opennames', name);
			},
			//菜单
			onOpenChange(name) {
				//设置菜单展开子菜单的数组name
				localStorage.setItem('active_name', name);
			}
		},
		created() {
			this.menus = dataMenus(ajax(后台返回的)....);
			this.$nextTick(() => {
				let active_name = localStorage.getItem('active_name');
				let open_names = localStorage.getItem('menu_opennames'); // []
				if(open_names || active_name) {
					this.openNames = active_name || [];
					this.activeName = open_names || 0;
					this.$nextTick(() => {
						this.$refs.side_menu.updateOpened(); //在Menu中设置的side_menu ref="side_menu"
						this.$refs.side_menu.updateActiveName()
					})
				} else {
					this.activeName = dataMenus[0].code || 0; //首次进来默认选中第一个
					this.openNames = dataMenus[0].children ? dataMenus[0].children['code'] : [] || []; //首次进来默认选中第一个的子级(如果有)
				}
			})
		}
	}
</script>

<!--第三次写(写了3种)-->
<template>
	<!--直接上代码-->
	<Menu width="auto" ref="bg_name" :active-name="activeName" :open-names="openNames" :accordion="true">
		<template v-for="(item,i) in menus">
			<Submenu v-if="item.children && item.children.length>0" :name="item.code" :key="i">
				<template slot="title">
					<Icon :type="item.icon" />
					<span>{{item.title}}</span>
				</template>
				<MenuItem v-for="(it,j) in item.children" v-if="it.title" :name="item.code + '-' + it.code" :to="it.to" :key="i + '-' + j">
				<span>{{it.title}}</span>
				</MenuItem>
			</Submenu>
			<MenuItem v-else :name="item.code" :to="item.to" :target="item.target">
			<Icon :type="item.icon"></Icon>
			<span>{{item.title}}</span>
			</MenuItem>
		</template>
	</Menu>
</template>

<script>
	export default {
		data() {
			return {
				activeName: "",
				openNames: []
			}
		},
		methods: {
			onChange() {
				//获取路由做好的/xx 的 因为首页特殊点
				var path = this.$route.meta.menu || this.$route.path;
				//判断菜单,就行数据赋值
				$.each(this.menus, (i, m) => {
					if(m.children && m.children.length > 0) {
						$.each(m.children, (j, n) => {
							if(n.to == path) {
								this.openNames = [m.code];
								this.activeName = m.code + "-" + n.code;
								return false;
							}
						});
					} else {
						//首页问题
						if(m.to == path) {
							this.activeName = m.code;
							return false;
						}
					}
				});
			}
		},
		created() {
			this.onChange();
			//active-name,open-names 第一次需要更新下, --> 必须挂载第一线,牛
			this.$nextTick(() => {
				this.$refs.bg_name.updateOpened();
				this.$refs.bg_name.updateActiveName();
			})
		}
	}
</script>