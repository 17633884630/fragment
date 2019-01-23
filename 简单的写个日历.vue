<template>
	<div>
		<Card>
			<div slot="title" style="margin-bottom: 10px;">
				<div style="margin-bottom: 10px;">
					<h2 style="text-align: center;">{{yearMonth}}</h2>
				</div>
				<!---->
				<DatePicker type="month" v-model="dateValue" format="yyyy-MM" placeholder="请输入日期" :clearable="true" @on-change="onChange"></DatePicker>
				<Button type="primary" @click="initClick">初始化工作日</Button>
				<div style="float: right;">
					<span style="padding-right: 20px;">当月工作日总天数: {{dayCount}} 天</span>
					<Button type="primary" @click="backInMonth">回到本月</Button>
				</div>
			</div>
			<Row type="flex">
				<Col class="current" :lg="3" v-for="(item,index) in weeks" :key="value">{{item}}</Col>
				<Col class="prev" v-for="(item,index) in prev" :key="value">{{item}}</Col>
				<Col class="current" :lg="3" v-for="(item,index) in current" :key="value">
				<span @click="onClicks(item)" style="cursor: pointer;" :class="isDay.indexOf(item) !== -1   ? 'active':''">
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
				year: "",
				month: "",
				weeks: ['日', '一', '二', '三', '四', '五', '六'],
				prev: [],
				current: [], //现在月数
				next: [],
				req: {
					year: "",
					yearMonth: ""
				},
				yearMonth: "",
				isDay: [], //当前工作日
				dateValue: null,
				formatting: "",
			}
		},
		methods: {
			timePage(year, month) {
				let date = new Date()
				this.year = year || date.getFullYear() //当年 () || this.dateValue.getFullYear()
				this.month = month || date.getMonth() + 1 //当月 || () this.dateValue.getMonth() + 1
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
				//处理月份不为MM格式
				let months = this.month <= 9 ? "0" + this.month : this.month;
				//加载工作日(参数:2019-01)
				if(typeof(this.month) === "number") {
					this.yearMonth = this.year + "-" + months;
				} else {
					this.yearMonth = this.year + "-" + this.month;
				}
				this.sysWorkingDayFind(this.yearMonth);
			},
			//点击时间选择器触发事件
			onChange(formatting, current) {
				//为了清空输入框无影响
				if(formatting !== "") {
					let year = formatting.substring(0, 4);
					let month = formatting.substring(formatting.length - 2)
					this.formatting = formatting;
					this.timePage(year, month);
					//					this.sysWorkingDayFind(formatting);
				}
			},
			//获取工作日列表
			sysWorkingDayFind(time) {
				this.yearMonth = time;
				this.req.yearMonth = time;
				this.$global.sysWorkingDayFind(this.req, d => {
					if(d.success) {
						var list = [],
							ids = {};
						this.isDay = [];
						$.each(d.data, (i, d) => {
							let m = parseInt(d.workDate.substring(5, 7));
							let days = parseInt(d.workDate.substr(d.workDate.length - 2, 2))
							ids['num_' + days] = d.id;
							list.push(days)
						});
						this.isDay = list;
						this.ids = ids;
						this.dayCount = d.data.length; //当月工作日总天数
						this.dateValue = null;
					}
				})
			},
			//回到本月
			backInMonth() {
				let times = new Date();
				let year = times.getFullYear();
				let month = times.getMonth() + 1;
				month = month <= 9 ? "0" + month : month;
				this.timePage(year, month);
				//				this.sysWorkingDayFind(year + "-" + month);
			},
			//初始化工作日
			initClick() {
				let times = new Date();
				let year = times.getFullYear();
				let month = times.getMonth() + 1;
				month = month <= 9 ? "0" + month : month;
				this.$global.sysWorkingDayInit(this.year, d => {
					if(d.data) {
						this.$Message.success("初始化工作日成功!");
						this.timePage(year, month);
						//						this.sysWorkingDayFind(year + "-" + month);
					}
				})
			},
			//点击新增,修改工作日
			onClicks(days) {
				let cName = event.target.className;
				let year = this.yearMonth.substring(0, 4);
				let month = this.yearMonth.substring(this.yearMonth.length - 2)
				if(cName === "active") {
					this.$Modal.confirm({
						title: "提示",
						content: "您确定 删除 工作日吗？",
						onOk: () => {
							let id = this.ids['num_' + days];
							this.$global.sysWorkingDayDelete(id, d => {
								if(d.success) {
									this.$Message.success("删除成功!");
									this.sysWorkingDayFind(year + "-" + month);
								}
							})
						}
					});
				} else {
					this.$Modal.confirm({
						title: "提示",
						content: "您确定 设置 成工作日吗？",
						onOk: () => {
							let times = this.yearMonth + '-' + days;
							let data = {
								workDate: times
							}
							this.$global.sysWorkingDayAdd(data, d => {
								if(d.success) {
									this.$Message.success("设置成功!");
									this.sysWorkingDayFind(year + "-" + month);
								}
							})
						}
					});
				}
			}
		},
		created() {
			this.timePage();
		}
	}
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
	/*上个月,下个月 制空*/
	
	.prev,
	.next {
		/*color: #ddd;*/
		color: transparent;
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