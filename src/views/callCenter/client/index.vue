<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div class="filter-item">
      <el-date-picker  
          v-model="listQuery.dtzx"
          :picker-options="rangeTimeOps"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="-"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          align="left" clearable>
      </el-date-picker>
      </div>
      <div class='filter-item search-input'>
        <el-input :placeholder="search.placeholder" v-model="search.value" clearable></el-input>
      </div>
      <!-- <div v-waves class="filter-item"  @click="handleSearch">
        <el-dropdown  @command="handleMu" split-button type="primary">
          <i class="el-icon-search"></i>&nbsp;{{$t('table.search')}}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in searchOpts" :key="item" :command="item" v-text="item" ></el-dropdown-item>
            </el-dropdown-menu> 
        </el-dropdown>
      </div> -->
      <el-button  class="filter-item" style="margin-left: 10px;" type="primary" @click="handleSearch" icon="el-icon-search">{{$t('table.search')}}</el-button>
      <el-button  class="filter-item" style="margin-left: 10px;" type="primary" @click="toAssign()" >{{$t('table.assign')}}</el-button>
      <el-button v-if="isSuper" class="filter-item" type="danger"  @click="toDelete()">{{$t('table.delete')}}</el-button>
      <!-- <el-button  v-show="false" class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button> -->
    </div>
    <!-- <el-row>
      <el-col :span="24"> </el-col>
    </el-row> -->
    <el-form>
      <el-form-item label="筛选条件:">
          <el-checkbox v-model="todayFollow">仅显示今天需要跟进的</el-checkbox>
      </el-form-item>
    </el-form>
    <el-table ref="clientTable" @sort-change="sortChange"	@selection-change="handleSelectionChange" :key='tableKey' height="510" :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column v-if="selection.show" type="selection" width="55"></el-table-column>
      <el-table-column fixed type="index" width="50"></el-table-column>
      <el-table-column fixed sortable width="110px" align="center" prop="dt" :label="$t('table.dt')"></el-table-column>
      <el-table-column fixed width="80px" align="center" prop="name" :label="$t('table.name')"></el-table-column>
      <el-table-column fixed width="150px" align="center" :label="$t('table.phone')">
        <template slot-scope="scope" @click="calling">
            <span v-html="scope.row.phone"></span>
            <!-- <el-tooltip  effect="dark" content="与客户电话沟通" placement="bottom" > -->
             <span class="icon-item"><i class="el-icon-mobile-phone"></i></span>
            <!-- </el-tooltip> -->
        </template>
      </el-table-column>
      <el-table-column  width="160px" align="left" prop="email" :label="$t('table.email')"></el-table-column>
      <el-table-column  sortable width="120px" align="left" prop="address" :label="$t('table.address')"></el-table-column>
      <el-table-column  width="60px" :label="$t('table.linktime')">
        <template slot-scope="scope" @click="calling">
            <span v-if="scope.row.linktime==1">上午</span>
            <span v-else>下午</span>
        </template>
      </el-table-column>
      <el-table-column  width="90px" prop="channel" :label="$t('table.channel')"></el-table-column>
      <el-table-column  sortable width="90px" prop="follower" :label="$t('table.follower')"></el-table-column>
      <el-table-column  :label="$t('table.status')">
        <template slot-scope="scope" @click="calling">
            <span v-text="handleStatus[scope.row.status]"></span>
        </template>
      </el-table-column>
      <el-table-column  sortable width="95px" prop="nextTime" :label="$t('table.nextTime')"></el-table-column>
        
      <el-table-column  width="80px"  fixed="right" align="center" :label="$t('table.memo')">
        <template slot-scope="scope" @click="noting">
          <el-tooltip  effect="light" content="点击记录沟通信息" placement="left" >
            <div class="icon-item" @click="show_memo(scope.row.memo)">
              <svg-icon icon-class="form" />
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="left" width="60px" :label="$t('table.label')">
        <template slot-scope="scope">
          <el-tooltip  effect="light" :content="scope.row.label||'标签待定'" placement="right" >
            <div class="icon-item" @click="show_label(scope.row)">
              <svg-icon icon-class="form" />
            </div>
          </el-tooltip>
        </template>
      </el-table-column> -->

      <el-table-column fixed="right" align="center" :label="$t('table.actions')" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-col :span=24>
             <el-button type="default" size="small" @click="toFollow(scope.row)">{{$t('table.follow')}}</el-button>
          </el-col>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="$t('dialog.followSetting')" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="followForm" :model="temp" label-position="left" >
        <el-form-item label="当前跟进进度" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio label="1">待处理</el-radio>
            <el-radio label="2">处理中</el-radio>
            <el-radio label="3">已完结</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="下次跟进时间" prop="nextTime">
            <el-date-picker
              v-model="temp.nextTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :picker-options="nexttimeOptions">
            </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="updateData(temp)">{{$t('table.save')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('table.assign')" :visible.sync="dialogAssignVisible" width="40%">
          <el-form label-position="center" >
                <el-row>
                  <el-col :offset="3">
                    <el-form-item label="跟进人">
                      <el-select v-model="FollowerID" placeholder="请选择">
                        <el-option
                          v-for="item in tutors"
                          :key="item.id"
                          :label="item.fullname"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAssignVisible = false">{{$t('table.cancel')}}</el-button>
            <el-button type="primary" @click="handleAssign">{{$t('table.save')}}</el-button>
          </div>
    </el-dialog>
    <el-dialog title="沟通记录" :visible.sync="dialogMemoVisiable">
 
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{$t('table.save')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"> </el-table-column>
        <el-table-column prop="pv" label="Pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>

   <!--  <el-dialog title="标签设置" :visible.sync="dialogLabelVisiable">
      <el-row>
            <el-card class="box-card">
      <div slot="header" class="clearfix">
    <span>客户标签</span>
    <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
  </div>
  <div v-for="o in 4" :key="o" class="text item">
    {{'列表内容 ' + o }}
  </div>
     <div slot="header" class="clearfix">
                <span>客户标签</span>
                  <el-popover
                    placement="bottom"
                    width="400"
                    height="500"
                    v-model="lableVisible">
                    <el-row  :key="index" v-for="(item,index) of labelGrps">
                      <div>
                        <el-checkbox v-model="item.checked" :style="'color:'+color[index%3]">{{item.name}}</el-checkbox>
                        <i class="el-icon-arrow-up"></i>
                      </div>
                      <div>
                        <el-button  class="btnn" autofocus :disabled="!item.checked" :class="{'color':tag.iscolor,'nocolor':!tag.iscolor}" size="mini" :key="i" v-for="(tag,i) of item.tags"  @click="addTag(index,i)">{{tag.name}}</el-button>
                      </div>
                    </el-row>
                    <div style="text-align: right; margin: 0">
                      <el-button type="primary" size="mini" @click="saveTage">确定</el-button>
                      <el-button size="mini" type="text" @click="clearTag">取消</el-button>
                    </div>
                    <el-button slot="reference" style="float: right; padding: 3px 50px 3px 5px" type="text" @click="setTag()">添加</el-button>
                  </el-popover>
              </div> 
            </el-card>
            <el-tag :key="id" v-for="(tag,id) in temp.Tags" closable :disable-transitions="false" @close="handleClose(id)">
                {{tag.label}}
            </el-tag>
      </el-row>
    </el-dialog> -->
 

    <el-dialog title="高级筛选" :visible.sync="dialogAdvVisiable" width="60%">
      <div>
        <el-row :gutter="1" :key="key" v-for="(sift,key) of sifts">
          <el-col :span="1">
             <span @click="dealSift(key)" style="cursor:pointer"> 
               <i :class="{'el-icon-plus':key==0,'el-icon-minus':key>0}"></i>
              </span>
          </el-col>
          <el-col :span="6">
            <el-select v-model="sift.item" value-key="key" placeholder="字段">
              <el-option @change="show_input(c.type)"
                v-for="c in fieldOpt"
                :key="c.key"
                :label="c.label"
                :value="c">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="sift.opr" placeholder="关系" width="10%">
              <el-option
                v-for="opr in oprOpt"
                :key="opr.value"
                :label="opr.label"
                :value="opr.key" v-show="sift.item&&opr.type.indexOf(sift.item.type)!=-1">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
               <template v-if="sift.item.type&&sift.item.type=='dt'">
                  <el-date-picker  width="50"
                      v-model="sift.value"
                      :picker-options="rangeTimeOps"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      range-separator="-"
                      type="daterange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :default-time="['00:00:00', '23:59:59']"
                      align="left" clearable>
                  </el-date-picker>
               </template>
               <template v-else>
                    <el-input type="text" v-model="sift.value"></el-input>
               </template>
          </el-col>
        </el-row>
     </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="genenateSift">{{$t('table.search')}}</el-button>
        <el-button type="default" @click="dialogAdvVisiable=false;">{{$t('table.cancel')}}</el-button>
      </span>
    </el-dialog>
 

  </div>
</template>

<script>
import { fetchList, updateFollow, deleteFranApp, updateAssign} from '@/api/client'

import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex';

export default {
  name: 'clients',
  directives: {
    waves
  },
  data() {
    var validate_phone = (rule, value, callback) => {
      var reg =/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if (!(reg).test(value)) {
        //console.log(11)
        callback(new Error('手机格式不正确！'));
      }else{
        callback();
      } 
    };
    var validate_mail = (rule, value, callback) => {
      var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); 
      if (value&&!(reg).test(value)) {
        callback(new Error('邮箱格式不正确！'));
      }else{
        callback();
      }  
    };
    return {
      searchOpts:["高级搜索","标签搜索"],
      advSearchWhere:[],
      sifts:[{item:{},opr:undefined,value:undefined}],
      fieldOpt:[{label:"手机",key:"crm_name",type:"string"},{label:"家长姓名",key:"crmzdy_82068889",type:"string"},
                {label:"孩子",key:"crmzdy_82068921",type:"string"},{label:"渠道",key:"crmzdy_82068917",type:"object"},
                {label:"跟进人",key:"crmzdy_85213104",type:"object"},{label:"行业",key:"crmzdy_82068918",type:"string"},
                {label:"家庭住址",key:"crmzdy_82068895",type:"string"},{label:"客户分组",key:"crmzdy_82068893",type:"string"},
                {label:"新建日期",key:"create_name",type:"dt"},{label:"最近修改时间",key:"update_time",type:"dt"}
              ],
      oprOpt:[{label:"包含",key:"like '%@val%'",type:"string,object"},{label:"不包含",key:"not like '%@val%'",type:"string,object"},
                {label:"等于",key:"='@val'",type:"string,number"},{label:"不等于",key:"!='@val'",type:"string,number"},
                {label:"大于等于",key:">='@val'",type:"number"},{label:"小于等于",key:"<='@val'",type:"number"},
                {label:"大于",key:">'@val'",type:"number"},{label:"小于",key:"<'@val'",type:"number"},
                {label:"范围内",key:"between '@val1' and '@val2'",type:"dt"},{label:"范围外",key:"not between '@val1' and '@val2'",type:"dt"},
            ],
      color:[
          "#5199EB",
          "#54B983",
          "#E7A12A",
          "#9568CE"
        ],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        dtzx: undefined,
        sort: undefined
      },
      nexttimeOptions:{
          disabledDate(time) {
            return time.getTime() < Date.now();
          },
          shortcuts: [{
            text: '明天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24*1);
              picker.$emit('pick', date);
            }
          }, {
            text: '后天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24*2);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
      },
      rangeTimeOps: {
            shortcuts: [{
            text: '最近一个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
            }
            }, {
            text: '最近三个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
            }
            }, {
            text: '最近六个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                picker.$emit('pick', [start, end]);
            }
            }, {
            text: '最近一年',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
                picker.$emit('pick', [start, end]);
            }
            }]
      },
      importanceOptions: [1, 2, 3,4],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      labelGrps:[],
      clientlGrps:[],
      temp: {
          id: undefined,
          importance: 1,
          channel: undefined,
          email:undefined,
          phone:undefined,
          status:undefined,
          nextTime:undefined
      },
      row_cur:{},
      todayFollow:false,
      selection:{show:false,ids:[]},
      search:{placeholder:"搜索关键字:手机号/姓名等",value:""},
      handleStatus:{"1":"待处理","2":"处理中","2":"已完结"},
      importanceOptions: [1, 2, 3,4],
      dialogFormVisible: false,
      dialogMemoVisiable: false,
      dialogLabelVisiable: false,
      dialogAdvVisiable: false,
      lableVisible:false,
      dialogStatus: 'create',
      dialogPvVisible: false,
      pvData:[],
      dialogAssignVisible:false,
      users:[],
      FollowerID:undefined,
      rules: {
          nextTime: [{ required: true, message: '请输选择下次跟进时间', trigger: 'blur' }],
          status: [{ required: true, message: '请选择处理进度', trigger: 'blur' }],
      },
      downloadLoading: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  computed:{
    ...mapGetters([
      'roles',
      'isAdmin',
      'isSuper'
    ]),
    tutors(){
      return this.users.filter(function(u){
          return u.fullname.indexOf("管理员")==-1;
      })
    }
  },
  methods: {
    sortChange(param){
        this.listQuery.sort=param.prop+" "+param.order.substring(0,param.order.indexOf("c"));
        this.getList();
    },
    tag_select(){
        if(!this.temp.Tags||this.temp.Tags.length==0) return;
        var arr_tags=[];
        this.temp.Tags.map(function(t){
            arr_tags[t.key]=t.label;
        })
        var self=this;
        var arr=self.labelGrps.map(function(o){
            if(arr_tags[o.name]){
               o.tags.map(function(t){
                 if(arr_tags[o.name]==t.name){
                    t.iscolor=true;
                 }
              })
            }
        })
    },
    genenateSift:function(){
       var self=this;
       self.sifts.forEach(function(s){
          if(s.value&&!self.isEmpty(s.item)&&s.opr){
            if(typeof s.value=="object"){
                self.advSearchWhere.push(s.item.key+" "+s.opr.replace("@val1",s.value[0].trim()).replace("@val2",s.value[1].trim()));
            }else{
                self.advSearchWhere.push(s.item.key+" "+s.opr.replace("@val",s.value.trim()));
            }
          }
       })
       self.dialogAdvVisiable=false;
       self.getList();
    },
    dealSift:function(index){
      if(index==0){
        if(this.sifts.length>this.fieldOpt.length) return;
        this.sifts.push({item:{},opr:'',value:undefined});
      }else{
        this.sifts.splice(index,1);
      }
    },
    show_label:function(row){
       this.temp = Object.assign({}, row) // copy obj
       this.temp.gym_selected=JSON.parse(this.temp.gym_selected);
       this.get_tag(this.temp.gym_selected);
       this.dialogLabelVisiable=true;
    },
    handleMu:function(m){
       if(m=="高级搜索"){
          this.dialogAdvVisiable=true;
       }
    },
    show_memo:function(memos){
         this.dialogMemoVisiable=true;
    },
    noting(){
         console.log("I'm noting")
    },
    calling(){
         console.log("I am calling!")
    },
    getList() {
      this.listLoading = true
      this.list =[];
      fetchList(this).then(response => {
        //前而request.js做了处理
        if(response.code==0){
           let res=response.data;
           if(res.length>0){
             this.list = res;
             this.total = res&&res[0].total;
             //console.log(this.list)
           }
        }
        this.listLoading = false
      })
    },
    handleSearch(){
      this.listQuery.page = 1
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleReady(temp){
      console.log(this.temp.gym_selected);
      this.getLs(this.temp.gym_selected);
      this.getChannel();
    },
    resetTemp() {
      this.temp={
          id: undefined,
          importance: 1,
          client: undefined,
          kid:undefined,
          channel: undefined,
          industry: undefined,
          sex: undefined,
          memo: undefined,
          email:undefined,
          phone:undefined,
          addr:undefined,
          group_selected:undefined,
          gym_selected:undefined,
          ls_selected:undefined
      };
    },
    handleCreate() {
      this.resetTemp()
      if(!this.isAdmin) this.temp.ls_selected=this.account.self;
      if(!this.temp.gym_selected) this.temp.gym_selected=this.gym;
      this.handleReady(this.temp);
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      let self=this;
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createClient(this).then((res) => {
            self.list.unshift(this.temp)
            self.dialogFormVisible = false
            self.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
         this.temp = Object.assign({}, row) // copy obj
    },
    toFollow(row){
         this.row_cur=row;
         this.temp.id=row.id;
         this.temp.status=row.status.toString();
         this.temp.nextTime=row.nextTime;
         this.dialogFormVisible=true;
    },
    updateData(data) {
      updateFollow(data).then((res)=>{
        if(res.code==0){
          this.row_cur.status=data.status.valueOf();
          this.row_cur.nextTime=data.nextTime;
          this.$message({
              showClose: true,
              message: res.msg,
              type: 'success'
          });
          this.dialogFormVisible=false;
        }
      })
    },
    toAssign(){
        let self=this;
        if(!this.selection.ids.length||!this.selection.show){
          self.$message({
            type: 'info',
            message: '请先勾选需分配的记录,再点击按钮',
            duration: 4 * 1000
          });     
          this.selection.show=true;
          this.selection.ids=[];
          return;
        }
        self.dialogAssignVisible=true;
    },
    handleAssign(){
        let self=this;
        if(!this.FollowerID){
            self.$notify({
                title: '错误',
                message: "请选择要分配的老师",
                type: 'error',
                duration: 2000
            })
        }
        updateAssign(this).then(function(res){
          if(res.code==0){
              self.$notify({
                title: '成功',
                message: '分配成功',
                type: 'success',
                duration: 2000
              })
              self.selection.ids=[];
              self.selection.show=false;
              self.dialogAssignVisible=false;
              self.getList();
          }else{
              self.$notify({
                title: '错误',
                message: res.msg,
                type: 'error',
                duration: 2000
              })
          }
        })
    },
    toDelete(){
        let self=this;
        if(!this.selection.ids.length||!this.selection.show){
          self.$message({
            type: 'info',
            message: '请先选择需要删除的记录'
          });     
          this.selection.show=true;
          this.selection.ids=[];
          return;
        }
        this.$confirm('是否确认删除?')
          .then(function() {
              self.handleDelete();
          }).catch(action => {
              if(action === 'cancel'){
                  self.$message({
                    type: 'info',
                    message: "已取消操作"
                  })
              }
              self.selection.show=false;
              self.selection.ids=[];
              this.$refs.clientTable.clearSelection();
          }) 
    },
    handleDelete() {
      let self=this;
      deleteFranApp(this).then(function(res){
         if(res.code==0){
            self.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            let indexes=self.selection.ids.map(function(id){
                  return self.list.findIndex(function(l){
                     return  l.id==id;
                  })
            })
            //console.error(indexes)
            indexes.forEach(function(i){
                self.list.splice(i,1);
            })
            self.selection.ids=[];
            self.selection.show=false;
         }else{
            self.$notify({
              title: '错误',
              message: res.msg+',删除失败',
              type: 'error',
              duration: 2000
            })
         }
      })
    },
    handleSelectionChange(vals) {
      var self=this;
      self.selection.ids=[];
      vals.forEach(function(v){
          self.selection.ids.push(v.id);
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    tempConv(){
        var label_string = JSON.stringify(this.temp.Tags);
        var obj=this.extend({label:label_string,birth:this.fmtDate(this.temp.birth)},this.temp);
        return obj;
      },
      tag_select(){
        if(!this.temp.Tags||this.temp.Tags.length==0) return;
        var arr_tags=[];
        this.temp.Tags.map(function(t){
            arr_tags[t.key]=t.label;
        })
        var self=this;
        var arr=self.labelGrps.map(function(o){
            if(arr_tags[o.name]){
               o.tags.map(function(t){
                 if(arr_tags[o.name]==t.name){
                    t.iscolor=true;
                 }
              })
            }
        })
      },
      goEdit(){
        if(!this.readonly) return true;
        this.$confirm('是否要进入可编辑状态？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.readonly=false;
          this.temp.readonly=0;
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已放弃'
          });       
        });
      },
      setTag(){
        if(this.labelGrps.length>0) return;
        this.$confirm('请先设置标签, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({path: '/setting'});
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已放弃'
          });          
        });
      },
      clearTag(){
        this.lableVisible = false;
      },
      saveTage(){
        //console.log("save",JSON.stringify(this.Temp))
        //console.log("save",JSON.stringify(this.labelGrps))
        this.temp.Tags = this.Temp;
        this.lableVisible =false;
      },
      addTag(index,i){
        this.labelGrps[index].tags.map(function(t,j){
          //console.log(i+"||"+j)
          if(j==i){
            t.iscolor=!t.iscolor;
          }else{
            t.iscolor=false;
          }
        }) 
      },
      submitForm(formName) {
        var self=this;
        self.$refs[formName].validate((valid) => {
          if (valid) {
              self.saveUser(formName);
          } else { 
              this.$message({
                type: 'error',
                message: `内容输入不正确！`
              });
              return false;
          }
        });
      },
      saveUser(formName){
        var self=this;
        var sql_createuser = "declare @data varchar(max)=quot;@formquot;;declare @flag int =isnull((select top 1 1 from crm_zdytable_238592_27128_238592_view ec where crm_name=JSON_VALUE(@data,quot;$.phonequot;) and crmzdy_82326474=JSON_VALUE(@data,quot;$.gym_selectedquot;)),0);"
        if(this.temp.readonly===0){
           sql_createuser = "update crm_zdytable_238592_27128_238592_view set isdelete=1 where crm_name='@phone';"+sql_createuser
        }
        sql_createuser += "insert into crm_zdytable_238592_27128_238592(org_id,cust_id,crm_syrID,create_time,crm_name/*phone*/,crmzdy_82068889/*name*/,crmzdy_82068921/*othername*/,crmzdy_82068894/*sex*/,crmzdy_82068891/*birth*/,crmzdy_82068892/*email*/,crmzdy_82068895/*addr*/,crmzdy_82068918/*industry*/,crmzdy_82068893/*group*/,crmzdy_82068919/*label*/,crmzdy_82068896/*memo*/,crmzdy_82326474/*gym*/,crmzdy_82068917/*channel*/)";
        sql_createuser += "select top 1 238592,quot;@iduserquot;,JSON_VALUE(@data,quot;$.ls_selectedquot;),getdate(),JSON_VALUE(@data,quot;$.phonequot;),JSON_VALUE(@data,quot;$.namequot;),JSON_VALUE(@data,quot;$.othernamequot;),JSON_VALUE(@data,quot;$.sexquot;),JSON_VALUE(@data,quot;$.birthquot;),JSON_VALUE(@data,quot;$.emailquot;),JSON_VALUE(@data,quot;$.addressquot;),JSON_VALUE(@data,quot;$.industryquot;),JSON_VALUE(@data,quot;$.group_selectedquot;),JSON_VALUE(@data,quot;$.labelquot;),JSON_VALUE(@data,quot;$.memoquot;),JSON_VALUE(@data,quot;$.gym_selectedquot;),JSON_query(@data,quot;$.channelquot;) from crm_yh_238592_view where @flag=0;";
        sql_createuser += "select case when @flag=1 then 2 else 0 end errmsg for json path";

        //console.log(JSON.stringify(obj));return;
        sql_createuser = sql_createuser.replace('@form',JSON.stringify(self.tempConv()));
        sql_createuser = sql_createuser.replace('@phone',self.temp.phone);
    
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.temp.Tags=[];
        this.$refs.username.$el.querySelector('input').focus();
        this.temp.gym_selected=JSON.stringify(this.account.gyms[0]);
        this.temp.ls_selected=this.account.id;
      },
      getChannel(){
        self=this;
        fetchChannel(this).then(response =>{
           if(typeof response.data=='object'){
              self.channels=response.data
           }
        })
      }
  },
  mounted(){
    this.getList();
    this.getUsers();
  }
}
</script>
<style  scoped>
    .icon-item {
      font-size: 1.5em;
      color: #24292e;
      cursor: pointer;
    }
    .w-50{
      width: 46%;
      margin-right:3%; 
      display: inline-block;
    }
    .search-input {
      width: 280px;
      box-sizing: border-box;
      font-family: 'MicrosoftYaHei';
      font-size: 14px;
      color: #909399;
      border-radius: 0;
    }


 .color{
    color:#409eff;
    background-color: #ecf5ff;
    border-color: #c6e2ff;
  }
  .nocolor{
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
  }
  .box-card .w-50{
      width: 48%;
      display: inline-block;
  }
  .card-right{
    height:100%;
    box-shadow:none;
    border-bottom: none;
    border-right: none;
    position: relative;
   
  }
  .btnn{
      margin: 10px 5px 5px 10px !important;
    }
  
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
 
 
 
</style>
