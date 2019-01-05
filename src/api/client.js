import request from '@/utils/request'


const requestUrl="https://bbk.800app.com/uploadfile/staticresource/238592/279833/api_auto_json.aspx";
const ecUrl="https://bbk.800app.com/uploadfile/staticresource/238592/279833/dataInterface_sync_ec.aspx";
const sql_list= "select /*main*/ec.id,isnull(jt.id,0)idjt,isnull(crmzdy_82068889,'') client,isnull(ec.crm_name,'') phone,isnull(crmzdy_82068921,'') kid,isnull(crmzdy_82068893,'') group_selected,isnull(crmzdy_82068894,'') sex,isnull(crmzdy_82068917,'') channel,isnull(crmzdy_82068895,'') addr,isnull(crmzdy_82068896,'') memo,isnull(crmzdy_82068919,'') label,convert(varchar(10),ec.create_time,120)create_time,ec.crm_syrID ls_selected,isnull(crmzdy_82326474,'') gym_selected,isnull(crmzdy_82068892,'') email,ec.edit_name,ec.cust_name,ec.update_time from crm_zdytable_238592_27128_238592_view ec join (select 1 x)x on 1=1 @condition left join crm_sj_238592_view jt on ec.crm_name=jt.crmzdy_80620120";
const sql_channel = "select crm_name name,id from crm_zdytable_238592_25112_238592_view where crmzdy_81755551=1 and crmzdy_81620405_id=0 union all select crm_name,id from crm_zdytable_238592_25112_238592_view where crmzdy_81755551=1 and crmzdy_81620405_id=@idgym for json path;";
const sql_client_upt = "";
const sql_client_crt = "";

export function fetchList(cxt) {
  let condition=[];
  if(cxt.account.acl!="系统管理员"&&charindex('中心运营总监',cxt.account.acl)==0){
    condition.push("crm_syrID="+cxt.account.id)
  }
  if(cxt.account.acl!="系统管理员"){
    condition.push("crm_syrID='"+JSON.stringify(cxt.account.gyms[0])+"");
  }
 
  let sql=sql_list.replace("@condition",(condition.length>0?'and ':'')+condition.join(" and "));
  
  let option={pageSize:cxt.listQuery.limit,pageNow:cxt.listQuery.page,condition:cxt.listQuery.condition,order:cxt.listQuery.sort};
  sql = cxt.fn_pager(sql,option);
  return request({
    baseURL: requestUrl,
    method: 'get',
    params: {sql1:sql}
  })
}
export function fetchChannel(cxt){
  let sql = sql_channel.replace("@idgym",cxt.temp.gym_selected&&cxt.temp.gym_selected.id)
  return request({
    baseURL: requestUrl,
    method: 'get',
    params: {sql1:sql}
  })
}

export function createClient(cxt){
  return request({
    baseURL: requestUrl,
    method: 'get',
    params: {sql1:sql_client_crt}
  })
}

export function updateClient(cxt){
  return request({
    baseURL: requestUrl,
    method: 'get',
    params: {sql1:sql_client_upt}
  })
}

