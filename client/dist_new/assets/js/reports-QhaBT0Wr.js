import{B as o,R as r}from"./admin-BEbH6h__.js";async function s({gameId:a,reason:t,message:i=""}){return(await r.post(o.REPORTS,{game_id:a,reason:t,message:i})).data}export{s as submitReport};
