<template>
  <div class="app-container">
    <el-card>
      <el-form :model="deptForm" :inline="true" ref="deptForm">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="deptForm.name" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="部门状态">
          <el-select v-model="deptForm.status" placeholder="请选择部门状态">
            <el-option label="开启" :value="1"></el-option>
            <el-option label="关闭" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-button icon="el-icon-search" @click="searchDept()">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetSearch()">重置</el-button>
        <el-button icon="el-icon-plus" type="primary" @click="addOrUpdate()">新增</el-button>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px;">
      <el-table :data="deptTree" row-key="id" border default-expand-all>
        <el-table-column label="部门名称" prop="name" align="center" header-align="center"></el-table-column>
        <el-table-column label="负责人" prop="leader" align="center" header-align="center"></el-table-column>
        <el-table-column label="状态" align="center" header-align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1">开启</el-tag>
            <el-tag v-if="scope.row.status === 0" type="danger"></el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" header-align="center"></el-table-column>
        <el-table-column label="操作" align="center" header-align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="addOrUpdate(scope.row.id)">修改</el-button>
            <el-button type="text" style="color: red;" @click="handleRemoveDept(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <add-or-update ref="addOrUpdate" v-if="addOrUpdateVisible" @refreshDataList="resetSearch()" />
  </div>
</template>

<script>
import api from '@/api/sys/dept'
import Pagination from '@/components/Pagination'
import AddOrUpdate from './add-or-update.vue'

export default {
  data() {
    return {
      deptForm: {
        name: undefined,
        status: undefined
      },
      deptTree: [],
      loading: true,
      addOrUpdateVisible: false
    }
  },
  created() {
    this.fetchDeptTree()
  },
  components: {
    Pagination,
    AddOrUpdate
  },
  methods: {
    fetchDeptTree() {
      api.deptTree(this.deptForm).then(res => {
        this.deptTree = res
        this.loading = false
      })
    },
    addOrUpdate(deptId) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(deptId)
      })
    },
    searchDept() {
      this.loading = true
      this.fetchDeptTree()
    },
    resetSearch() {
      this.$refs.deptForm.resetFields()
      this.loading = true
      this.fetchDeptTree()
    },
    handleRemoveDept(deptId) {
      this.$alert('确定要删除该部门？', '系统提示', {
        confirmButtonText: '确定',
        callback: action => {
          api.removeDept(deptId).then(res => {
            this.$message.success('删除成功')
            this.resetSearch()
          })
        }
      })
    }
  },

}
</script>