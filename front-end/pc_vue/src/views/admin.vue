<template>
  <div>
    <el-card>
      <el-button type="success" icon="el-icon-plus" @click="addDialog = true">新增用户</el-button>

      <!-- 表格区 -->
      <el-table :data="adminList" style="width: 100%" border>
        <el-table-column label="#" type="index" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column label="权限">
          <template slot-scope="{row}">
            <el-tag v-if="row.role_type === 'superAdmin'">超级管理员</el-tag>
            <el-tag v-if="row.role_type === 'admin'">普通管理员</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="{row}">
            <el-switch v-model="row.state" active-text="启用" inactive-text="禁用" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="openUpdateDialog(row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delAdmin(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination :current-page="query.page" :page-sizes="[5, 10, 20, 30]" :page-size="query.size" layout="total, sizes, prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>

    <!-- 添加用户弹出框 -->
    <el-dialog title="添加管理员" :visible.sync="addDialog" width="50%" :before-close="closeAddDialog">
      <el-form ref="addform" :model="addForm" :rules="addRules" label-width="50px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" />
        </el-form-item>
        <el-form-item label="权限" prop="role_type">
          <el-select v-model="addForm.role_type" placeholder="请选择权限">
            <el-option label="普通管理员" value="admin" />
            <el-option label="超级管理员" value="superAdmin" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="addForm.state" placeholder="请选择状态">
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddDialog">取 消</el-button>
        <el-button type="primary" @click="addAdmin">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户弹出框 -->
    <el-dialog title="添加管理员" :visible.sync="updateDialog" width="50%" :before-close="closeUpdateDialog">
      <el-form ref="updateform" :model="updateForm" :rules="updateRules" label-width="50px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="updateForm.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="updateForm.password" />
        </el-form-item>
        <el-form-item label="权限" prop="role_type">
          <el-select v-model="updateForm.role_type" placeholder="请选择权限">
            <el-option label="普通管理员" value="admin" />
            <el-option label="超级管理员" value="superAdmin" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="updateForm.state" placeholder="请选择状态">
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUpdateDialog">取 消</el-button>
        <el-button type="primary" @click="updateAdmin">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getAdminList, addAdmin, delAdmin, updateAdmin, getAdmin } from '@/api/admin'

export default {
  data() {
    return {
      total: 0,
      query: {
        page: 1,
        size: 10
      },
      adminList: [],
      addDialog: false,
      addForm: {
        name: '',
        password: '',
        role_type: '',
        state: ''
      },
      addRules: {
        name: [{ required: true, message: '请输入管理员名字', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        role_type: [{ required: true, message: '请选择管理员权限', trigger: 'blur' }],
        state: [{ required: true, message: '请选择管理员账号状态', trigger: 'blur' }]
      },

      updateDialog: false,
      updateForm: {
        name: '',
        password: '',
        role_type: '',
        state: ''
      },
      updateRules: {
        name: [{ required: true, message: '请输入管理员名字', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        role_type: [{ required: true, message: '请选择管理员权限', trigger: 'blur' }],
        state: [{ required: true, message: '请选择管理员账号状态', trigger: 'blur' }]
      },
      updateId: ''
    }
  },

  created() {
    this.getAdminList(this.query)
  },

  methods: {
    async getAdminList(data) {
      const res = await getAdminList(data)
      this.adminList = res.data
      this.total = res.total
    },

    closeAddDialog() {
      this.addDialog = false
      this.$refs['addform'].resetFields()
    },

    async addAdmin() {
      this.$refs['addform'].validate(async(valid) => {
        if (valid) {
          this.$confirm('此操作将新增一个用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const res = await addAdmin(this.addForm)
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '新增成功!'
              })
            }
            this.getAdminList(this.query)
            this.addDialog = false
            this.$refs['addform'].resetFields()
          })
        }
      })
    },

    handleSizeChange(size) {
      this.query.size = size
      this.getAdminList(this.query)
    },

    handleCurrentChange(currentPage) {
      this.query.page = currentPage
      this.getAdminList(this.query)
    },

    delAdmin(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await delAdmin(id)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
        this.getAdminList(this.query)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    async openUpdateDialog(id) {
      this.updateId = id
      const res = await getAdmin(id)
      this.updateForm = res.data
      this.updateDialog = true
    },

    updateAdmin() {
      this.$refs['updateform'].validate(async(valid) => {
        if (valid) {
          this.$confirm('此操作将修改用户信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const res = await updateAdmin(this.updateId, this.updateForm)
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
            }
            this.getAdminList(this.query)
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
</style>
