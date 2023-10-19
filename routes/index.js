var express = require('express');
var router = express.Router();
var fs = require('fs')
var path = require('path')

const dbPath = path.resolve('./db.json')
const getDB = () => fs.readFileSync(dbPath, 'utf-8')


const task = () => {
  const date = new Date()
  
  let data = getDB()

  data = JSON.parse(data)

  if (date.getHours() === 6 && date.getMinutes() === 0 && date.getSeconds() === 0) {
    data.task = []
  }
  fs.writeFileSync(dbPath, JSON.stringify(data))

  setTimeout(() => {
    task()  
  }, 1000)
}

task()


router.get('/data', (req ,res) => {
  const data = getDB()
  
  return res.json(JSON.parse(data))
})


// 兑换
router.get('/reward', (req, res) => {
  const star = parseInt(req.query.star, 10)
  const isDiamond = !!parseInt(req.query.diamond, 10);
  const name = req.query.name || ''

  let data = getDB()
  
  data = JSON.parse(data)


  data.star = parseInt(data.star, 10) - star
  
  if (data.star < 0) {
    return res.json({ code: 0, msg: '兑换失败！' })
  }

  if (isDiamond) {
    data.diamond = parseInt(data.diamond, 10) + 1
  }

  data.log.unshift({ time: Date.now(), name: name })

  fs.writeFileSync(dbPath, JSON.stringify(data))
  return res.json({ code: 1, msg: '兑换成功！' })
})

// 创建任务
router.post('/task/new', (req, res) => {
  let data = getDB()

  data = JSON.parse(data)

  data.task.push({ ...req.body, id: Date.now(), isDone: false })

  fs.writeFileSync(dbPath, JSON.stringify(data))
  return res.json({ code: 1, msg: '创建任务成功' })
})

// 查询任务
router.get('/task', (req, res) => {
  let data = getDB()

  return res.json(JSON.parse(data))
})

// 完成任务
router.get('/task/done', (req, res) => {
  const id = req.query.id
  
  let data = getDB()
  data = JSON.parse(data)
  const index = data.task.findIndex(item => parseInt(item.id, 10) === parseInt(id, 10))

  data.star = parseInt(data.star, 10) + parseInt(data.task[index].star, 10)
  data.task[index] = {
    ...data.task[index],
    isDone: true
  }
  fs.writeFileSync(dbPath, JSON.stringify(data))
  return res.json({ code: 1, msg: '完成任务！' })
})

router.get('/task/delete', (req, res) => {
  const id = req.query.id
  
  let data = getDB()
  data = JSON.parse(data)
  data.task = data.task.filter(item => item.id !== parseInt(id, 10))
  fs.writeFileSync(dbPath, JSON.stringify(data))
  return res.json({ code: 1, msg: '删除成功！' })
})

router.get('/log', (req, res) => {
  const data = getDB()
  
  return res.json(JSON.parse(data))
})



// 保存任务
router.post('/task/save', (req, res) => {
  let data = getDB()

  data = JSON.parse(data)

  data.saveTask.push({ ...req.body, id: Date.now() })

  fs.writeFileSync(dbPath, JSON.stringify(data))
  return res.json({ code: 1, msg: '保存任务成功' })
})

// 删除保存任务
router.get('/task/save/delete', (req, res) => {
  const id = req.query.id
  
  let data = getDB()
  data = JSON.parse(data)
  data.saveTask = data.saveTask.filter(item => item.id !== parseInt(id, 10))
  fs.writeFileSync(dbPath, JSON.stringify(data))
  return res.json({ code: 1, msg: '删除成功！' })
})


// 保存设置
router.post('/save/setting', (req, res) => {
  let data = getDB()

  data = JSON.parse(data)

  data = {...data, ...req.body }

  fs.writeFileSync(dbPath, JSON.stringify(data))
  return res.json({ code: 1, msg: '保存设置成功' })
})
module.exports = router;
