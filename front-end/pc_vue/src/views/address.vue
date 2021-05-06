<template>
  <div>
    <el-card>
      <el-button type="primary" icon="el-icon-plus" @click="addDialog = true">添加收货点</el-button>
      <el-table :data="addressList" style="width: 60%" border>
        <el-table-column label="#" type="index" />
        <el-table-column prop="address_name" label="收货点" width="500px" />
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="openEditDialog(row)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="delCate(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加分类弹出框 -->
    <el-dialog title="添加收货点" :visible.sync="addDialog" width="40%" :before-close="closeAddDialog">
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="100px">
        <el-form-item label="收货点" prop="address_name">
          <el-input v-model="addForm.address_name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddDialog">取 消</el-button>
        <el-button type="primary" @click="addAddress">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类弹出框 -->
    <el-dialog title="添加分类" :visible.sync="editDialog" width="40%" :before-close="closeEditDialog">
      <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="分类名称" prop="address_name">
          <el-input v-model="editForm.address_name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditDialog">取 消</el-button>
        <el-button type="primary" @click="updateCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAddressList, addAddress, deleteAddress, editAddress } from '@/api/address'

export default {
  data() {
    return {
      addDialog: false,
      addressList: [],
      addForm: { name: '' },
      addRules: {
        address_name: [{ required: true, message: '请输入收货点名称', trigger: 'blur' }]
      },
      editDialog: false,
      editForm: { address_name: '' },
      editRules: {
        address_name: [{ required: true, message: '请输入收货点名称', trigger: 'blur' }]
      },
      updateId: ''
    }
  },

  created() {
    this.getAddressList()
  },

  methods: {
    async getAddressList() {
      const res = await getAddressList()
      if (res.code === 200) {
        this.addressList = res.data
      }
    },

    addAddress() {
      this.$refs['addForm'].validate(async(valid) => {
        if (valid) {
          this.$confirm('此操作将新增一个新的收货点, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const res = await addAddress(this.addForm)
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '新增成功!'
              })
            }
            this.getAddressList()
            this.addDialog = false
            this.$refs['addForm'].resetFields()
          })
        }
      })
    },

    closeAddDialog() {
      this.addDialog = false
      this.$refs['addForm'].resetFields()
    },

    async delCate(id) {
      this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteAddress(id)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
        this.getAddressList()
      })
    },

    openEditDialog(row) {
      this.editForm.address_name = row.address_name
      this.updateId = row.id
      this.editDialog = true
    },

    updateCate() {
      this.$confirm('此操作将修改该收货点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await editAddress(this.updateId, this.editForm)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.editDialog = false
          this.$refs['editForm'].resetFields()
        }
        this.getAddressList()
      })
    },

    closeEditDialog() {
      this.editDialog = false
      this.$refs['editForm'].resetFields()
    }
  }
}
</script>

<style scoped>
.el-table {
  margin: 20px 0;
}
</style>
