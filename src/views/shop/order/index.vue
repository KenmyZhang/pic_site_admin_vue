<template>
  <div class="app-container">
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.order_sn" clearable placeholder="订单编号" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery()" />
      <el-input v-model="query.mobile" clearable placeholder="收件人电话" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery()" />
      <el-input v-model="query.name" clearable placeholder="收件人" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery()" />

      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="crud.toQuery()">搜索</el-button>


    </div>
    <!-- 表单渲染 -->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="520px">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="订单状态" prop="order_status">
                 <el-select
              v-model="form.order_status"
              size="small"
              placeholder="订单状态"
              class="filter-item"
              style="width: 90px"
            >
              <el-option
                v-for="item in orderOptions"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
        </el-form-item>
        <el-form-item label="订单价格" prop="order_price">
          <el-input v-model="form.order_price" style="width: 145px;" />
        </el-form-item>


       <el-form-item label="物流名称" prop="shipper_code">
                 <el-select
              v-model="form.shipper_code"
              size="small"
              placeholder="物流名称"
              class="filter-item"
              style="width: 90px"
            >
              <el-option
                v-for="item in shipperCodeOptions"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
        </el-form-item>

        <el-form-item label="物流单号" prop="logistic_code">
          <el-input v-model="form.logistic_code" style="width: 145px;" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" style="width: 380px;" rows="5" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
<el-dialog width="650px" title="物流查询" append-to-body :close-on-click-modal="false" :visible.sync="dialog">
            <!-- <el-table-column prop="shipper_name" v-if="columns.visible('shipper_name')" label="物流公司" />
          <el-table-column prop="logistic_code" v-if="columns.visible('logistic_code')" label="物流订单号" /> -->
<div v-if="logisticsData.length>0">
<div style="margin:0 0 20px 30px">  物流公司：{{logisticsData.shipper_name}}
  物流编号：{{logisticsData.logistic_code}}</div>
   <el-timeline>
    <el-timeline-item
      v-for="(item, index) in logisticsData"
      :key="index"
      :timestamp="item.AcceptTime">
      {{item.AcceptStation}}
    </el-timeline-item>
  </el-timeline>
    </div>
  <el-empty description="空空如也" v-else></el-empty>
</el-dialog>
      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">订单列表</span>
          </div>
          <el-table ref="table" v-loading="crud.loading" highlight-current-row style="width: 100%;" :data="crud.data" @selection-change="crud.selectionChangeHandler" >
            <el-table-column  prop="id" v-if="columns.visible('id')" label="订单id" />
            <el-table-column  prop="order_sn" v-if="columns.visible('order_sn')" label="订单编号" />
            <el-table-column prop="consignee" v-if="columns.visible('consignee')"  label="收货人" />
            <el-table-column prop="full_address" v-if="columns.visible('full_address')"   label="收货地址" />
            <el-table-column prop="mobile" v-if="columns.visible('mobile')" label=" 收件人电话" />
            <el-table-column prop="goods_info" v-if="columns.visible('goods_name')" label=" 商品信息" />


            <el-table-column prop="pay_status" v-if="columns.visible('pay_status')"  label="支付状态" >
              <template slot-scope="scope">
                  <span v-if="scope.row.pay_status==0">待支付</span>
                 <span v-else-if="scope.row.pay_status==1">已支付</span>
                 <span v-else-if="scope.row.pay_status==2">支付失败</span>
                <span v-else-if="scope.row.pay_status==3">已取消</span>
              </template>
           </el-table-column>

            <el-table-column prop="shipping_status" v-if="columns.visible('shipping_status')"  label="物流状态" >
              <template slot-scope="scope">
                <span v-if="scope.row.shipping_status==0">未发货</span>
                <span v-else-if="scope.row.shipping_status==1">已发货</span>
                <span v-else-if="scope.row.shipping_status==2">已签收</span>
                <span v-else-if="scope.row.shipping_status==3">拒收</span>
              </template>
            </el-table-column>

            <el-table-column prop="shipping_type" v-if="columns.visible('shipping_type')"  label="取货方式" >
              <template slot-scope="scope">
                  <span v-if="scope.row.shipping_type==1">快递</span>
                 <span v-else>门店自提</span>
              </template>
           </el-table-column>

          <el-table-column prop="order_status" v-if="columns.visible('order_status')"  label="订单状态" >
              <template slot-scope="scope">
                  <span v-if="scope.row.order_status==0">待支付</span>
                 <span v-else-if="scope.row.order_status==101">订单取消</span>
                 <span v-else-if="scope.row.order_status==102">订单已删除</span>
                 <span v-else-if="scope.row.order_status==201">待发货</span>
                 <span v-else-if="scope.row.order_status==300">已发货</span>
                 <span v-else-if="scope.row.order_status==301">交易完成</span>
                 <span v-else-if="scope.row.order_status==402">退款中</span>
                 <span v-else-if="scope.row.order_status==403">退款成功</span>
              </template>
           </el-table-column>


            <el-table-column prop="order_price" v-if="columns.visible('order_price')"  label="订单价格" />

            <el-table-column v-if="columns.visible('add_time')"   width="135px" prop="createTime" label="创建时间">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.add_time) }}</span>
              </template>
            </el-table-column>
            <el-table-column class-name="www"  label="操作" width="220px"  align="center" fixed="right">
              <template slot-scope="scope">
         <span>           <el-button
            size="mini"
            type="primary"
            @click="toLogistics(scope.row)"
          >
            物流
          </el-button></span>
                <udOperation
                  :txt="'发货'"
                  :data="scope.row"
                  :permission="permission"
                />
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <pagination />
        </el-card>
      </el-col>

  </div>
