<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select class="filter-item" style="margin-left: 20px;" v-model="gym" value-key="code" clearable filterable @change="getLs()" placeholder="中心">
          <el-option v-for="item in gyms" :key="item.code" :label="item.name" :value="item">
          </el-option>
      </el-select>
      <div class="filter-item">
      <el-date-picker  
          v-model="listQuery.dtzx"
          :picker-options="pickerOptions2"
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
        <el-input :placeholder="search.placeholder" v-model="search.Value" clearable></el-input>
      </div>
      <div v-waves class="filter-item"  @click="handleSearch">
        <el-dropdown  @command="handleMu" split-button type="primary">
          <i class="el-icon-search"></i>&nbsp;{{$t('table.search')}}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in searchOpts" :key="item" :command="item" v-text="item" ></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-button  class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <el-button  v-show="false" class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
    </div>

    <el-table :key='tableKey' height="510" :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column fixed type="index" width="50"></el-table-column>
      <el-table-column fixed width="100px" align="center" prop="client" :label="$t('table.client')"></el-table-column>
      <el-table-column fixed width="150px" align="center" :label="$t('table.phone')">
        <template slot-scope="scope" @click="calling">
            <span v-html="urlView(scope.row)"></span>
            <el-tooltip  effect="dark" content="与客户电话沟通" placement="bottom" >
             <span class="icon-item"><i class="el-icon-mobile-phone"></i></span>
            </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column fixed="left" width="80px" align="center" :label="$t('table.memo')">
        <template slot-scope="scope" @click="noting">
          <el-tooltip  effect="light" content="点击进入沟通记录界面" placement="top" >
            <div class="icon-item" @click="show_memo(scope.row.memo)">
              <svg-icon icon-class="form" />
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column fixed="left" width="60px" :label="$t('table.label')">
        <template slot-scope="scope">
          <el-tooltip  effect="light" :content="scope.row.label||'标签待定'" placement="right" >
            <div class="icon-item" @click="show_label(scope.row)">
              <svg-icon icon-class="form" />
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column  width="210px" align="left" prop="email" :label="$t('table.email')"></el-table-column>
      <el-table-column  width="220px" align="left" prop="industry" :label="$t('table.industry')"></el-table-column>
      <el-table-column  width="220px" align="left" prop="addr" :label="$t('table.addr')"></el-table-column>
      <el-table-column width="100px" align="center" :label="$t('table.ls_selected')">
            <template slot-scope="scope">
               <span>{{json(scope.row.ls_selected,'username')}}</span>
           </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="$t('table.gym_selected')">
            <template slot-scope="scope">
               <span>{{json(scope.row.gym_selected,'name')}}</span>
           </template>
      </el-table-column>
      <el-table-column width="100px" align="center" prop="cust_name" :label="$t('table.cust_name')"></el-table-column>
      <el-table-column width="100px" align="center" prop="create_time" :label="$t('table.create_time')"></el-table-column>
      <el-table-column width="100px" align="center" prop="edit_name" :label="$t('table.edit_name')"></el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.update_time')">
        <template slot-scope="scope">
          <span>{{scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-tooltip  effect="dark" content="发布成功后会导入OASIS" placement="bottom" >
             <el-button :disabled="isPublish(scope.row.idjt)" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{$t('table.publish')}}</el-button>
          </el-tooltip>
          <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{$t('table.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="$t('dialog.'+dialogStatus)" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 600px; margin-left:50px;'>
          <el-form-item :label="$t('table.client')"  prop="client" class="w-50">
            <el-input  v-model="temp.client" size="100"></el-input>
          </el-form-item>  
          <el-form-item :label="$t('table.sex')"  prop="sex" class="w-50">
            <el-radio-group v-model="temp.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
            <el-radio label="未知"></el-radio>
            </el-radio-group>
          </el-form-item>
      
          <el-form-item :label="$t('table.phone')" prop="phone"  class="w-50">
              <el-input  v-model="temp.phone" size="100"></el-input>
          </el-form-item>

          <el-form-item :label="$t('table.email')" prop="email" class="w-50">
              <el-input  v-model="temp.email" size="100"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.kid')"  prop="kid" class="w-50">
             <el-input   v-model="temp.kid" size="100"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.industry')"  prop="industry">
             <el-col :span="14">
               <el-input  v-model="temp.industry" ></el-input>
             </el-col> 
          </el-form-item>
          <el-form-item :label="$t('table.addr')" prop="addr">
             <el-col :span="14">
               <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}"  v-model="temp.addr"></el-input>
             </el-col>
          </el-form-item>
          <el-form-item :label="$t('table.channel')" prop="channel" class="w-50">
              <el-select  v-model="temp.channel" value-key="id" filterable placeholder="请选择">
                  <el-option v-for="c of channels" :key="c.id" :label="c.name" :value="c"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.group_selected')"  prop="group_selected" class="w-50">
              <el-select v-model="temp.group_selected" filterable placeholder="请选择">
                <el-option v-for="(g,index) of clientlGrps" :key="index" :label="g.name" :value="g.name"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.importance')">
            <el-rate style="margin-top:8px;" v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max='4'></el-rate>
          </el-form-item>
          <el-form-item :label="$t('table.gym_selected')" prop="gym_selected" class="w-50">
                <el-select class="filter-item"  v-model="temp.gym_selected" value-key="code" clearable filterable @change="getLs(gym)" placeholder="中心">
                    <el-option v-for="item in gyms" :key="item.code" :label="item.name" :value="item">
                    </el-option>
                </el-select>
          </el-form-item> 
          <el-form-item :label="$t('table.ls_selected')" prop="ls_selected" class="w-50">
                <el-select  value-key="id" :disabled="account.acl!='系统管理员'" v-model="temp.ls_selected" default-first-option filterable placeholder="请选择老师">
                    <el-option v-for="item in tutors" :key="item.id" :label="item.username" :value="item">
                    </el-option>
                </el-select>
          </el-form-item> 
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="沟通记录" :visible.sync="dialogMemoVisiable">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"> </el-table-column>
        <el-table-column prop="pv" label="Pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{$t('table.confirm')}}</el-button>
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

    <el-dialog title="标签设置" :visible.sync="dialogLabelVisiable">
      <el-row>
        
            <el-card class="box-card">
 
  <div slot="header" class="clearfix">
    <span>客户标签</span>
    <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
  </div>
  <div v-for="o in 4" :key="o" class="text item">
    {{'列表内容 ' + o }}
  </div>
 

              <!-- <div slot="header" class="clearfix">
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
              </div> -->
            </el-card>
            <el-tag :key="id" v-for="(tag,id) in temp.Tags" closable :disable-transitions="false" @close="handleClose(id)">
                {{tag.label}}
            </el-tag>
 
      </el-row>
    </el-dialog>
 

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
                      :picker-options="pickerOptions2"
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
import { fetchList, fetchChannel, createClient,updateClient,syncOASIS} from '@/api/client'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'


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
      pickerOptions2: {
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
          ls_selected:undefined,
          Tags:[],
      },
      search:{placeholder:"搜索关键字:手机号/家长姓名",value:undefined},
      labelGrps:[],
      clientlGrps:[],
      channels:[],
      importanceOptions: [1, 2, 3,4],
      dialogFormVisible: false,
      dialogMemoVisiable: false,
      dialogLabelVisiable: false,
      dialogAdvVisiable: false,
      lableVisible:false,
      dialogStatus: 'create',
      dialogPvVisible: false,
      pvData: [],
      rules: {
          gym: [{ required: true, message: '请输选择中心', trigger: 'blur' }],
          ls: [{ required: true, message: '请选择跟进老师', trigger: 'blur' }],
          client: [
            { required: true, message: '请输入客户名称', trigger: 'change' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          channel: [
            { required: false, message: '请选择客户来源', trigger: 'change' }
          ],
          importance: [
            { required: false, message: '请对例子质量进行评估', trigger: 'change' }
          ],
          ls_selected: [
            { required: true, message: '请选择跟进老师', trigger: 'change' }
          ],
          gym_selected: [
            { required: true, message: '请选择所属中心', trigger: 'change' }
          ],
          phone:[
            { required: true, message: '请输入手机号',trigger:'blur'},
            { validator: validate_phone, trigger: 'blur' }
          ],
          email:[
            { validator: validate_mail, trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '选择性别', trigger: 'change' }
          ]
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
  created() {
    this.getGym();
    this.getList();
  },
  computed:{
    Temp:function(){
        var self=this;
        var arr=self.labelGrps.map(function(o){
          if(o.checked){
            var tag =o.tags.find(function(t){
                return t.iscolor;
            })
            if(tag){
                return {"key":o.name,"label":tag.name}
            }
          }
        })
        return self.clearNullAr(arr);
    },
    searchWhere:function(){
       return this.search.Value&&"phone+client like '%@s%'".replace("@s",this.search.Value.trim());
    }
  },
  methods: {
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
    isPublish:function(idjt){
        return !idjt==0;
    },
    show_memo:function(memos){
         this.dialogMemoVisiable=true;
    },
    noting(){
       alert("I'm noting")
    },
    calling(){
         alert("I am calling!")
    },
    getList() {
      this.listLoading = true
      fetchList(this).then(response => {
        this.list = response.data.arr
        this.total = response.data.total
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
    handleModifyStatus(row, status) {
      var sql="select ec.id,isnull(crmzdy_82068889,'') client,isnull(ec.crm_name,'') phone,isnull(crmzdy_82068921,'') kid,isnull(crmzdy_82068893,'') group_selected,isnull(crmzdy_82068894,'') sex,isnull(crmzdy_82068917,'') channel,isnull(crmzdy_82068918,'') industry,isnull(crmzdy_82068895,'') addr,isnull(crmzdy_82068919,'') label,convert(varchar(10),ec.create_time,120)create_time,isnull(ec.crmzdy_85213104,'') ls_selected,isnull(crmzdy_82326474,'') gym_selected,isnull(crmzdy_82068892,'') email,ec.edit_name,ec.cust_name,ec.update_time,crmzdy_82068891 birth,crmzdy_82068896 memo from crm_zdytable_238592_27128_238592_view ec where id="+row.id;
      if(status=="published"){
         syncOASIS(sql).then(response => {
            if(response.data&&response.data.errcode==0){
                this.$message({
                    message: '同步成功',
                    type: 'success'
                })
            }else{
                this.$message({
                    message: '同步失败',
                    type: 'error'
                })
            }
         });
      }
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createClient(this).then((res) => {
            console.error(res);
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
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
      if(/\{.+\}/.test(this.temp.ls_selected)) this.temp.ls_selected=JSON.parse(this.temp.ls_selected);
      if(/\{.+\}/.test(this.temp.channel)) this.temp.channel=JSON.parse(this.temp.channel);
      if(typeof this.temp.gym_selected =='string'){
        if(/\{.+\}/.test(this.temp.gym_selected)) {
          this.temp.gym_selected=JSON.parse(this.temp.gym_selected);
        }else{
          this.temp.gym_selected=this.gym;
        }  
      }
      console.log(this.temp)
      this.handleReady(this.temp);
      //this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateClient(this).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
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
  .box-card{
    .w-50{
      width: 48%;
      display: inline-block;
    }
    
    // width: 70%;
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
