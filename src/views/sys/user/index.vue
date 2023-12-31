<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <el-input v-model="deptName" placeholder="请输入部门名称"></el-input>
          <el-tree :data="deptData" node-key="id" :default-expand-all="true" style="margin-top: 10px;"
            @node-click="handleDeptClick" :expand-on-click-node="false" />
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card>
          <el-form ref="userForm" :inline="true" :model="userForm" label-width="70px">
            <el-form-item label="用户名称">
              <el-input v-model="userForm.username" placeholder="请输入用户名称"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input v-model="userForm.phone" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="userForm.status" placeholder="用户状态">
                <el-option label="开启" value="1" />
                <el-option label="关闭" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker v-model="userForm.dateSection" type="daterange" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" />
            </el-form-item>
          </el-form>
          <el-button icon="el-icon-search" @click="searchUser()">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetSearch()">重置</el-button>
          <el-button icon="el-icon-plus" type="primary" @click="addOrUpdate()">新增</el-button>
          <el-button icon="el-icon-top" type="warning">导入</el-button>
          <el-button icon="el-icon-bottom" type="success">导出</el-button>
        </el-card>
        <el-card style="margin-top: 20px;">
          <el-table :data="userData" v-loading="userLoading">
            <el-table-column label="用户编号" prop="id" align="center" header-align="center" />
            <el-table-column label="用户名称" prop="username" align="center" header-align="center" />
            <el-table-column label="用户昵称" prop="nickname" align="center" header-align="center" />
            <el-table-column label="部门" prop="deptName" align="center" header-align="center" />
            <el-table-column label="手机号码" prop="mobile" align="center" header-align="center" />
            <el-table-column label="状态" prop="status" align="center" header-align="center">
              <template slot-scope="scope">
                <el-switch :value="scope.row.status === 1" @change="changeStatus(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" align="center" header-align="center" width="160px" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="addOrUpdate(scope.row.id)">修改</el-button>
                <el-dropdown style="margin-left: 10px;" @command="handleCommand">
                  <el-button type="text">更多</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-delete" :command="`delete,${scope.row.id}`">删除</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-lollipop" :command="`reset,${scope.row.id}`">重置密码</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-circle-check"
                      :command="`assign,${scope.row.id}`">分配角色</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total > 0" :total="total" :page.sync="pageParams.page" :limit.sync="pageParams.size"
            @pagination="fetchUserPageList" />
        </el-card>
      </el-col>
    </el-row>
    <add-or-update ref="addOrUpdate" v-if="addOrUpdateVisible" @refreshDataList="resetSearch()" />

    <el-dialog title="分配角色" :visible.sync="assignDialogVisible">
      <el-form :model="assignForm" label-width="80px">
        <el-form-item label="用户名称">
          <el-input v-model="assignForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="assignForm.nickname" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="assignForm.roleList" placeholder="请选择角色" multiple>
            <el-option v-for="item in roleList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="assignRole()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import deptApi from '@/api/sys/dept'
import userApi from '@/api/sys/user'
import roleApi from '@/api/sys/role'
import Pagination from '@/components/Pagination'
import AddOrUpdate from './add-or-update.vue'

export default {
  data() {
    return {
      deptData: [],
      deptName: '',
      userForm: {
        username: undefined,
        phone: undefined,
        status: undefined,
        dateSection: [],
        deptId: undefined
      },
      userData: [],
      userLoading: true,
      total: 0,
      pageParams: {
        page: 1,
        size: 10
      },
      addOrUpdateVisible: false,
      assignForm: {
        userId: undefined,
        username: undefined,
        nickname: undefined,
        roleList: []
      },
      roleList: [],
      assignDialogVisible: false
    }
  },
  components: {
    Pagination, AddOrUpdate
  },
  created() {
    this.fetchDepts()
    this.fetchUserPageList()
  },
  methods: {
    fetchDepts() {
      deptApi.deptTree().then(res => {
        if (!res) {
          this.$message.error('部门列表为空');
        }
        this.deptData = this.generateTree(res)
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
    fetchUserPageList() {
      let userParams = {
        startTime: this.userForm.dateSection[0],
        endTime: this.userForm.dateSection[1],
        username: this.userForm.username,
        mobile: this.userForm.phone,
        status: this.userForm.status,
        deptId: this.userForm.deptId
      }
      userApi.userPageList({ ...this.pageParams, ...userParams }).then(res => {
        this.userLoading = false
        this.userData = res.list
        this.total = res.total
      }).catch(error => {
        this.userLoading = false
      })
    },
    searchUser() {
      this.userLoading = true
      this.fetchUserPageList()
    },
    resetSearch() {
      this.userForm.dateSection = []
      this.userForm.username = undefined
      this.userForm.status = undefined
      this.userForm.phone = undefined
      this.userForm.deptId = undefined
      this.userLoading = true
      this.pageParams.page = 1
      this.userData = []

      this.fetchUserPageList()
    },
    changeStatus(row) {
      row.status = row.status == 1 ? 0 : 1
      userApi.changeUserStatus({
        id: row.id,
        status: row.status
      }).then(res => {
        this.$message.success('修改成功')
      }).catch(error => {
        console.log(error);
        this.$message.error('修改失败')
      })
    },
    addOrUpdate(userId) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(userId)
      })
    },
    handleDeptClick(dept, node, tree) {
      this.userForm.deptId = dept.id
      this.userLoading = true
      this.fetchUserPageList()
    },
    handleCommand(command) {
      const commandArray = command.split(',')
      const cmd = commandArray[0]
      const userId = commandArray[1]

      if (cmd === 'delete') {
        this.$alert('确定要删除该用户？', '系统提示', {
          confirmButtonText: '确定',
          callback: action => {
            userApi.deleteUser(userId).then(res => {
              this.$message.success('删除成功')
              this.resetSearch()
            })
          }
        })
      } else if (cmd === 'reset') {
        this.$prompt('请输入密码', '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          userApi.resetPassword({ id: userId, password: value })
            .then(res => {
              this.$message({
                type: 'success',
                message: '重置成功'
              });
            })
        })
      } else if (cmd === 'assign') {
        this.assignForm.userId = undefined
        this.assignForm.username = undefined
        this.assignForm.nickname = undefined
        this.roleList = []
        this.assignDialogVisible = true
        userApi.getUserInfo(userId).then(res => {
          this.assignForm.userId = res.id
          this.assignForm.username = res.username
          this.assignForm.nickname = res.nickname
          this.assignForm.roleList = res.roleIds
        })
        roleApi.fetchRoleList().then(res => {
          this.roleList = res
        })
      }
    },
    assignRole() {
      roleApi.assign({
        userId: this.assignForm.userId,
        roleIds: this.assignForm.roleList
      }).then(res => {
        this.$message.success('分配成功')
        this.assignDialogVisible = false
      })
    }
  }
}
</script>