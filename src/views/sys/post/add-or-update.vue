<template>
  <el-dialog :title="this.dataForm.id === undefined ? '新增' : '修改'" :visible.sync="visible">
    <el-form :model="dataForm" label-width="80px" ref="dataForm">
      <el-form-item label="岗位标题" prop="name" required>
        <el-input v-model="dataForm.name" placeholder="请输入岗位标题"></el-input>
      </el-form-item>
      <el-form-item label="岗位编码" prop="code" required>
        <el-input v-model="dataForm.code" placeholder="请输入岗位编码"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status" required>
        <el-select v-model="dataForm.status" placeholder="请选择岗位状态">
          <el-option label="开启" :value="1"></el-option>
          <el-option label="关闭" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="请输入备注" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/api/sys/post'

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: undefined,
        name: undefined,
        code: undefined,
        status: undefined,
        remark: undefined
      }
    }
  },
  methods: {
    init(postId) {
      this.visible = true
      this.$refs.dataForm.resetFields()
      this.dataForm.id = postId
      this.$nextTick(() => {
        if (this.dataForm.id !== undefined) {
          this.fetchPostInfo()
        }
      })
    },
    dataSubmit() {
      const request = this.dataForm.id === undefined ? api.addPost(this.dataForm) : api.updatePost(this.dataForm)
      request.then(res => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.visible = false
            this.$emit('refreshDataList')
            this.$refs['dataForm'].resetFields()
          }
        })
      })
    },
    fetchPostInfo() {
      api.getPostInfo(this.dataForm.id).then(res => {
        this.dataForm.name = res.name
        this.dataForm.status = res.status
        this.dataForm.code = res.code
        this.dataForm.remark = res.remark
      })
    }
  }
}
</script>