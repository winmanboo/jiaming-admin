<template>
  <el-dialog :title="type === 0 ? '新增' : '修改'" :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" label-width="160px">
      <el-form-item label="编号" prop="id" required v-if="type === 0">
        <el-input v-model="dataForm.id" placeholder="请输入编号"></el-input>
      </el-form-item>
      <el-form-item label="客户端编号" prop="clientId" required>
        <el-input v-model="dataForm.clientId" placeholder="请输入客户端编号"></el-input>
      </el-form-item>
      <el-form-item label="客户端密钥" prop="clientSecret" required>
        <el-input v-model="dataForm.clientSecret" placeholder="请输入客户端密钥"></el-input>
      </el-form-item>
      <el-form-item label="访问令牌有效期" prop="accessTokenTimeToLive" required>
        <el-input-number v-model="dataForm.accessTokenTimeToLive" :min="1800" :max="86400" label="单位：秒"></el-input-number>
      </el-form-item>
      <el-form-item label="刷新令牌有效期" prop="refreshTokenTimeToLive" required>
        <el-input-number v-model="dataForm.refreshTokenTimeToLive" :min="1800" label="单位：秒"></el-input-number>
      </el-form-item>
      <el-form-item label="授权类型" required>
        <el-select v-model="dataForm.authorizationGrantTypes" placeholder="请输入授权类型" multiple filterable allow-create
          default-first-option>
          <el-option v-for="item in authorizationGrantTypes" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="授权范围" prop="scopes">
        <el-select v-model="dataForm.scopes" placeholder="请输入授权范围" multiple filterable allow-create default-first-option>
        </el-select>
      </el-form-item>
      <el-form-item label="可重定向的 URI 地址" prop="uris" required>
        <el-select v-model="dataForm.redirectUris" placeholder="请输入可重定向的 URI 地址" multiple filterable allow-create
          default-first-option>
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
import api from '@/api/sys/oauth2-client'

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: undefined,
        clientId: undefined,
        clientSecret: undefined,
        clientName: undefined,
        accessTokenTimeToLive: 1800,
        refreshTokenTimeToLive: 86400,
        authorizationGrantTypes: undefined,
        redirectUris: undefined,
        scopes: undefined
      },
      authorizationGrantTypes: [
        'authorization_code',
        'implicit',
        'client_credentials',
        'refresh_token'
      ],
      type: undefined, // 0新增 1修改
    }
  },
  methods: {
    init(id, type) {
      this.visible = true
      this.type = type
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.id = id
        if (this.dataForm.id !== undefined) {
          this.fetchClientInfo()
        }
      })
    },
    fetchClientInfo() {
      api.getClientInfo(this.dataForm.id).then(res => {
        this.dataForm.id = res.id
        this.dataForm.clientId = res.clientId
        this.dataForm.clientSecret = res.clientSecret
        this.dataForm.clientName = res.clientName
        this.dataForm.accessTokenTimeToLive = res.tokenSettingVo.accessTokenTimeToLive
        this.dataForm.refreshTokenTimeToLive = res.tokenSettingVo.refreshTokenTimeToLive
        this.dataForm.authorizationGrantTypes = res.clientAuthenticationMethods.split(',')
        this.dataForm.redirectUris = res.redirectUris.split(',')
        this.dataForm.scopes = res.scopes.split(',')
      })
    },
    dataSubmit() {
      const uris = this.dataForm.redirectUris.join(',')
      const types = this.dataForm.authorizationGrantTypes.join(',')
      const scopes = this.dataForm.scopes.join(',')
      const request = this.type === 0 ? api.registerClient({
        ...this.dataForm, redirectUris: uris, authorizationGrantTypes: types, scopes
      }) : api.updateClient({ ...this.dataForm, redirectUris: uris, authorizationGrantTypes: types, scopes })
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
    }
  }
}
</script>