<template>
  <div>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="query.search" clearable placeholder="请输入内容" class="searchIpt">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList(query)" />
          </el-input>
        </el-col>

        <el-col :span="6">
          <span class="tip">商品分类：</span>
          <el-cascader v-model="test.cate_id" :options="categoryList" :props="prop" clearable placeholder="选择商品分类" />
        </el-col>

        <el-col :span="6">
          <span class="tip">商品状态：</span>
          <el-select v-model="value" placeholder="选择商品状态">
            <el-option value="up" label="已上架" />
            <el-option value="down" label="为上架" />
          </el-select>
        </el-col>
      </el-row>
      <el-button class="addBtn" type="success" icon="el-icon-plus" @click="$router.push('/goods/addGoods')">新增商品</el-button>

      <!-- 表格区 -->
      <el-table :data="GoodsList" style="width: 100%" border>
        <el-table-column label="#" type="index" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column label="商品图片">
          <template slot-scope="{row}">
            <div @click="imagePreview(row.show_pic)">
              <el-image :src="row.show_pic" style="width: 60px">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="unit_code" label="商品单价" />
        <el-table-column prop="sale_num" label="商品销售数量" />
        <el-table-column label="商品描述" />
        <el-table-column label="状态">
          <template slot-scope="{row}">
            <el-switch v-model="row.state" active-value="up" inactive-value="down" active-text="上架" inactive-text="下架" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260px">
          <template slot-scope="{row}">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="$router.push(`/goods/editGoods?id=${row.id}`)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delGoods(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination :current-page="query.page" :page-sizes="[5, 10, 20, 30]" :page-size="query.size" layout="total, sizes, prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>

    <!-- 图片预览弹出框 -->
    <el-dialog :visible.sync="imageDialog">
      <img width="100%" :src="imageUrl" alt="">
    </el-dialog>

  </div>
</template>

<script>
import { getGoodsList, delGoods, editGoods } from '@/api/goods'
import { getCategoryList } from '@/api/category'

export default {
  data() {
    return {
      total: 0,
      query: {
        search: '',
        page: 1,
        size: 10
      },
      test: {},
      GoodsList: [],
      prop: { emitPath: false, expandTrigger: 'hover', label: 'name', value: 'id' },
      categoryList: [],
      imageDialog: false,
      imageUrl: ''
    }
  },

  created() {
    this.getGoodsList(this.query)
    this.getCategoryList()
  },

  methods: {
    async getGoodsList(data) {
      const res = await getGoodsList(data)
      console.log(res)
      this.GoodsList = res.data.rows
      this.total = res.data.count
    },

    async getCategoryList() {
      const res = await getCategoryList()
      console.log(res)
      if (res.code === 200) {
        this.categoryList = res.data
      }
    },

    imagePreview(url) {
      this.imageDialog = true
      this.imageUrl = url
    },

    handleSizeChange(size) {
      this.query.size = size
      this.getGoodsList(this.query)
    },

    handleCurrentChange(currentPage) {
      this.query.page = currentPage
      this.getGoodsList(this.query)
    },

    delGoods(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await delGoods(id)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
        this.getGoodsList(this.query)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    async openUpdateDialog(row, id) {
      this.updateId = id
      this.updateDialog = true
    },

    updateGoods() {
      this.$refs['updateform'].validate(async(valid) => {
        if (valid) {
          this.$confirm('此操作将修改用户信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const res = await editGoods(this.updateId, this.updateForm)
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
            }
            this.getGoodsList(this.query)
            this.updateDialog = false
            this.$refs['updateform'].resetFields()
          })
        }
      })
    },

    closeUpdateDialog() {
      this.$refs['updateform'].resetFields()
      this.updateDialog = false
    }

  }
}
</script>

<style scoped>
  .el-table {
    margin: 20px 0;
  }

  .tip {
    color: #909399;
    font-weight: 700;
  }

  .addBtn {
    margin: 20px 0 0 0;
  }
</style>
