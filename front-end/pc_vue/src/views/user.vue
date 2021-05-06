<template>
  <div>
    <el-card>
      <el-button type="success" icon="el-icon-plus" @click="addDialog = true">新增用户</el-button>

      <!-- 表格区 -->
      <el-table :data="userList" style="width: 100%" border>
        <el-table-column label="#" type="index" />
        <el-table-column prop="name" label="用户名" />
        <el-table-column label="头像">
          <template slot-scope="{row}">
            <el-image :src="row.avatar_img">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="电话号码" />
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="openUpdateDialog(row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUser(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination :current-page="query.page" :page-sizes="[5, 10, 20, 30]" :page-size="query.size" layout="total, sizes, prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>

    <!-- 添加用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="addDialog" width="50%" :before-close="closeAddDialog">
      <el-form ref="addform" :model="addForm" :rules="addRules" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="addForm.phone" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddDialog">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户弹出框 -->
    <el-dialog title="修改用户" :visible.sync="updateDialog" width="50%" :before-close="closeUpdateDialog">
      <el-form ref="updateform" :model="updateForm" :rules="updateRules" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="updateForm.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="updateForm.password" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateForm.email" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="updateForm.phone" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUpdateDialog">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getUserList, addUser, delUser, updateUser } from '@/api/user'

export default {
  data() {
    // 检查邮箱地址合法性
    var checkEmail = (rule, value, callback) => {
      const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (!emailReg.test(value)) {
        callback(new Error('请输入正确的邮箱地址'))
      } else {
        callback()
      }
    }
    // 检查手机号码合法性
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (!phoneReg.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    return {
      total: 0,
      query: {
        page: 1,
        size: 10
      },
      userList: [],
      addDialog: false,
      addForm: {
        name: '',
        password: '',
        email: '',
        phone: ''
      },
      addRules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        phone: [{ validator: checkPhone, trigger: 'blur' }]
      },

      updateDialog: false,
      updateForm: {
        name: '',
        password: '',
        email: '',
        phone: ''
      },
      updateRules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        phone: [{ validator: checkPhone, trigger: 'blur' }]
      },
      updateId: ''
    }
  },

  created() {
    this.getUserList(this.query)
  },

  methods: {
    async getUserList(data) {
      const res = await getUserList(data)
      this.userList = res.data.rows
      this.total = res.data.count
    },

    closeAddDialog() {
      this.addDialog = false
      this.$refs['addform'].resetFields()
    },

    async addUser() {
      this.$refs['addform'].validate(async(valid) => {
        if (valid) {
          this.$confirm('此操作将新增一个用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const res = await addUser(this.addForm)
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '新增成功!'
              })
            }
            this.getUserList(this.query)
            this.addDialog = false
            this.$refs['addform'].resetFields()
          })
        }
      })
    },

    handleSizeChange(size) {
      this.query.size = size
      this.getUserList(this.query)
    },

    handleCurrentChange(currentPage) {
      this.query.page = currentPage
      this.getUserList(this.query)
    },

    delUser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await delUser(id)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
        this.getUserList(this.query)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    async openUpdateDialog(rows) {
      this.updateId = rows.id
      this.updateForm = rows
      this.updateDialog = true
    },

    updateUser() {
      this.$refs['updateform'].validate(async(valid) => {
        if (valid) {
          this.$confirm('此操作将修改用户信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const res = await updateUser(this.updateId, this.updateForm)
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
            }
            this.getUserList(this.query)
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
