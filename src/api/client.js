import request from '@/utils/request'


const requestUrl="https://bbk.800app.com/uploadfile/staticresource/238592/279833/api_auto_json.aspx";
const ecUrl="https://bbk.800app.com/uploadfile/staticresource/238592/279833/dataInterface_sync_ec.aspx";
const sql_list= "select /*main*/ec.id,isnull(jt.id,0)idjt,isnull(crmzdy_82068889,'') client,isnull(ec.crm_name,'') phone,isnull(crmzdy_82068921,'') kid,isnull(crmzdy_82068893,'') group_selected,isnull(crmzdy_82068894,'') sex,isnull(crmzdy_82068917,'') channel,isnull(crmzdy_82068918,'') industry,isnull(crmzdy_82068895,'') addr,isnull(crmzdy_82068919,'') label,convert(varchar(10),ec.create_time,120)create_time,isnull(ec.crmzdy_85213104,'') ls_selected,isnull(crmzdy_82326474,'') gym_selected,isnull(crmzdy_82068892,'') email,ec.edit_name,ec.cust_name,ec.update_time from crm_zdytable_238592_27128_238592_view ec join (select 1 x)x on @condition left join crm_sj_238592_view jt on ec.crm_name=jt.crmzdy_80620120";
const sql_channel = "select (select  * from (select  crm_name name,id from crm_zdytable_238592_25112_238592_view where crmzdy_81755551=1 and crmzdy_81620405_id=0 union all select crm_name,id from crm_zdytable_238592_25112_238592_view where crmzdy_81755551=1 and crmzdy_81620405_id=@idgym ) a  for json path);";
let sql_client_upt = "declare @data varchar(max)='@form';with s as(select top 1 238592 org_id,'@iduser'cust_id,'@iduser'crm_syrid,json_query(@data,'$.ls_selected')follower,getdate()create_time,json_value(@data,'$.phone')phone,json_value(@data,'$.client')client,json_value(@data,'$.kid')kid,json_value(@data,'$.sex')sex,json_value(@data,'$.birth')birth,json_value(@data,'$.email')email,json_value(@data,'$.addr')addr,json_value(@data,'$.industry')industry,json_value(@data,'$.group_selected')group_selected,json_value(@data,'$.label')label,json_value(@data,'$.memo')memo,json_query(@data,'$.gym_selected')gym,json_query(@data,'$.channel')channel,json_value(@data,'$.id')id from crm_yh_238592_view) update t set org_id=s.org_id,cust_id=s.cust_id,crm_syrid=s.crm_syrid,crmzdy_85213104=s.follower,create_time=s.create_time,crm_name=s.phone,crmzdy_82068889=s.client,crmzdy_82068921=s.kid,crmzdy_82068894=s.sex,crmzdy_82068891=s.birth,crmzdy_82068892=s.email,crmzdy_82068895=s.addr,crmzdy_82068918=s.industry,crmzdy_82068893=s.group_selected,crmzdy_82068919=s.label,crmzdy_82068896=s.memo,crmzdy_82326474=s.gym,crmzdy_82068917=s.channel from s,crm_zdytable_238592_27128_238592 t where t.id=s.id;select '@sql' sql,0 errmsg for json path,without_array_wrapper;"
let sql_client_crt = "declare @data varchar(max)='@form';insert into crm_zdytable_238592_27128_238592(org_id,cust_id,crm_syrID,crmzdy_85213104/*follower*/,create_time,crm_name/*phone*/,crmzdy_82068889/*name*/,crmzdy_82068921/*othername*/,crmzdy_82068894/*sex*/,crmzdy_82068891/*birth*/,crmzdy_82068892/*email*/,crmzdy_82068895/*addr*/,crmzdy_82068918/*industry*/,crmzdy_82068893/*group*/,crmzdy_82068919/*label*/,crmzdy_82068896/*memo*/,crmzdy_82326474/*gym*/,crmzdy_82068917/*channel*/)";
sql_client_crt += "select top 1 238592,'@iduser','@iduser',JSON_query(@data,'$.ls_selected'),getdate(),JSON_VALUE(@data,'$.phone'),JSON_VALUE(@data,'$.client'),JSON_VALUE(@data,'$.kid'),JSON_VALUE(@data,'$.sex'),JSON_VALUE(@data,'$.birth'),JSON_VALUE(@data,'$.email'),JSON_VALUE(@data,'$.addr'),JSON_VALUE(@data,'$.industry'),JSON_VALUE(@data,'$.group_selected'),JSON_VALUE(@data,'$.label'),JSON_VALUE(@data,'$.memo'),JSON_query(@data,'$.gym_selected'),JSON_query(@data,'$.channel') from crm_yh_238592_view;";
sql_client_crt += "select '@sql' sql,0 errmsg for json path,without_array_wrapper";

