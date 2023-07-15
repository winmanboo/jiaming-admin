<template>
  <el-dialog :title="this.dataForm.userId != null ? '修改' : '新增'" :visible.sync="visible">
    <el-form ref="dataForm" :model="dataForm" label-width="100px">
      <el-form-item label="角色名称" prop="name" :required="this.dataForm.id === undefined">
        <el-input v-model="dataForm.name" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色标识" prop="code" :required="this.dataForm.id === undefined">
        <el-input v-model="dataForm.code" placeholder="请输入角色标识"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status" :required="this.dataForm.id === undefined">
        <el-select v-model="dataForm.status" placeholder="请选择状态">
          <el-option label="开启" :value="1"></el-option>
          <el-option label="关闭" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="dataForm.remark" type="textarea" placeholder="请输入内容" autosize></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/api/sys/role'

export default {
  data() {
    return {
      dataForm: {
        id: undefined,
        name: undefined,
        code: undefined,
        status: undefined,
        remark: undefined
      },
      visible: false
    }
  },
  methods: {
    init(roleId) {
      this.dataForm.id = roleId
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()

        if (this.dataForm.id !== undefined) {
          this.fetchRoleInfo(this.dataForm.id)
        }
      })
    },
    fetchRoleInfo(roleId) {
      api.fetchRoleInfo(roleId).then(res => {
        this.dataForm.name = res.name
        this.dataForm.code = res.code
        this.dataForm.status = res.status
        this.dataForm.remark = res.remark
      })
    },
    dataSubmit() {
      const request = this.dataForm.id === undefined ? api.addRole(this.dataForm) :
        api.updateRole(this.dataForm)
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
    }
  }
}
</script>