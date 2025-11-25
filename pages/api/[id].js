import fs from 'fs';
import path from 'path';
import data from '../../data/links.json';

export default function handler(req,res){
  const id=req.query.id;
  const file=path.join(process.cwd(),'data','links.json');

  if(!data[id]) return res.status(404).send('Not found');

  data[id].clicks = (data[id].clicks || 0) + 1;
  fs.writeFileSync(file, JSON.stringify(data,null,2));

  res.writeHead(302,{Location:data[id].url});
  res.end();
}