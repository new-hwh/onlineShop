<template>
  <div>
    <el-card>
      <!-- 状态查询 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="query.searchId" clearable placeholder="根据订单id查找订单" class="searchIpt">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList(query)" />
          </el-input>
        </el-col>

        <el-col :span="6">
          <span class="tip">订单状态：</span>
          <el-select v-model="query.state" placeholder="选择商品状态" clearable @change="getOrderList(query)">
            <el-option value="0" label="未发货" />
            <el-option value="1" label="已发货" />
            <el-option value="2" label="已送达" />
            <el-option value="3" label="已完成" />
          </el-select>
        </el-col>
      </el-row>

      <!-- 表格区 -->
      <el-table ref="multipleTable" :data="GoodsList" style="width: 100%" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" />
        <el-table-column prop="id" label="订单id" width="280px" />
        <el-table-column prop="user.name" label="下单用户" />
        <el-table-column label="订单状态">
          <template slot-scope="{row}">
            <el-tag v-if="row.state === '0'" type="danger">未发货</el-tag>
            <el-tag v-else-if="row.state === '1'" type="warning">已发货</el-tag>
            <el-tag v-else-if="row.state === '2'">已送达</el-tag>
            <el-tag v-else type="success">已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="下单时间" :formatter="formatDate" sortable="" />
        <el-table-column prop="finished_date" label="订单完成时间" :formatter="formatDate" sortable="" />
        <el-table-column label="订单详情">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="openDetailDialog(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :offset="22" :span="2">
          <el-button v-if="editBtnShow" size="small" class="editBtn" type="primary" icon="el-icon-edit" @click="editDialog = true">编辑</el-button>
        </el-col>
      </el-row>

      <!-- 分页区 -->
      <el-pagination :current-page="query.page" :page-sizes="[5, 10, 20, 30]" :page-size="query.size" layout="total, sizes, prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>

    <!-- 订单详情弹出框 -->
    <el-dialog class="orderDetail" title="订单详情" :visible.sync="detailDialog" width="60%" center :before-close="closeDetailDialog">
      <!-- 订单商品详情 -->
      <el-card>
        <el-row v-for="(item,key) in orderDetail" :key="key" :gutter="20" class="goodsContainer">
          <el-col :span="4">
            <el-image class="goodsPic" src="item.goods.show_pic" fit="fill" />
          </el-col>
          <el-col :span="14" class="info">
            <span class="goodsName">{{ item.goods.name }}</span>
          </el-col>
          <el-col :span="2" class="info">
            <span class="goodsNum">x {{ item.good_num }}</span>
          </el-col>
          <el-col :span="4" class="info">
            <span class="goodsName">￥{{ item.goods.unit_code * item.good_num }}</span>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5" offset="19" class="goodsName">总金额 ￥{{ orderCount }}</el-col>
        </el-row>
      </el-card>
      <!-- 配送信息 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="cardTitle">配送信息</span>
        </div>
        <el-row>
          <el-col :span="4" class="title">收货人：</el-col>
          <el-col :span="20">{{ orderInfo.recevice_name }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="title">收货地址：</el-col>
          <el-col :span="20">{{ orderInfo.address_name }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="title">联系电话：</el-col>
          <el-col :span="20">{{ orderInfo.recevice_phone }}</el-col>
        </el-row>
      </el-card>
      <!-- 订单信息 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="cardTitle">订单信息</span>
        </div>
        <el-row>
          <el-col :span="4" class="title">订单号:</el-col>
          <el-col :span="20">{{ orderInfo.id }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="title">下单时间:</el-col>
          <el-col :span="20">{{ getTime(orderInfo.created_at) }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="title">订单备注:</el-col>
          <el-col :span="20">{{ orderInfo.memo }}</el-col>
        </el-row>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDetailDialog">取 消</el-button>
        <el-button type="primary" @click="closeDetailDialog">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 状态选择弹出框 -->
    <el-dialog title="修改商品状态" :visible.sync="editDialog" width="30%" :before-close="handleClose">
      <el-select v-model="editState" placeholder="请选择商品状态">
        <el-option label="未发货" value="0" />
        <el-option label="已发货" value="1" />
        <el-option label="已送达" value="2" />
        <el-option label="已完成" value="3" />
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editOrder">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getOrderList, getOrder, editOrder } from '@/api/order'
import { getOrderDetailList } from '@/api/orderDetail'
import { parseTime } from '@/utils'

export default {
  data() {
    return {
      total: 0,
      query: {
        searchId: '',
        page: 1,
        size: 10,
        state: ''
      },
      GoodsList: [],
      editBtnShow: false,
      detailDialog: false,
      orderInfo: {},
      orderDetail: [],
      orderCount: 0,
      editState: '',
      editDialog: false,
      editIds: []
    }
  },

  created() {
    this.getOrderList(this.query)
  },

  methods: {
    async getOrderList(data) {
      const res = await getOrderList(data)
      this.GoodsList = res.data.rows
      this.total = res.data.count
    },
    // 格式化时间格式
    formatDate(row, column) {
      if (!row[column.property]) {
        return null
      }
      const date = new Date(row[column.property])
      return parseTime(date)
    },
    // 页面显示数量改变
    handleSizeChange(size) {
      this.query.size = size
      this.getOrderList(this.query)
    },
    // 当前页码改变
    handleCurrentChange(currentPage) {
      this.query.page = currentPage
      this.getOrderList(this.query)
    },

    // 多选商品按钮
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.editBtnShow = true
      } else {
        this.editBtnShow = false
      }
      var res = []
      val.forEach(item => {
        res.push(item.id)
      })
      this.editIds = res

      console.log(this.editIds)
    },

    async openDetailDialog(row) {
      this.orderInfo = row
      const res = await getOrderDetailList(row.id)
      this.orderDetail = res.data
      this.orderDetail.forEach(item => {
        this.orderCount += item.goods.unit_code * item.good_num
      })
      this.orderCount = this.orderCount.toFixed('2')
      this.detailDialog = true
    },

    closeDetailDialog() {
      this.detailDialog = false
      this.orderInfo = {}
      this.orderDetail = []
      this.orderCount = 0
    },

    getTime(time) {
      if (!time) return null
      const date = new Date(time)
      return parseTime(date)
    },

    editOrder() {
      this.$confirm('此操作将修改中订单的状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.editIds.forEach(async item => {
          await editOrder(item, { state: this.editState })
        })
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        await this.getOrderList(this.query)
        this.editDialog = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-table{
    margin: 20px 0 20px 0;
  }

  .tip{
    color: #909399;
    font-weight: 700;
  }

  .goodsContainer{
    margin-bottom: 10px;

    .goodsPic{
      width: 70px;
      height: 70px;
    }

    .info {
      margin-top: 16px;

      .goodsNum {
        display: block;
        color: #6f7277;
      }
    }
  }

  .goodsName{
    display: block;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 700;
  }

  .orderDetail {
    .el-card {
      margin-bottom: 10px;
    }

    .cardTitle {
      font-weight: 700;
      font-size: 16px;
    }

    .title {
      color: #909399;
      font-weight: 700;
      font-size: 16px;
    }

    .box-card {
      .el-row {
        margin-bottom: 10px;
      }
    }
  }

</style>
