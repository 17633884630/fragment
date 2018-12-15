<template>
	<div>
		<Card>
			<div slot="title" style="margin-bottom: 10px;">
				<div style="margin-bottom: 10px;">
					<h2 style="text-align: center;">{{year}}-{{month}}</h2>
				</div>
				<DatePicker type="month" placeholder="请输入日期" :clearable="true" @on-change="onChange"></DatePicker>
				<Button type="primary" @click="initClick">初始化工作日</Button>
				<div style="float: right;">
					<span style="padding-right: 20px;">当月工作日总天数: {{dayCount}} 天</span>
					<Button type="primary" @click="backInMonth">回到本月</Button>
				</div>
			</div>
			<Row type="flex" class="">
				<Col class="current" :lg="3" v-for="(item,index) in weeks" :key="value">{{item}}</Col>
			</Row>
			<Row type="flex" class="">
				<Col class="prev" v-for="(item,index) in prev" :key="value">{{item}}</Col>
				<Col class="current" :lg="3" v-for="(item,index) in current" :key="value">
				<span @click="onClicks(item)" style="cursor: pointer;" :class="dayMessage.indexOf(item) !== -1   ? 'active':''">
					{{item}}
				</span>
				</Col>
				<Col class="next" v-for="(item,index) in next" :key="value">{{item}}</Col>
			</Row>
		</Card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				weeks: ['日', '一', '二', '三', '四', '五', '六'],
				prev: [],
				current: [], //现在月数
				next: [],
				year: '', //当年
				month: '', //当月
				isDay: [],
				lableCount: null,
				days: '',
				time_data: null,
				ids: {}, //每条数据id
				dayCount: null //当月总天数
			}
		},
		computed: {
			// 计算属性的 getter
			dayMessage() {
				return this.isDay
			}
		},
		methods: {
			//获取下拉框的日期
			onChange(g, d) {
				var y = g.substring(0, 4);
				var m = g.substr(g.length - 2, 2);
				var str = [];
				$.each(this.time_data, (i, d) => {
					let years = d.workDate.substring(0, 4);
					let months = d.workDate.substring(5, 7);
					if(y === years && m === months) {
						let days = parseInt(d.workDate.substr(d.workDate.length - 2, 2));
						str.push(days)
					}
				});
				this.isDay = str;
				this.timeToRender(y, m);
			},
			//点击设置
			onClicks(i) {
				let cName = event.target.className;
				if(cName === "active") {
					this.$Modal.confirm({
						title: "提示",
						content: "您确定 删除 工作日吗？",
						onOk: () => {
							let id = this.ids['num_' + i]
							this.$global.sysWorkingDayDelete(id, d => {
								if(d.success) {
									//this.$Message.success("删除成功!");
									this.timeToRender();
									this.sysWorkingDayFind();
								}
							})
						}
					});
				} else {
					this.$Modal.confirm({
						title: "提示",
						content: "您确定 设置 成工作日吗？",
						onOk: () => {
							let times = this.year + '-' + this.month + '-' + i;
							let data = {
								workDate: times
							}
							this.$global.sysWorkingDayAdd(data, d => {
								if(d.success) {
									this.timeToRender();
									this.sysWorkingDayFind();
								}
							})
						}
					});
				}

			},
			//中间时间渲染
			timeToRender(year, month) {
				let date = new Date()
				this.year = year || date.getFullYear() //当年
				this.month = month || date.getMonth() + 1 //当月
				let currentDate = new Date(this.year, this.month, 0) //当月最后一天
				let currentArr = [...Array(currentDate.getDate()).fill(1)] //创建当月数组，填充1
				this.current = currentArr.map((item, index) => item + index) //做数组处理,
				/*上月*/
				let prevDate = new Date(this.year, this.month - 1, 0) //上月最后一天
				let prevArr = [...Array(prevDate.getDay() + 1).fill(prevDate.getDate())] //创建上月数组，填充最后一天
				this.prev = prevArr.map((item, index) => item - index).sort((a, b) => a - b) //做数组处理
				/*下月*/
				let nextArr = [...Array(6 - currentDate.getDay()).fill(1)] //创建下月数组，填充1
				this.next = nextArr.map((item, index) => item + index);

				//
				this.sysWorkingDayCount(this.year, this.month)
			},
			//一进来获取工作日列表
			sysWorkingDayFind(data) {
				var data = data || {};
				this.$global.sysWorkingDayFind(data, d => {
					if(d.success) {
						this.time_data = d.data;
						var list = [];
						var ids = {}
						$.each(d.data, (i, d) => {
							let y = parseInt(d.workDate.substring(0, 4));
							let m = parseInt(d.workDate.substring(5, 7));
							if(this.year === y && this.month === m) {
								let days = parseInt(d.workDate.substr(d.workDate.length - 2, 2))
								ids['num_' + days] = d.id;
								list.push(days)
							} else {
								list = [];
							}
						});
						this.isDay = list;
						this.ids = ids;
					}
				})
			},
			//初始化
			initClick() {
				this.$global.sysWorkingDayInit(this.year, d => {
					if(d.data) {
						this.$Message.success("初始化工作日成功!");
						this.timeToRender();
						this.sysWorkingDayFind();
					}
				})
			},
			//回到本月
			backInMonth() {
				this.isDay = [];
				this.sysWorkingDayFind();
				this.timeToRender();
			},
			//显示本月有多少天工作日
			sysWorkingDayCount(year, yearMonth) {
				let yM = year + '-' + yearMonth || null; //年月
				let data = {
					year: null,
					yearMonth: yM,
					dateStart: null,
					dateEnd: null
				};
				this.$global.sysWorkingDayCount(data, d => {
					if(d.success) {
						this.dayCount = d.data;
					}
				})
			}
		},
		mounted() { //一进来加载时间
			this.timeToRender();
			this.sysWorkingDayFind();

		}
	};
</script>

<style>
	div.ivu-card-head {
		padding-bottom: 0;
	}
	
	.current,
	.prev,
	.next {
		width: 14%;
		text-align: center;
		font-size: 25px;
		font-weight: 600;
		height: 65px;
		line-height: 65px;
		padding: 10px;
	}
	
	.prev,
	.next {
		color: #ddd;
	}
	
	.active {
		background: #00b4ff;
		color: #fff;
		padding: 10px;
		border-radius: 5px;
		box-shadow: 1px 1px 1px red;
	}
	
	.active::after {
		content: "工作日";
		font-size: 12px;
	}
</style>