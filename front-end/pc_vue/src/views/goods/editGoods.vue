<template>
  <div>
    <el-card class="container">
      <!-- 添加商品表单区域 -->
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="editForm.name" style="width: 350px" />
            </el-form-item>
            <el-form-item label="商品分类" prop="cate_id">
              <el-cascader v-model="editForm.cate_id" :options="categoryList" :props="prop" clearable />
            </el-form-item>
            <el-form-item label="商品状态" prop="state">
              <el-select v-model="editForm.state" placeholder="请选择商品状态" clearable>
                <el-option label="上架" value="up" />
                <el-option label="下架" value="down" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="商品单价" prop="unit_code">
              <el-input v-model="editForm.unit_code" type="number" style="width: 350px" />
            </el-form-item>
            <el-form-item label="显示图片" prop="showPic">
              <el-upload class="upload-demo" action="http://127.0.0.1:7001/tools/uploadShowPic" :on-remove="handleRemove" :on-success="handleSuccess">
                <el-button size="small" type="primary" :disabled="disabled">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传一张图片文件</div>
              </el-upload>
              <el-image :src="editForm.show_pic">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="商品描述" prop="description">
          <el-input v-model="editForm.description" type="textarea" rows="6" />
        </el-form-item>
      </el-form>
      <el-row :gutter="20">
        <el-col :span="4" :offset="20">
          <el-button type="warning" @click="resetForm">重置</el-button>
          <el-button type="primary" @click="editGoods">修改</el-button>
        </el-col>
      </el-row>

    </el-card>
  </div>
</template>

<script>
import { getCategoryList } from '@/api/category'
import { delFile } from '@/api/tools'
import { editGoods, getGoods } from '@/api/goods'

export default {
  data() {
    return {
      prop: { emitPath: false, expandTrigger: 'hover', label: 'name', value: 'id' },
      categoryList: [],
      editForm: {
        name: '',
        cate_id: '',
        state: '',
        unit_code: '',
        description: '',
        show_pic: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { max: 50, message: '最长20个字符', trigger: 'blur' }
        ],
        cate_id: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
        state: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
        unit_code: [{ required: true, message: '请输入商品单价', trigger: 'blur' }],
        description: []
      },
      disabled: false
    }
  },

  created() {
    this.getCategoryList()
    this.getGoods(this.$route.query.id)
  },

  methods: {
    //   获取商品信息
    async getGoods(id) {
      const res = await getGoods(id)
      if (res.code === 200) {
        this.editForm = res.data
      }
    },

    async getCategoryList() {
      const res = await getCategoryList()
      if (res.code === 200) {
        this.categoryList = res.data
      }
    },

    async handleRemove(file) {
      this.disabled = false
      this.editForm.show_pic = ''
      await delFile(file.response.url)
    },
    handleSuccess(response) {
      this.disabled = true
      this.editForm.show_pic = response.url
    },

    async resetForm() {
      this.$refs['editForm'].resetFields()
      await delFile(this.editForm.show_pic)
      this.editForm.show_pic = ''
      this.disabled = false
    },

    async editGoods() {
      this.$refs['editForm'].validate(async(valid) => {
        if (valid) {
          this.$confirm('此操作将修改该商品的信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const res = await editGoods(this.$route.query.id, this.editForm)
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.$router.push('/goods')
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
