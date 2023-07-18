<template>
  <div class="app-container">
    <el-card>
      <el-form :model="postForm" :inline="true" ref="postForm">
        <el-form-item label="岗位名称" prop="name">
          <el-input v-model="postForm.name" placeholder="请输入岗位名称"></el-input>
        </el-form-item>
        <el-form-item label="岗位编码" prop="code">
          <el-input v-model="postForm.code" placeholder="请输入岗位编码"></el-input>
        </el-form-item>
        <el-form-item label="岗位状态">
          <el-select v-model="postForm.status" placeholder="请选择岗位状态">
            <el-option label="开启" :value="1"></el-option>
            <el-option label="关闭" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-button icon="el-icon-search" @click="searchPost()">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetSearch()">重置</el-button>
        <el-button icon="el-icon-plus" type="primary" @click="addOrUpdate()">新增</el-button>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px;">
      <el-table :data="postList" row-key="id" border default-expand-all v-loading="loading">
        <el-table-column label="岗位编号" prop="id" align="center" header-align="center"></el-table-column>
        <el-table-column label="岗位名称" prop="name" align="center" header-align="center"></el-table-column>
        <el-table-column label="岗位编码" prop="code" align="center" header-align="center"></el-table-column>
        <el-table-column label="岗位备注" prop="remark" align="center" header-align="center"></el-table-column>
        <el-table-column label="状态" align="center" header-align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1">开启</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 0">关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" header-align="center"></el-table-column>
        <el-table-column label="操作" align="center" header-align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="addOrUpdate(scope.row.id)">编辑</el-button>
            <el-button type="text" style="color: red;" @click="handleRemovePost(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="pageParams.page" :limit.sync="pageParams.size"
        @pagination="fetchPostPageList" />
    </el-card>
    <add-or-update ref="addOrUpdate" v-if="addOrUpdateVisible" @refreshDataList="resetSearch()" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import AddOrUpdate from './add-or-update.vue'
import api from '@/api/sys/post'

export default {
  data() {
    return {
      postForm: {
        name: undefined,
        code: undefined,
        status: undefined
      },
      postList: [],
      total: 0,
      pageParams: {
        page: 0,
        size: 10
      },
      loading: true,
      addOrUpdateVisible: false
    }
  },
  components: {
    Pagination,
    AddOrUpdate
  },
  created() {
    this.fetchPostPageList()
  },
  methods: {
    fetchPostPageList() {
      api.postPageList({ ...this.pageParams, ...this.postForm }).then(res => {
        this.loading = false
        this.postList = res.list
        this.total = res.total
      })
    },
    searchPost() {
      this.loading = true
      this.fetchPostPageList()
    },
    resetSearch() {
      this.loading = true
      this.$refs.postForm.resetFields()
      this.fetchPostPageList()
    },
    addOrUpdate(postId) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(postId)
      })
    },
    handleRemovePost(postId) {
      this.$alert('确定要删除该部门？', '系统提示', {
        confirmButtonText: '确定',
        callback: action => {
          api.removePost(postId).then(res => {
            this.$message.success('删除成功')
            this.resetSearch()
          })
        }
      })
    }
  }
}
</script>