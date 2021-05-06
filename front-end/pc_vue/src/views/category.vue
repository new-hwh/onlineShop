<template>
  <div>
    <el-card>
      <el-button type="primary" icon="el-icon-plus" @click="openAddDialog">添加分类</el-button>
      <el-table :data="categoryList" style="width: 60%" row-key="id" border lazy :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column label="#" type="index" />
        <el-table-column prop="name" label="分类名" width="160px" />
        <el-table-column prop="pid" label="分类等级">
          <template slot-scope="{row}">
            <el-tag v-if="!row.pid">一级分类</el-tag>
            <el-tag v-else type="warning">二级分类</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="openEditDialog(row)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="delCate(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加分类弹出框 -->
    <el-dialog title="添加分类" :visible.sync="addDialog" width="40%" :before-close="closeAddDialog">
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="父分类？" prop="pid">
          <el-select v-model="addForm.pid" placeholder="父分类或一级分类">
            <el-option label="一级分类" value="" />
            <el-option v-for="(item, index) in firstGoryList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddDialog">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类弹出框 -->
    <el-dialog title="添加分类" :visible.sync="editDialog" width="40%" :before-close="closeEditDialog">
      <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="父分类？" prop="pid">
          <el-select v-model="editForm.pid" placeholder="父分类或一级分类">
            <el-option label="一级分类" value="" />
            <el-option v-for="(item, index) in firstGoryList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
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
import { getCategoryList, getFirstCategoryList, addCategory, deleteCategory, editCategory } from '@/api/category'

export default {
  data() {
    return {
      addDialog: false,
      categoryList: [],
      firstGoryList: [],
      addForm: {
        name: '',
        pid: ''
      },
      addRules: {
        name: [{ required: true, message: '请输入分类名字', trigger: 'blur' }]
      },
      editDialog: false,
      editForm: {
        name: '',
        pid: ''
      },
      editRules: {
        name: [{ required: true, message: '请输入分类名字', trigger: 'blur' }]
      },
      updateId: ''
    }
  },

  created() {
    this.getCategoryList()
  },

  methods: {
    async getCategoryList() {
      const res = await getCategoryList()
      if (res.code === 200) {
        this.categoryList = res.data
      }
    },

    async getFirstCategoryList() {
      const res = await getFirstCategoryList()
      console.log(res)
      if (res.code === 200) {
        this.firstGoryList = res.data
      }
    },

    openAddDialog() {
      this.getFirstCategoryList()
      this.addDialog = true
    },

    addCategory() {
      this.$refs['addForm'].validate(async(valid) => {
        if (valid) {
          this.$confirm('此操作将新增一个新的分类, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const res = await addCategory(this.addForm)
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '新增成功!'
              })
            }
            this.getCategoryList()
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
        const res = await deleteCategory(id)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
        this.getCategoryList()
      })
    },

    openEditDialog(row) {
      this.getFirstCategoryList()
      this.editForm.name = row.name
      if (!row.pid) { this.editForm.pid = '' } else this.editForm.pid = row.pid
      this.updateId = row.id
      this.editDialog = true
    },

    updateCate() {
      this.$confirm('此操作将修改该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await editCategory(this.updateId, this.editForm)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.editDialog = false
          this.$refs['editForm'].resetFields()
        }
        this.getCategoryList()
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
