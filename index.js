import koa from 'koa'
import koaRouter from 'koa-router'
import koaBody from 'koa-body'
import path from 'path'
import koaStatic from 'koa-static'
import fs from 'fs'
import corsConfig from './config/cors'

import _res from './utils/response'

const app = new koa()
const router = koaRouter()

app.use(corsConfig)

app.use(koaStatic(path.join(__dirname, 'public')))

app.use(koaBody({
  multipart: true,
  formidable: {
    keepExtensions: true
  }
}))

// 上传单个文件
router.post('/upload', async ctx => {
  const file = ctx.request.files.file; // 获取上传文件
  const dir = ctx.request.body.dir || 'default' // 获取要指定的上传目录
  const basename = await saveFile(file, dir)
  const url = `${ctx.origin}/uploads/${dir}/${basename}`
  ctx.body = _res.suc({data: url})
})

router.post('/reader-book/upload', async ctx => {
  const file = ctx.request.files.file; // 获取上传文件
  const dir = 'reader-book' // 获取要指定的上传目录
  const basename = await saveFile(file, dir)
  const url = `${ctx.origin}/uploads/${dir}/${basename}`
  ctx.body = _res.suc({data: url})
})

// 上传多个文件
router.post('/uploads', async (ctx, next) => {
  const files = ctx.request.files.file; // 获取上传文件
  const dir = ctx.request.body.dir || 'default' // 获取要指定的上传目录
  const dirPath = await handleDir(dir)

  for (let file of files) {
    const basename = path.basename(file.path)
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    // 获取上传文件扩展名
    let filePath = dirPath + `${basename}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
  }
  return ctx.body = "上传成功！";
})

/**
 * 处理目录, 当目录不存在时创建目录
 */
async function handleDir(dir) {
  return new Promise(async resolve => {
    const dirPath = path.join(__dirname, `public/uploads/${dir}/`)
    try {
      await fs.accessSync(dirPath)
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log(`${dir}目录不存在, 创建目录`, dirPath)
        await fs.mkdirSync(dirPath)
      }
    }
    resolve(dirPath)
  })
}

/**
 * 保存文件
 * @returns {Promise<void>}
 */
function saveFile(file, dir) {
  return new Promise(async resolve => {
    const dirPath = await handleDir(dir)
    const basename = path.basename(file.path)
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    let filePath = dirPath + `${basename}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    resolve(basename)
  })
}

app.use(router.routes());

app.listen(3012, () => {
  console.log('启动成功')
  console.log('http://localhost:3012')
});
