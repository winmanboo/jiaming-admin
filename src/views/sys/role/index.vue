<template>
  <div class="app-container">
    <el-card>
      <el-form :model="roleForm" :inline="true" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色标识">
          <el-input v-model="roleForm.code" placeholder="请输入角色标识"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="roleForm.status" placeholder="请选择">
            <el-option label="开启" :value="1"></el-option>
            <el-option label="关闭" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="roleForm.roleSection" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" />
        </el-form-item>
      </el-form>
      <el-button icon="el-icon-search" @click="searchRole()">搜索</el-button>
      <el-button icon="el-icon-refresh" @click="resetSearch()">重置</el-button>
      <el-button icon="el-icon-plus" type="primary" @click="addOrUpdate()">新增</el-button>
      <el-button icon="el-icon-bottom" type="success">导出</el-button>
    </el-card>

    <el-card style="margin-top: 20px;">
      <el-table :data="roleData" v-loading="roleLoading">
        <el-table-column label="角色编号" prop="id" align="center" header-align="center" />
        <el-table-column label="角色名称" prop="name" align="center" header-align="center" />
        <el-table-column label="角色标识" prop="code" align="center" header-align="center" />
        <el-table-column label="备注" prop="remark" align="center" header-align="center" />
        <el-table-column label="状态" prop="status" align="center" header-align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1">开启</el-tag>
            <el-tag v-if="scope.row.status === 0" type="danger">关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" header-align="center" width="160px" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="addOrUpdate(scope.row.id)">修改</el-button>
            <el-button type="text" @click="menuPermission(scope.row)">菜单权限</el-button>
            <el-button type="text" style="color: red;" @click="handleRemoveRole(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="pageParams.page" :limit.sync="pageParams.size"
        @pagination="fetchRolePageList" />
    </el-card>
    <add-or-update ref="addOrUpdate" v-if="addOrUpdateVisible" @refreshDataList="resetSearch()" />
    <menu-permission ref="menuPermission" v-if="menuPermissionVisible" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import AddOrUpdate from './add-or-update.vue'
import MenuPermission from './menu-permission.vue'
import roleApi from '@/api/sys/role'

export default {
  data() {
    return {
      roleForm: {
        name: undefined,
        code: undefined,
        status: undefined,
        roleSection: []
      },
      roleData: [],
      roleLoading: true,
      total: 0,
      pageParams: {
        page: 1,
        size: 10
      },
      addOrUpdateVisible: false,
      menuPermissionVisible: false
    }
  },
  components: {
    Pagination,
    AddOrUpdate,
    MenuPermission
  },
  created() {
    this.fetchRolePageList()
  },
  methods: {
    fetchRolePageList() {
      let roleParams = {
        name: this.roleForm.name,
        code: this.roleForm.code,
        status: this.roleForm.status,
        startTime: this.roleForm.roleSection[0],
        endTime: this.roleForm.roleSection[1]
      }
      roleApi.fetchRolePageList({ ...this.pageParams, ...roleParams }).then(res => {
        this.roleLoading = false
        this.roleData = res.list
        this.total = res.total
      }).catch(error => {
        this.roleLoading = false
      })
    },
    searchRole() {
      this.roleLoading = true
      this.fetchRolePageList()
    },
    resetSearch() {
      this.roleForm.roleSection = []
      this.roleForm.name = undefined
      this.roleForm.code = undefined
      this.roleForm.status = undefined
      this.roleLoading = true
      this.pageParams.page = 1
      this.roleData = []

      this.fetchRolePageList()
    },
    addOrUpdate(roleId) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(roleId)
      })
    },
    handleRemoveRole(roleId) {
      this.$alert('确定要删除该角色？', '系统提示', {
        confirmButtonText: '确定',
        callback: action => {
          roleApi.removeRole(roleId).then(res => {
            this.$message.success('删除成功')
            this.roleLoading = true
            this.resetSearch()
          })
        }
      })
    },
    menuPermission(role) {
      this.menuPermissionVisible = true
      this.$nextTick(() => {
        this.$refs.menuPermission.init(role)
      })
    }
  }
}
</script>