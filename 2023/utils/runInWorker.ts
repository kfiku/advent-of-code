const workerURL = './worker.ts'
const maxWorkers = 8 * 2
const workers = [{ id: 1, busy: false, worker: new Worker(workerURL, { type: 'module' }) }]

interface Task {
  key: number
  data: unknown
  status: 'ready' | 'started'
  callback: (result: unknown) => void
}
let workQueue: Task[] = []
let lastTaskId = 0

export function runInWorker(data: any) {
  return new Promise((resolve) => {
    workQueue.push({
      key: lastTaskId++,
      data,
      callback: resolve,
      status: 'ready',
    })

    goWorkerGo()
  })
}

function goWorkerGo() {
  if (workQueue.length) {
    const task = workQueue.find((task) => task.status === 'ready')

    if (task) {
      spawnWorker()
      const worker = workers.find((w) => !w.busy)

      if (worker) {
        task.status = 'started'
        worker.busy = true
        // console.log('RUN');
        worker.worker.onmessage = (e) => {
          const result = e.data

          workQueue = workQueue.filter((t) => t.key !== task.key)
          worker.busy = false

          task.callback(result)

          goWorkerGo()
        }

        worker.worker.postMessage(task.data)
      } else {
        return
      }
    } else {
      return
    }

    goWorkerGo()
  }
}

function spawnWorker() {
  if (workers.length < maxWorkers) {
    workers.push({ id: 1, busy: false, worker: new Worker(workerURL, { type: 'module' }) })
  }
}