</template>

<script>
import {getLogistics} from '@/api/shop/StoreOrder'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'


// crud交由presenter持有
const defaultCrud = CRUD({ title: '订单', url: 'shop/order', sort: 'level,asc', order_sn:1,mobile:2,name:3})
const defaultForm = { id: null, name: null, depts: [], remark: null, dataScope: '全部', level: 3, permission: null }
export default {
  name: 'Order',
  components: {  pagination,  udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      dialog:false,
      logisticsData:[],
      order_sn:null,mobile:null,name:null,
      defaultProps: { children: 'children', label: 'label' },
      currentId: 0, menuLoading: false, showButton: false,
      menus: [], menuIds: [], depts: [],
      permission: {
        edit: ['admin', 'roles:edit'],
      },
         activities: [{
          content: '活动按期开始',
          timestamp: '2018-04-15'
        }, {
          content: '通过审核',
          timestamp: '2018-04-13'
        }, {
          content: '创建成功',
          timestamp: '2018-04-11'
        }],
      orderOptions: [
            { key: 0, value: '待支付' },
            { key: 101, value: '订单取消' },
            { key: 102, value: '订单已删除' },
            { key: 201, value: '待发货' },
            { key: 301, value: '确认发货' },
            { key: 402, value: '退款中' },
            {key: 403, value: '退款成功' },
            {key: 600, value: '订单已完成' }
      ],
      shipperCodeOptions: [
         {key: 'SF',value: '顺丰速运'},
         {key: 'HTKY',value: '百世快递'},
         {key: 'ZTO',value: '中通快递'},
         {key: 'STO',value: '申通快递'},
         {key: 'YTO',value: '圆通速递'},
         {key: 'YD',value: '韵达速递'},
         {key: 'YZPY',value: '邮政快递包裹'},
         {key: 'EMS',value: 'EMS'},
         {key: 'JD',value: '京东快递'},
         {key: 'UC',value: '优速快递'},
         {key: 'DBL',value: '德邦快递'},
         {key: 'JTSD',value: '极兔速递'},
         {key: 'ZYE',value: '众邮快递'},
         {key: 'ZJS',value: '宅急送'},
      ],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '请输入权限', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.crud.toQuery()
    })
  },
  methods: {
    toLogistics(row) {
 let id = row.id


      let params = {
        order_id:id
      }
      getLogistics(params).then(res => {
            this.dialog = true
          this.logisticsData = res.data
           this.logisticsData.shipper_name = row.shipper_name
 this.logisticsData.logistic_code = row.logistic_code
      }).catch(err => {

      })
    },
    [CRUD.HOOK.afterAddError](crud) {
      this.afterErrorMethod(crud)
    },
    [CRUD.HOOK.afterEditError](crud) {
      this.afterErrorMethod(crud)
    },
    afterErrorMethod(crud) {
      const depts = []
      crud.form.depts.forEach(function(dept, index) {
        depts.push(dept.id)
      })
      crud.form.depts = depts
    },




  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.www .cell{
  padding: 0 20px;
    display: flex !important;
    justify-content: space-around;
  }
  .www .cell div:nth-child(2){
    display: flex !important;
  }
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }

  </style>