//ec
let qstr = "select * into #cc from(select crmzdy_82058177 idjt,camp.id,camp.crmzdy_82053647 gym,camp.crm_name phone,isnull(nullif(crmzdy_82053557,''),'未处理') status,isnull(dateadd(s,crmzdy_82053430+8*3600,'1970-01-01 00:00:00'),convert(varchar(20),create_time,120))dtenrol,crmzdy_82051555 centerid,crmzdy_82053258 campaign,crmzdy_82051555 sign_centerid,crmzdy_82051554 babyage,isnull(crmzdy_82051553,'') babyname,case when charindex('-',crmzdy_82051554)=5 then crmzdy_82051554 when ISNUMERIC(crmzdy_82051554)=1 then dateadd(year,0-crmzdy_82051554,getdate()) else '' end birth,crmzdy_82053558 remark,convert(varchar(20),camp.create_time,120)create_time from crm_zdytable_238592_27045_238592_view camp where id in(@ids))c;"
//jt
qstr += "DECLARE @gt table(cust_id bigint,crm_syrID bigint,idzx bigint,idjt bigint,memo nvarchar(4000),memo2 nvarchar(4000),gymcode varchar(20),idcampaign varchar(100));"
qstr += "insert into crm_sj_238592(org_id,cust_id,crm_syrID,crmzdy_81535047_id,crmzdy_81535045_id/*ls*/,create_time,crm_surname,crmzdy_81988104/*hz*/,crmzdy_81988100/*birth*/,crmzdy_80620120/*phone*/,crmzdy_80620075/*gymName*/,crmzdy_80620075_id/*idgym*/,crmzdy_82021212/*code*/,crmzdy_81486365/*prov*/,crmzdy_81486367/*city*/,crmzdy_80652377/*relation*/,crmzdy_81497202/*quality*/,crmzdy_80620126/*memo*/,crmzdy_81620165/*zxdt*/,crmzdy_81755583_id,crmzdy_81535090_id)"
qstr += "select 238592,@iduser,gym.crm_syrID,@iduser,@iduser,getdate(),babyname+'家长',babyname,birth,phone,gym.crm_name,gym.id,gym.crmzdy_80620116,crmzdy_81744958,crmzdy_81744959,'无','无',remark,getdate(),idchannel,idchannel from #cc join crm_zdytable_238592_23594_238592_view gym on gym.crmzdy_80620116=#cc.centerid left join crm_sj_238592_view jt on jt.crmzdy_80620120=#cc.phone where jt.crm_surname is null;"
//zx
qstr += "insert into crm_zdytable_238592_25111_238592(org_id,cust_id,crm_syrID,create_time,crm_name,crmzdy_81741656 /*备注*/,crmzdy_81802275 /*gthz*/,crmzdy_81620171_id /*中心*/,crmzdy_81636452_id /*负责老师*/,crmzdy_81620164_id /*接待老师*/,crmzdy_81620163 /*咨询日期*/,crmzdy_81636187 /*质量评估*/,crmzdy_81769392 /*中心编号*/,crmzdy_81620162_id/*中心获得家长信息的渠道*/,crmzdy_81755584_id  /*家长是从哪里了解到小小运动馆的*/,crmzdy_81611091_id /*家庭*/,crmzdy_81757915 /*家庭ID*/,crmzdy_87673451)"
qstr += "output INSERTED.cust_id ,INSERTED.crm_syrID,INSERTED.id,INSERTED.crmzdy_81611091_id,INSERTED.crmzdy_81741656,INSERTED.crmzdy_81802275,INSERTED.crmzdy_81769392,inserted.crmzdy_87673451  into @gt "
qstr += "select 238592,@iduser,gym.crm_syrID,getdate(),gym.crm_name+'-'+cast(jt.id as varchar),remark 备注,'|'+convert(varchar(10),getdate(),120)+',@user:'+remark,gym.id 中心,@iduser 负责老师,@iduser 接待老师,getdate() 咨询日期,'无' 质量评估,#cc.centerid,#cc.idchannel,#cc.idchannel,jt.id,jt.id,#cc.id from #cc join crm_sj_238592_view jt on jt.crmzdy_80620120=#cc.phone join crm_zdytable_238592_23594_238592_view gym on gym.crmzdy_80620116=#cc.centerid left join crm_zdytable_238592_25111_238592_view zx on zx.crmzdy_81611091_id=jt.id and gym.id=zx.crmzdy_81620171_id where zx.crm_name is null;"
//gt
qstr +="insert into crm_zdytable_238592_25121_238592(crm_name,crmzdy_81762823/*type*/,org_id,cust_id,crm_syrID,create_time,crmzdy_81748926_id/*idZx*/,crmzdy_81748934/*内容*/,crmzdy_81803726/*content2*/,crmzdy_81762900/*gymcode*/)"
qstr +="select upper('JTGTJL-')+cast(idzx as varchar)+'-'+convert(varchar(8),getdate(),112)+'B','潜在会员沟通',238592,cust_id,crm_syrid,getdate(),idzx,memo,memo2,gymcode from @gt where len(memo)>0;"
//hz
qstr +="insert into crm_zdytable_238592_23893_238592(crm_name,org_id,cust_id,crm_syrid,create_time,crmzdy_81783222/*idjt*/,crmzdy_80653840_id/*idjt*/,crmzdy_80653845/*babybrithday*/)select babyname,238592,@iduser,@iduser,getdate(),jt.id,jt.id,birth from #cc  join crm_sj_238592_view jt on jt.crmzdy_80620120=#cc.phone left join crm_zdytable_238592_23893_238592_view hz on hz.crmzdy_80653840_id=jt.id and hz.crm_name=babyname where hz.crm_name is null;"

