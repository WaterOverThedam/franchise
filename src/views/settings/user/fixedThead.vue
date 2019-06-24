<template>
  <div class="app-container">
      <div class="filter-container">
          <el-button type="primary" class="create" size="small"  @click="dialogUserVisible=true">新建帐户</el-button>
      </div>
      <el-table :data="users"  border fit highlight-current-row size="small" style="width:68%">
        <el-table-column prop="username" label="帐号名" width="180"></el-table-column>
        <el-table-column prop="fullname" label="姓名" width="180"></el-table-column>
        <el-table-column label="角色" width="180">
          <template slot-scope="scope">
            {{scope.row.role|join}}
          </template>
        </el-table-column>
        <el-table-column align="left" :label="$t('table.actions')" >
          <template slot-scope="scope">
            <el-col :span=6 :offset="3">
              <el-button type="primary" size="small" @click="goEdit(scope.row,'修改信息')">{{$t('table.edit')}}</el-button>
            </el-col>
            <el-col :span=6>
              <el-button type="danger" size="small" @click="userDel(scope.row.id)">{{$t('table.delete')}}</el-button>
            </el-col>
            <el-col :span=6>
              <el-button type="danger" size="small" @click="goEdit(scope.row,'重置密码')">{{$t('table.resetPwd')}}</el-button>
            </el-col>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="dialogTitle" :visible.sync="dialogUserVisible">
          <el-form label-position="center" >
                <el-row>
                  <el-col :span="8">
                    <el-form-item label-width="80px" label="帐户号:" class="postInfo-container-item">
                        <el-input   style='min-width:150px;' v-model="user.username"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                      <el-form-item label-width="80px" label="来源:" class="postInfo-container-item">
                        <el-input   style='min-width:150px;' v-model="user.password"></el-input>
                      </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                      <el-form-item label-width="80px" label="姓名:" class="postInfo-container-item">
                            <el-input placeholder="" style='min-width:150px;' v-model="user.fullname"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label-width="80px" label="权限:" class="postInfo-container-item">
                            <el-select v-model="user.roleId" placeholder="请选择">
                              <el-option
                                v-for="item in Roles"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">
                              </el-option>
                            </el-select>
                      </el-form-item>
                    </el-col>
                </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogUserVisible = false">{{$t('table.cancel')}}</el-button>
            <el-button type="primary" @click="userAdd">{{$t('table.save')}}</el-button>
          </div>
      </el-dialog>

      <el-dialog :title="dialogTitle" :visible.sync="dialogResetVisible">
          <el-form label-position="center" >
                <el-row>
                  <el-col :offset="3" :span="8">
                    <el-form-item label-width="80px" label="新密码:" class="postInfo-container-item">
                        <el-input   style='min-width:150px;' v-model="user.password"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogUserVisible = false">{{$t('table.cancel')}}</el-button>
            <el-button type="primary" @click="userAdd">{{$t('table.save')}}</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
import { userList, roleList, userAdd, userDel,userUpdate} from '@/api/user' 

export default {
  data(){
    return {
      dialogUserVisible:false,
      dialogResetVisible:false,
      dialogTitle:"",
      Roles:[],
      users:[],
      user:{username:undefined,password:undefined,fullname:undefined,roleId:undefined}
    }
  },
  filters:{
     join(role){
       var roles=[];
       if(typeof role!="object") return "无";
       role.forEach(r => {
           roles.push(r.title);
       });
       return roles.join(",");
     }
  },
  methods:{
    userAdd(row){
       userAdd(this.user)
    },
    userDel(id){
       userDel(id)
    },
    userSave(){
      let self=this;
       this.userUpdate(this.user).then((response)=>{
          if(response.code==0){
              Message({
                message: response.msg,
                type: 'info',
                duration: 3 * 1000
              })
              self.getUsers();
          }
       });
    },
    toDialog(row,action){
       this.dialogTitle=title;
       if(action=='reset'){
          this.user={};
          this.user.id=row.id;
          this.dialogTitle='重置密码'
          this.dialogResetVisible=true;
       }
       if(action=='create'){
          this.user={};
          this.dialogTitle='新建用户'
          this.dialogUserVisible=true;
       }
       if(action=='edit'){
          this.user=Object.assign({}, row) ;
          this.dialogTitle='修改用户信息'
          this.dialogUserVisible=true;
       }
    },
    getUsers(){
      userList().then((response)=>{
            if(response.code==0){
              self.users=response.data;
            }
      });
    }
  },
  mounted(){
     let self=this;
     this.getUsers();
     roleList().then((response)=>{
          if(response.code==0){
            self.Roles=response.data;
          }
     });
     
  },
  watch: {
  }
}
</script>

<style scoped>
  .create {
    margin-left:61%;
  }
</style>
