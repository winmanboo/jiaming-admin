<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <el-input v-model="deptName" placeholder="请输入部门"></el-input>
          <el-tree :data="deptData" :default-expand-all="true" style="margin-top: 10px;" />
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card>
          <el-form :inline="true" :model="deptForm" label-position="left" label-width="80px">
            <el-form-item label="用户名称">
              <el-input v-model="deptForm.username" placeholder="请输入用户名称"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input v-model="deptForm.phone" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-input v-model="deptForm.status" placeholder="用户状态"></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-input v-model="deptForm.createDate" placeholder="创建时间"></el-input>
            </el-form-item>
          </el-form>
          <el-button icon="el-icon-search">搜索</el-button>
          <el-button icon="el-icon-refresh">重置</el-button>
          <el-button icon="el-icon-plus" type="primary">新增</el-button>
          <el-button icon="el-icon-top" type="warning">导入</el-button>
          <el-button icon="el-icon-bottom" type="success">导出</el-button>
        </el-card>
        <el-card style="margin-top: 20px;">
          <el-table :data="userData" v-loading="userLoading">
            <el-table-column label="用户编号" prop="id" />
            <el-table-column label="用户名称" prop="username"></el-table-column>
            <el-table-column label="用户昵称" prop="nickname"></el-table-column>
            <el-table-column label="部门" prop="deptName"></el-table-column>
            <el-table-column label="手机号码" prop="mobile"></el-table-column>
            <el-table-column label="状态" prop="status"></el-table-column>
            <el-table-column label="创建时间" prop="createTime"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="text">修改</el-button>
                <el-button type="text">更多</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total > 0" :total="total" :page.sync="pageParams.page" :limit.sync="pageParams.size"
            @pagination="fetchUserPageList" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import deptApi from '@/api/sys/dept'
import userApi from '@/api/sys/user'
import Pagination from '@/components/Pagination'

export default {
  data() {
    return {
      deptData: [],
      deptName: '',
      deptForm: {
        username: '',
        phone: '',
        status: '',
        createDate: ''
      },
      userData: [],
      userLoading: true,
      total: 0,
      pageParams: {
        page: 0,
        size: 10
      }
    }
  },
  components: {
    Pagination
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
      userApi.userPageList(this.pageParams).then(res => {
        this.userLoading = false
        this.userData = res.list
        this.total = res.total
      }).catch(error => {
        this.userLoading = false
      })
    }
  }
}
</script>