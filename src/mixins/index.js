import { mapGetters } from 'vuex';
import request from '@/utils/request';
const requestUrl="https://bbk.800app.com/uploadfile/staticresource/238592/279833/api_auto_json.aspx";

export default{
    data(){
       return {
           gym:undefined,
           gyms:undefined,
           tutor:undefined,
           tutors:undefined
       }
    },
    computed: {
        ...mapGetters([
          'account'
        ])
    },
    methods:{
        getLs(gym){
            let sql = "select ls.crm_qm username,ls.id from crm_yh_238592_view ls where crm_yhname not like '50%' and crm_yiqiyong=1 join (@tbl_gym)g on charindex(g.name,crmzdy_81611236)>0 order by username for json auto";
            gym = gym||this.gym.name||this.account.gyms;
            gym = gym.split(";") ;
            sql = sql.replace("@tbl_gym",gym);

            let params={sql1:sql},self=this;
            request({
                baseURL: requestUrl,
                method: 'post',
                params
              }).then(response => {
                self.tutors = response.data
              })
        },
        getGym(){
            var sql="select (select crm_name name,crmzdy_80620116 code,id from crm_zdytable_238592_23594_238592_view @gym_where order by name for json auto);";
            if(this.account.acl=='系统管理员'){
                sql=sql.replace('@gym_where','');
            }else{
                sql=sql.replace('@gym_where',"where charindex(crm_name,'@gyms')>0");
                sql=sql.replace('@gyms',this.account.gyms);
            }
            let params={sql1:sql},self=this;
            request({
                baseURL: requestUrl,
                method: 'post',
                params
              }).then(response => { 
                self.gyms = response.data;
                self.gyms&&self.gyms[0];
              })
        },
        obj2Arr(obj){
            var arr = []
            for (let i in obj) {
                arr.push("'"+obj[i]+"' "+i)
            }
            //console.log(arr.length)
            //if(arr.length==15) console.log(JSON.stringify(obj))
            return arr;
        },
        json2Sql(data){
             var self=this;
             var sql="";
             data.map(function(d){
                sql += "select "+(typeof d =='object'?self.obj2Arr(d).join("','"):"'"+d+"' name")+" union all ";
             })
             return  sql.slice(0,-10);
        },
        json(obj_str,key){
          if (typeof obj_str=="object") return obj_str[key];
          if (typeof obj_str!="string") return "invalid string"
          if(this.trim(obj_str)!=""){
            var obj=JSON.parse(obj_str);
            if(obj){
                return obj[key];
            }
          }
          return '';
        },
        urlView:function(row){
            if(row.idjt&&row.idjt!="undefined"&&row.idjt.trim()!=""){
		    var u= "<a title='点击进入家庭' href='https://bbk.800app.com/index.jsp?mlist=1&mfs1=crm_sj&mid=@idjt&menu=3' target='_blank'>@phone</a>";
            return u.replace('@idjt',row.idjt).replace('@phone',row.phone);
            }
            return row.phone;
        },
        urlView_zx:function(label){
            let tmp=function (row,label){
                if(row.idzx){
                    var u ='<a title="点击进入咨询中心" href="https://bbk.800app.com/index.jsp?mlist=1&amp;mfs1=crm_zdytable_238592_25111&amp;mid=@idzx&amp;menu=3" target="_blank">@label</a>';
                    return u.replace('@idzx',row.idzx).replace('@label',row[label]||"查看");
                }
                return '查看';
            }
            return function(row){
                return tmp(row,label);
            };
        }

    }
    
}