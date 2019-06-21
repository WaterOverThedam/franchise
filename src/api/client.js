import request from '@/utils/request'


const requestUrl="https://bbk.800app.com/uploadfile/staticresource/238592/279833/api_auto_json.aspx";
const frUrl="http://localhost:8081/api/listFranApp";
//const frUrl="https://interface.thelittlegym.com.cn/api/api/listFranApp";
const sql_list= "select /*main*/ec.id,isnull(jt.id,0)idjt,isnull(crmzdy_82068889,'') client,isnull(ec.crm_name,'') phone,isnull(crmzdy_82068921,'') kid,isnull(crmzdy_82068893,'') group_selected,isnull(crmzdy_82068894,'') sex,isnull(crmzdy_82068917,'') channel,isnull(crmzdy_82068918,'') industry,isnull(crmzdy_82068895,'') addr,isnull(crmzdy_82068919,'') label,convert(varchar(10),ec.create_time,120)create_time,isnull(ec.crmzdy_85213104,'') ls_selected,isnull(crmzdy_82326474,'') gym_selected,isnull(crmzdy_82068892,'') email,ec.edit_name,ec.cust_name,ec.update_time from crm_zdytable_238592_27128_238592_view ec join (select 1 x)x on @condition left join crm_sj_238592_view jt on ec.crm_name=jt.crmzdy_80620120";
const sql_channel = "select (select * from (select  crm_name name,id from crm_zdytable_238592_25112_238592_view where crmzdy_81755551=1 and crmzdy_81620405_id=0 union all select crm_name,id from crm_zdytable_238592_25112_238592_view where crmzdy_81755551=1 and crmzdy_81620405_id=@idgym ) a  for json path);";
let sql_client_upt = "declare @data varchar(max)='@form';with s as(select top 1 238592 org_id,'@iduser'cust_id,'@iduser'crm_syrid,json_query(@data,'$.ls_selected')follower,getdate()create_time,json_value(@data,'$.phone')phone,json_value(@data,'$.client')client,json_value(@data,'$.kid')kid,json_value(@data,'$.sex')sex,json_value(@data,'$.birth')birth,json_value(@data,'$.email')email,json_value(@data,'$.addr')addr,json_value(@data,'$.industry')industry,json_value(@data,'$.group_selected')group_selected,json_value(@data,'$.label')label,json_value(@data,'$.memo')memo,json_query(@data,'$.gym_selected')gym,json_query(@data,'$.channel')channel,json_value(@data,'$.id')id from crm_yh_238592_view) update t set org_id=s.org_id,cust_id=s.cust_id,crm_syrid=s.crm_syrid,crmzdy_85213104=s.follower,create_time=s.create_time,crm_name=s.phone,crmzdy_82068889=s.client,crmzdy_82068921=s.kid,crmzdy_82068894=s.sex,crmzdy_82068891=s.birth,crmzdy_82068892=s.email,crmzdy_82068895=s.addr,crmzdy_82068918=s.industry,crmzdy_82068893=s.group_selected,crmzdy_82068919=s.label,crmzdy_82068896=s.memo,crmzdy_82326474=s.gym,crmzdy_82068917=s.channel from s,crm_zdytable_238592_27128_238592 t where t.id=s.id;select '@sql' sql,0 errmsg for json path,without_array_wrapper;"
let sql_client_crt = "declare @data varchar(max)='@form';insert into crm_zdytable_238592_27128_238592(org_id,cust_id,crm_syrID,crmzdy_85213104/*follower*/,create_time,crm_name/*phone*/,crmzdy_82068889/*name*/,crmzdy_82068921/*othername*/,crmzdy_82068894/*sex*/,crmzdy_82068891/*birth*/,crmzdy_82068892/*email*/,crmzdy_82068895/*addr*/,crmzdy_82068918/*industry*/,crmzdy_82068893/*group*/,crmzdy_82068919/*label*/,crmzdy_82068896/*memo*/,crmzdy_82326474/*gym*/,crmzdy_82068917/*channel*/)";
sql_client_crt += "select top 1 238592,'@iduser','@iduser',JSON_query(@data,'$.ls_selected'),getdate(),JSON_VALUE(@data,'$.phone'),JSON_VALUE(@data,'$.client'),JSON_VALUE(@data,'$.kid'),JSON_VALUE(@data,'$.sex'),JSON_VALUE(@data,'$.birth'),JSON_VALUE(@data,'$.email'),JSON_VALUE(@data,'$.addr'),JSON_VALUE(@data,'$.industry'),JSON_VALUE(@data,'$.group_selected'),JSON_VALUE(@data,'$.label'),JSON_VALUE(@data,'$.memo'),JSON_query(@data,'$.gym_selected'),JSON_query(@data,'$.channel') from crm_yh_238592_view;";
sql_client_crt += "select '@sql' sql,0 errmsg for json path,without_array_wrapper";

 

export function fetchList(cxt) {
  let params=cxt.listQuery;
  let option={pageSize:params.limit,pageNum:params.page,keyWord:cxt.search.value.trim(),sort:params.sort};
  option.dtBegin=params.dtzx&&params.dtzx[0];
  option.dtEnd=params.dtzx&&params.dtzx[1];
  return request({
    baseURL: frUrl,
    method: 'post',
    params: option
  })
}
export function fetchChannel(cxt){
  let sql = sql_channel.replace("@idgym",cxt.temp.gym_selected&&cxt.temp.gym_selected.id||0)
  return request({
    baseURL: requestUrl,
    method: 'get',
    params: {sql1:sql}
  })
}

export function createClient(cxt){
  console.log(cxt.account)
  var sql = sql_client_crt;
  sql=sql.replace("@form",JSON.stringify(cxt.temp))
  sql=sql.replace("@iduser",cxt.account&&cxt.account.id||'')

  return request({
    baseURL: requestUrl,
    method: 'get',
    params: {sql1:sql}
  })
}


export function syncOASIS(sql){
  return request({
    baseURL: frUrl,
    method: 'get',
    params: {sql1:sql}
  })
}

export function updateClient(cxt){
  var sql = sql_client_upt;
  sql=sql.replace("@form",JSON.stringify(cxt.temp))
  sql=sql.replace("@iduser",cxt.account&&cxt.account.id||'')

  return request({
    baseURL: requestUrl,
    method: 'get',
    params: {sql1:sql}
  })
}

