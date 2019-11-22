<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图-->
        <el-card>
            <!--卡片视图-->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>

            <!--角色列表区域-->
            <el-table :data="rolelist" border stripe>
                <!--展开列-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!--渲染一级权限-->
                            <el-col :span="5">
                                <el-tag>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--渲染二级和三级权限-->
                            <el-col :span="19">
                                <!--通过for循环嵌套渲染二级权限-->
                                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!--索引列-->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column type="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column type="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting">分配</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--修改角色的对话框-->
        <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <!--内容主体 -->
            <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="70px">
                <el-form-item label="角色名称">
                    <el-input v-model="editForm.id"></el-input>
                </el-form-item>
                <el-form-item label="角色名称">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "roles",
        data() {
            return {
                // 所有角色列表数据
                rolelist: [],
                // 查询到的用户信息对象
                editForm: {},
                // 控制修改用户对话框的显示与隐藏
                editDialogVisible: false,
                editFormRules: {
                    roleName: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                    ],
                    roleDesc: [
                        {required: true, message: '请输入角色描述', trigger: 'blur'},
                    ],
                }
            }
        },
        created() {
            this.getRolesList()
        },
        methods: {
            // 获取所有角色的列表
            async getRolesList(){
                const {data: res} = await this.$http.get('roles')

                if(res.meta.status !== 200){
                    return this.$message.error('获取角色列表失败！')
                }
                this.rolelist = res.data

                console.log(this.rolelist)
            },
            // 展示编辑用户的对话框
            async showEditDialog(id) {
                // console.log(id)
                const {data: res} = await this.$http.get('roles/' + id)
                if(res.meta.status !== 200){
                    return this.$message.error('查询用户信息失败！')
                }
                this.editForm = res.data
                this.editDialogVisible = true
                console.log(this.editForm)
            },
            // 监听修改用户对话框的关闭事件
            editDialogClosed(){
                this.$refs.editFormRef.resetFields()
            },
            // 修改用户信息并提交
            editRoleInfo(){
                this.$refs.editFormRef.validate(async valid => {
                    if(!valid) return
                    // 发起修改用户信息的数据请求
                    const {data: res} = await this.$http.put('roles/' + this.editForm.id, {
                        roleName: this.editForm.roleName,
                        roleDesc: this.editForm.roleDesc,
                        roleId: this.editForm.roleId
                    })
                    console.log(res.data)
                    if(res.meta.status !== 200){
                        return this.$message.error('更新用户失败！')
                    }
                    console.log(res.meta)
                    // 关闭对话框
                    this.editDialogVisible = false
                    // 刷新数据列表
                    this.getRolesList()
                    // 提示修改成功
                    this.$message.success('更新用户信息成功！')
                })
            },
        }
    }
</script>

<style lang="less" scoped>
.el-tag{
    margin: 7px;
}

.bdtop{
    border-top: 1px solid #eeeeee;
}
.bdbottom {
    border-bottom: 1px solid #eeeeee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>
