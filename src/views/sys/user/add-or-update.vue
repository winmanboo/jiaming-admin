<template>
  <el-dialog :title="this.dataForm.userId != null ? '修改' : '新增'" :visible.sync="visible">
    <el-form ref="dataForm" :model="dataForm" label-width="100px" :inline="true">
      <el-form-item label="用户昵称" prop="nickname" :required="true">
        <el-input v-model="dataForm.nickname" placeholder="请输入用户昵称"></el-input>
      </el-form-item>
      <el-form-item label="归属部门">
        <el-select v-model="deptName" placeholder="请选择归属部门">
          <el-option :value="deptTree" style="height: auto;">
            <el-tree :data="deptTree" node-key="id" @node-click="handleDeptNode"></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="dataForm.mobile" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="dataForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="用户名称" v-if="dataForm.userId === null" :required="dataForm.userId === null">
        <el-input v-model="dataForm.username" placeholder="请输入用户名称"></el-input>
      </el-form-item>
      <el-form-item label="用户密码" v-if="dataForm.userId === null" :required="dataForm.userId === null">
        <el-input v-model="dataForm.password" placeholder="请输入用户密码"></el-input>
      </el-form-item>
      <el-form-item label="用户性别">
        <el-select v-model="dataForm.sex" placeholder="用户性别">
          <el-option label="男" :value="1"></el-option>
          <el-option label="女" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="岗位">
        <el-select v-model="dataForm.postIds" placeholder="请选择" multiple filterable default-first-option>
          <el-option v-for="item in postList" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
import userApi from '@/api/sys/user'
import deptApi from '@/api/sys/dept'
import postApi from '@/api/sys/post'

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        userId: null,
        username: null,
        nickname: null,
        deptId: null,
        mobile: null,
        email: null,
        password: null,
        sex: null,
        postIds: [],
        status: null,
        remark: null
      },
      deptName: '',
      deptTree: [],
      postList: []
    }
  },
  methods: {
    init(userId) {
      console.log(userId);
      this.dataForm.userId = userId === undefined ? null : userId
      console.log(this.dataForm.userId);
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.deptName = ''
        this.dataForm.mobile = null
        this.deptTree = []
        this.postList = []
        this.fetchDepts()
        this.fetchPostList()
        if (this.dataForm.userId !== null) {
          this.fetchUserInfo(this.dataForm.userId)
        }
      })
    },
    dataSubmit() {
      const request = this.dataForm.userId === null ? userApi.addUser({
        ...this.dataForm,
        postIds: this.dataForm.postIds.join(",")
      }) : userApi.updateUser({
        ...this.dataForm,
        postIds: this.dataForm.postIds.join(","),
        id: this.dataForm.userId,
        username: undefined,
        password: undefined
      })
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
    fetchDepts() {
      deptApi.deptTree().then(res => {
        if (!res) {
          this.$message.error('部门列表为空');
        }
        this.deptTree = this.generateTree(res)
      }).catch(error => {
        this.$message.error(error);
      })
    },
    generateTree(depts) {
      let deptTree = []
      for (let i = 0; i < depts.length; i++) {
        const dept = depts[i]
        let treeItem = {
          id: dept.id,
          label: dept.name,
          children: []
        }
        if (dept.children && dept.children.length > 0) {
          this.getChildDept(treeItem, dept.children)
        }
        deptTree[i] = treeItem
      }
      return deptTree
    },
    getChildDept(treeItem, deptChildrenList) {
      let childrenTree = []
      for (let i = 0; i < deptChildrenList.length; i++) {
        const child = deptChildrenList[i]
        let item = {
          id: child.id,
          label: child.name,
          children: []
        }
        if (child.children && child.children.length > 0) {
          this.getChildDept(item, child.children)
        }
        childrenTree[i] = item
      }
      treeItem.children = childrenTree
    },
    handleDeptNode(dept, node, tree) {
      this.deptName = dept.label
      this.dataForm.deptId = dept.id
    },
    fetchPostList() {
      postApi.postList().then(res => {
        if (!res) {
          this.$message.error('获取岗位列表失败')
        }
        this.postList = res
      }).catch(error => {
        this.$message.error('获取岗位列表失败')
      })
    },
    fetchUserInfo(userId) {
      userApi.getUserInfo(this.dataForm.userId).then(res => {
        this.dataForm.username = res.username
        this.dataForm.nickname = res.nickname
        this.dataForm.deptId = res.deptId
        this.dataForm.mobile = res.mobile
        this.dataForm.email = res.email
        this.dataForm.sex = res.sex
        this.dataForm.postIds = res.postIds
        this.dataForm.status = res.status
        this.dataForm.remark = res.remark
        this.deptName = res.deptName
      }).catch(error => {
        this.$message.error(error)
      })
    }
  }
}
</script>