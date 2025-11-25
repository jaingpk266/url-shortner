import fs from 'fs';
import path from 'path';

export default function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({message:'Only POST allowed'});
  const {id,url}=req.body;
  const file=path.join(process.cwd(),'data','links.json');
  const data=JSON.parse(fs.readFileSync(file));

  data[id]={ url, clicks:(data[id]?.clicks||0) };

  fs.writeFileSync(file, JSON.stringify(data,null,2));
  res.json({message:'Short link created: /'+id});
}