//初始化中心搜索和综合搜索
qstr +="update jt set crmzdy_81802271/*hz*/=(select crm_name+',' from crm_zdytable_238592_23893_238592_view hz where hz.crmzdy_80653840_id=jt.id FOR XML PATH('')),crmzdy_80610668/*hz+age*/=(select crm_name+' '+crmzdy_81497217+',' from crm_zdytable_238592_23893_238592_view hz where hz.crmzdy_80653840_id=jt.id FOR XML PATH('')),crmzdy_82021205/*hz+birth*/=(select crm_name+' '+ convert(varchar(10),crmzdy_80653845,120)+',' from crm_zdytable_238592_23893_238592_view hz where hz.crmzdy_80653840_id=jt.id FOR XML PATH('')) from crm_sj_238592_view jt join crm_zdytable_238592_25111_238592_view zx on zx.crmzdy_87673451 in (@ids) and jt.id=zx.crmzdy_81611091_id;"
qstr +="update jt set crmzdy_81767199/*search*/=/*家长姓名*/isnull(crm_surname,'')+','+/*手机*/isnull(crmzdy_80620120,'')+/*hz*/isnull(crmzdy_80610668,''),crmzdy_81778300/*中心*/=(select crmzdy_81620171+',' from crm_zdytable_238592_25111_238592_view zx where zx.crmzdy_81611091_id=jt.id FOR XML PATH('')) from crm_sj_238592_view jt join crm_zdytable_238592_25111_238592_view zx on zx.crmzdy_87673451 in (@ids) and jt.id=zx.crmzdy_81611091_id;"
//update idjt for campaign
qstr +="update camp set crmzdy_82058177 =zx.crmzdy_81611091_id,crmzdy_82053557=case when isnull(crmzdy_82053557,'未处理')='未处理' then '处理中' else crmzdy_82053557 end  from crm_zdytable_238592_25111_238592_view zx join crm_zdytable_238592_27045_238592_view camp on zx.crmzdy_87673451 in (@ids) and zx.crmzdy_87673451=camp.id;"
//result info
qstr +="select top 1 0 errcode,'ok' errmsg,'@sql' sql from crm_yh_238592_view for json auto,without_array_wrapper;";

export function fetchList(cxt) {
  let condition=[];
  if(cxt.account.acl!="系统管理员"&&charindex('中心运营总监',cxt.account.acl)==0){
    condition.push("crm_syrID="+cxt.account.id)
  }
  if(cxt.account.acl!="系统管理员"){
    condition.push("crm_syrID='"+JSON.stringify(cxt.account.gyms[0])+"");
  }
  if(cxt.listQuery.dtzx){
    condition.push("create_time between '@dtstart' and '@dtend'".replace("@dtstart",cxt.listQuery.dtzx[0]).replace("@dtend",cxt.listQuery.dtzx[1]));
  }
  condition=condition.concat(cxt.advSearchWhere);
  cxt.advSearchWhere=[];
  let sql=sql_list.replace("@condition",condition.length==0?'1=1':condition.join(" and "));
  
  let option={pageSize:cxt.listQuery.limit,pageNow:cxt.listQuery.page,condition:cxt.searchWhere,order:cxt.listQuery.sort};
  sql = cxt.fn_pager(sql,option);
  return request({
    baseURL: requestUrl,
    method: 'get',
    params: {sql1:sql}
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
    baseURL: ecUrl,
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

