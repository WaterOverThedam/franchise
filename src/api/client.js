import request from '@/utils/request'


const requestUrl="https://bbk.800app.com/uploadfile/staticresource/238592/279833/api_auto_json.aspx";
const ecUrl="https://bbk.800app.com/uploadfile/staticresource/238592/279833/dataInterface_sync_ec.aspx";
let sql_list= "select /*main*/id,isnull(crmzdy_82068889,'') name,isnull(crm_name,'') phone,isnull(crmzdy_82068921,'') othername,isnull(crmzdy_82068893,'') group_selected,isnull(crmzdy_82068894,'') sex,convert(varchar(10),crmzdy_82068891,120) birth,isnull(crmzdy_82068917,'') channel,isnull(crmzdy_82068895,'') addr,isnull(crmzdy_82068896,'') memo,isnull(crmzdy_82068919,'') label,convert(varchar(10),create_time,120)create_time,crm_syrID ls_selected,isnull(crmzdy_82326474,'') gym_selected,isnull(crmzdy_82068892,'') email,edit_name,cust_name,look_time from crm_zdytable_238592_27128_238592_view ec @whereLs";

export function fetchList(cxt) {
  let whereLs='';
  if(cxt.account.acl!="系统管理员"&&charindex('中心运营总监',cxt.account.acl)==0){
     whereLs='crm_syrID='+cxt.account.id
  }

  let sql=sql_list.replace("@whereLs",whereLs);
  let option={pageSize:cxt.listQuery.limit,pageNow:cxt.listQuery.page,condition:cxt.listQuery.condition,order:cxt.listQuery.sort};
 
  sql = cxt.fn_pager(sql,option);

  return request({
    baseURL: requestUrl,
    method: 'get',
    params: {sql1:sql}
  })
}

export function fetchDetail() {
  return request({
    url: '/article/detail',
    method: 'get'
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
