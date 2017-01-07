export type Task = (...any) => any;


export default function asap(task: Task, ...args) {
  queue.push([task, args]);
  requestFlush();
}


function requestFlush() {
  if (!flushing) {
    flushing = true;
    flush();
  }
}

function flush() {
  while (queue.length > 0) {
    const [task, args] = queue.shift() as [Task, any[]];
    task.apply(null, args);
  }

  flushing = false;
}

const queue: Array<[Task, any[]]> = [];
let flushing: boolean = false;
