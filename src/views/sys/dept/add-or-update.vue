<template>
  <el-dialog :title="this.dataForm.id === undefined ? '新增' : '修改'" :visible.sync="visible">
    <el-form :model="dataForm" label-width="80px" ref="dataForm">
      <el-form-item label="上级部门" prop="parentId" required>
        <el-select v-model="deptName" placeholder="请选择上级部门">
          <el-option :value="deptTree" style="height: auto;">
            <el-tree :data="deptTree" :props="{ label: 'name' }" node-key="id"
              @node-click="handleDeptNodeClick"></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门名称" prop="name" required>
        <el-input v-model="dataForm.name" placeholder="请输入部门名称"></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="leader">
        <el-select v-model="dataForm.leaderUserId" placeholder="请输入负责人">
          <el-option v-for="item in leaderList" :label="item.nickname" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status" required>
        <el-select v-model="dataForm.status" placeholder="请选择状态">
          <el-option label="开启" :value="1"></el-option>
          <el-option label="关闭" :value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import deptApi from '@/api/sys/dept'
import userApi from '@/api/sys/user'

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: undefined,
        parentId: undefined,
        name: undefined,
        leaderUserId: undefined,
        phone: undefined,
        email: undefined,
        status: undefined
      },
      deptTree: [],
      leaderList: [],
      deptName: undefined
    }
  },
  methods: {
    init(deptId) {
      this.visible = true
      this.$refs['dataForm'].resetFields()
      this.deptName = undefined
      this.leaderUserId = undefined

      this.dataForm.id = deptId
      this.$nextTick(() => {
        this.fetchDeptTree()
        this.fetchLeaderList()
        if (this.dataForm.id !== undefined) {
          this.fetchDeptInfo()
        }
      })
    },
    fetchDeptInfo() {
      deptApi.deptInfo(this.dataForm.id).then(res => {
        this.deptName = res.name
        this.dataForm.id = res.id
        this.dataForm.parentId = res.parentId
        this.dataForm.name = res.name
        this.dataForm.leaderUserId = res.leaderUserId
        this.dataForm.phone = res.phone
        this.dataForm.email = res.email
        this.dataForm.status = res.status
      })
    },
    fetchLeaderList() {
      userApi.leaderList().then(res => {
        this.leaderList = res
      })
    },
    fetchDeptTree() {
      deptApi.deptTree().then(res => {
        this.deptTree = res
      })
    },
    dataSubmit() {
      const request = this.dataForm.id === undefined ? deptApi.addDept(this.dataForm) : deptApi.updateDept(this.dataForm)
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
    handleDeptNodeClick(dept, node, tree) {
      this.dataForm.parentId = dept.id
      this.deptName = dept.name
    }
  }
}
</script>