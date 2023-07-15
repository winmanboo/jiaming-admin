<template>
  <el-dialog :title="dataForm.menuId === undefined ? '新增' : '修改'" :visible.sync="visible">
    <el-form :model="dataForm" label-width="80px">
      <el-form-item label="上级菜单">
        <el-select v-model="menuName" placeholder="请选择">
          <el-option :value="menuTree" style="height: auto;">
            <el-tree :data="menuTree" :props="{ label: 'name' }" node-key="id" @node-click="handleMenuNode"></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单名称" required>
        <el-input v-model="dataForm.name" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="菜单类型">
        <el-radio-group v-model="menuType">
          <el-radio-button :label="0">目录</el-radio-button>
          <el-radio-button :label="1">菜单</el-radio-button>
          <el-radio-button :label="2">按钮</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单图标" v-if="menuType !== 2">
        <el-input v-model="dataForm.icon" placeholder="请输入菜单图标"></el-input>
      </el-form-item>
      <el-form-item label="路由地址" required v-if="menuType !== 2">
        <el-input v-model="dataForm.path" placeholder="请输入路由地址"></el-input>
      </el-form-item>
      <el-form-item label="组件地址" v-if="menuType === 1">
        <el-input v-model="dataForm.component" placeholder="例如: sys/user"></el-input>
      </el-form-item>
      <el-form-item label="权限标识" v-if="menuType !== 0">
        <el-input v-model="dataForm.permission" placeholder="请输入权限标识"></el-input>
      </el-form-item>
      <el-form-item label="菜单状态" required>
        <el-radio-group v-model="dataForm.enable">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="显示状态" v-if="menuType !== 2">
        <el-radio-group v-model="dataForm.hidden">
          <el-radio :label="true">显示</el-radio>
          <el-radio :label="false">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="总是显示" v-if="menuType !== 2">
        <el-radio-group v-model="dataForm.alwaysShow">
          <el-radio :label="true">总是</el-radio>
          <el-radio :label="false">不是</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import api from '@/api/sys/menu'

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        menuId: undefined,
        parentId: undefined,
        name: undefined,
        icon: undefined,
        path: undefined,
        enable: 1,
        hidden: false, // 显示状态
        alwaysShow: true, // 总是显示
        component: undefined, // 组件地址
        permission: undefined, // 权限标识
      },
      menuType: 0, // 菜单类型 0：目录 1：菜单 2：按钮
      menuTree: [],
      menuName: undefined
    }
  },
  methods: {
    init(menuId, parentId, menuName) {
      // reset data
      this.dataForm = {
        menuId: undefined,
        parentId: parentId,
        name: undefined,
        icon: undefined,
        path: undefined,
        enable: 1,
        hidden: false, // 显示状态
        alwaysShow: true, // 总是显示
        component: undefined, // 组件地址
        permission: undefined, // 权限标识
      }
      this.menuName = menuName

      this.dataForm.menuId = menuId
      this.visible = true
      this.$nextTick(() => {
        this.fetchMenuTree()
        if (this.dataForm.menuId !== undefined) {
          // 获取菜单详情，设置 menuType，并回显
          this.fetchMenuInfo()
        }
      })
    },
    handleMenuNode(menu, node, tree) {
      this.menuName = menu.name
      this.dataForm.parentId = menu.id
    },
    fetchMenuTree() {
      api.routes().then(res => {
        res.unshift({
          id: 0,
          parentId: 0,
          name: '主类目',
        })
        this.menuTree = res
      })
    },
    dataSubmit() {
      const request = this.dataForm.menuId === undefined ? api.addMenu({
        ...this.dataForm, hidden: this.dataForm.hidden ? 1 : 0, alwaysShow: this.dataForm.alwaysShow ? 1 : 0
      }) :
        api.updateMenu({ ...this.dataForm, id: this.dataForm.menuId, hidden: this.dataForm.hidden ? 1 : 0, alwaysShow: this.dataForm.alwaysShow ? 1 : 0 })
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
    fetchMenuInfo() {
      api.getMenuInfo(this.dataForm.menuId).then(res => {
        // 回显
        console.log(res);
        this.menuType = res.type
        this.menuName = res.parentId === 0 ? '主类目' : res.name
        this.dataForm.parentId = res.parentId
        this.dataForm.name = res.name
        this.dataForm.icon = res.icon
        this.dataForm.path = res.path
        this.dataForm.enable = res.enable
        this.dataForm.hidden = res.hidden
        this.dataForm.alwaysShow = res.alwaysShow
        this.dataForm.component = res.component
        this.dataForm.permission = res.permission
      })
    }
  },
}
</script>