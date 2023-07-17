<template>
  <el-dialog title="菜单权限" :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm">
      <el-form-item label="角色名称">
        <el-tag>{{ dataForm.roleName }}</el-tag>
      </el-form-item>
      <el-form-item label="角色标识">
        <el-tag>{{ dataForm.code }}</el-tag>
      </el-form-item>
      <el-form-item label="菜单权限">
        <el-card v-loading="loading">
          <el-tree ref="menuTree" :data="menuTree" :props="{ label: 'name' }" node-key="id" show-checkbox></el-tree>
        </el-card>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/api/sys/menu'

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        roleId: undefined,
        roleName: undefined,
        code: undefined
      },
      menuTree: [],
      loading: true
    }
  },
  methods: {
    init(role) {
      this.visible = true
      this.loading = true
      this.dataForm.roleId = role.id
      this.dataForm.roleName = role.name
      this.dataForm.code = role.code
      this.$nextTick(() => {
        this.fetchMenuList()
      })
    },
    fetchAssignMenuIdList() {
      api.assignMenuIdList(this.dataForm.roleId).then(res => {
        this.loading = false
        this.$refs.menuTree.setCheckedKeys(res)
      })
    },
    fetchMenuList() {
      api.routes().then(res => {
        this.menuTree = res
        this.fetchAssignMenuIdList()
      })
    },
    dataSubmit() {
      api.assignMenu({
        roleId: this.dataForm.roleId,
        menuIds: this.$refs.menuTree.getCheckedKeys()
      }).then(res => {
        this.$message.success('操作成功')
        this.visible = false
        this.$refs['dataForm'].resetFields()
      })
    }
  }
}
</script>