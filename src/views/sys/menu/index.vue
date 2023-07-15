<template>
  <div class="app-container">
    <el-card>
      <el-form :model="menuForm" :inline="true">
        <el-form-item label="菜单名称">
          <el-input v-model="menuForm.name" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单状态">
          <el-select v-model="menuForm.enable" placeholder="请选择菜单状态">
            <el-option label="开启" :value="1"></el-option>
            <el-option label="关闭" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-button icon="el-icon-search" @click="searchMenu()">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetSearch()">重置</el-button>
        <el-button icon="el-icon-plus" type="primary" @click="addOrUpdate()">新增</el-button>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="menuData" v-loading="menuLoading" row-key="id" :tree-props="{ children: 'children' }">
        <el-table-column label="菜单名称" prop="name" align="center" header-align="center"></el-table-column>
        <el-table-column label="图标" prop="icon" align="center" header-align="center"></el-table-column>
        <el-table-column label="权限标识" prop="permission" align="center" header-align="center"></el-table-column>
        <el-table-column label="组件路径" prop="path" align="center" header-align="center"></el-table-column>
        <el-table-column label="组件名称" prop="component" align="center" header-align="center"></el-table-column>
        <el-table-column label="状态" prop="enable" align="center" header-align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enable === 1">开启</el-tag>
            <el-tag v-if="scope.row.enable === 0" type="danger">关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="addOrUpdate(scope.row.id)">修改</el-button>
            <el-button type="text" @click="addOrUpdate(scope.row.id, scope.row.parentId, scope.row.name)">新增</el-button>
            <el-button type="text" style="color: red;" @click="handleRemoveMenu(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <add-or-update ref="addOrUpdate" v-if="addOrUpdateVisible" @refreshDataList="resetSearch()" />
  </div>
</template>

<script>
import api from '@/api/sys/menu'
import AddOrUpdate from './add-or-update.vue'

export default {
  data() {
    return {
      menuForm: {
        name: undefined,
        enable: undefined
      },
      menuData: [],
      menuLoading: true,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  created() {
    this.fetchMenuList()
  },
  methods: {
    fetchMenuList() {
      api.routes(this.menuForm).then(res => {
        this.menuLoading = false
        this.menuData = res
      })
    },
    searchMenu() {
      this.menuLoading = true
      this.fetchMenuList()
    },
    resetSearch() {
      this.menuForm.name = undefined
      this.menuForm.enable = undefined
      this.menuLoading = true
      this.fetchMenuList()
    },
    addOrUpdate(menuId) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs['addOrUpdate'].init(menuId)
      })
    },
    handleRemoveMenu(menuId) {
      this.$alert('确定要删除该菜单？', '系统提示', {
        confirmButtonText: '确定',
        callback: action => {
          api.removeMenu(menuId).then(res => {
            this.$message.success('删除成功')
            this.resetSearch()
          })
        }
      })
    }
  }
}
</script>