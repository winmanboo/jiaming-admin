<template>
  <div class="app-container">
    <el-card>
      <el-form :model="dataForm" :inline="true" ref="dataForm">
        <el-form-item label="应用名" prop="clientName">
          <el-input v-model="dataForm.clientName" placeholder="请输入应用名"></el-input>
        </el-form-item>
        <el-button icon="el-icon-search" @click="searchClient()">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetSearch()">重置</el-button>
        <el-button icon="el-icon-plus" type="primary" @click="addOrUpdate(undefined, 0)">新增</el-button>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px;">
      <el-table :data="clientList" v-loading="loading">
        <el-table-column label="id" prop="id" align="center" header-align="center"></el-table-column>
        <el-table-column label="客户端编号" prop="clientId" align="center" header-align="center"></el-table-column>
        <el-table-column label="客户端密钥" prop="clientSecret" align="center" header-align="center"
          show-overflow-tooltip></el-table-column>
        <el-table-column label="应用名" prop="clientName" align="center" header-align="center"></el-table-column>
        <el-table-column label="访问令牌有效期" prop="tokenSettingVo.accessTokenTimeToLive" align="center"
          header-align="center"></el-table-column>
        <el-table-column label="刷新令牌有效期" prop="tokenSettingVo.refreshTokenTimeToLive" align="center"
          header-align="center"></el-table-column>
        <el-table-column label="授权类型" prop="authorizationGrantTypes" align="center" header-align="center">
          <template slot-scope="scope">
            <el-tag v-for="item in scope.row.authorizationGrantTypes.split(',')" :key="item">{{ item }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="clientSecretExpiresAt" align="center" header-align="center"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="addOrUpdate(scope.row.id, 1)">编辑</el-button>
            <el-button type="text" style="color: red;">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="pageParams.page" :limit.sync="pageParams.size"
        @pagination="fetchOAuth2ClientPage" />
    </el-card>
    <add-or-update ref="addOrUpdate" v-if="addOrUpdateVisible" @refreshDataList="resetSearch()" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import AddOrUpdate from './add-or-update.vue'
import api from '@/api/sys/oauth2-client'

export default {
  data() {
    return {
      dataForm: {
        clientName: undefined,
      },
      clientList: [],
      total: 0,
      pageParams: {
        page: 1,
        size: 10
      },
      addOrUpdateVisible: false,
      loading: true
    }
  },
  components: {
    Pagination,
    AddOrUpdate
  },
  created() {
    this.fetchOAuth2ClientPage()
  },
  methods: {
    fetchOAuth2ClientPage() {
      api.clientPageList({ ...this.dataForm, ...this.pageParams }).then(res => {
        this.loading = false
        this.clientList = res.list
        this.total = res.total
      })
    },
    searchClient() {
      this.loading = true
      this.fetchOAuth2ClientPage()
    },
    resetSearch() {
      this.$refs.dataForm.resetFields()
      this.page = 1
      this.fetchOAuth2ClientPage()
    },
    addOrUpdate(id, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    }
  }
}
</script>