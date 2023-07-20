<template>
  <div class="app-container">
    <el-card>
      <el-form :model="dataForm" :inline="true" ref="dataForm">
        <el-form-item label="客户端编号" prop="clientId">
          <el-input v-model="dataForm.clientId" placeholder="请输入客户端编号"></el-input>
        </el-form-item>
        <el-button icon="el-icon-search" @click="searchToken()">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetSearch()">重置</el-button>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="tokenList">
        <el-table-column label="访问令牌" prop="accessTokenValue" show-overflow-tooltip align="center"
          header-align="center"></el-table-column>
        <el-table-column label="刷新令牌" prop="refreshTokenValue" show-overflow-tooltip align="center"
          header-align="center"></el-table-column>
        <el-table-column label="客户端编号" prop="principalName" align="center" header-align="center"></el-table-column>
        <el-table-column label="访问令牌过期时间" prop="accessTokenExpiresAt" align="center"
          header-align="center"></el-table-column>
        <el-table-column label="刷新令牌过期时间" prop="refreshTokenExpiresAt" align="center"
          header-align="center"></el-table-column>
        <el-table-column label="访问令牌签发时间" prop="accessTokenIssuedAt" align="center"
          header-align="center"></el-table-column>
        <el-table-column label="刷新令牌签发时间" prop="refreshTokenIssuedAt" align="center"
          header-align="center"></el-table-column>
        <el-table-column label="操作" align="center" header-align="center">
          <template slot-scope="scope">
            <el-button type="text" style="color: red;" @click="handleRevoke(scope.row)">强退</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="pageParams.page" :limit.sync="pageParams.size"
        @pagination="fetchClientToken" />
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import api from '@/api/sys/oauth2-token'

export default {
  data() {
    return {
      dataForm: {
        clientId: undefined
      },
      loading: true,
      pageParams: {
        page: 1,
        size: 10
      },
      total: 0,
      tokenList: []
    }
  },
  created() {
    this.fetchClientToken()
  },
  components: {
    Pagination
  },
  methods: {
    searchToken() {
      this.loading = true
      this.fetchClientToken()
    },
    resetSearch() {
      this.loading = true
      this.fetchClientToken()
    },
    fetchClientToken() {
      api.clientTokenPageList({ ...this.dataForm, ...this.pageParams }).then(res => {
        this.loading = false
        this.tokenList = res.list
        this.total = res.total
      })
    },
    handleRevoke(row) {
      this.$alert('确定要强退该令牌？', '系统提示', {
        confirmButtonText: '确定',
        callback: action => {
          api.removeToken(row.id).then(res => {
            this.$message.success('强退成功')
            this.resetSearch()
          })
        }
      })
    }
  }
}
</script>