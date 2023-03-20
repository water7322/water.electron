// ### 调度器
// 有一堆异步的promise任务（比如ajax请求）需要处理，要求实现一个任务调度器，能够控制同一时刻的最大并发数量，返回一个promise，同时根据数组原顺序返回结果数组

function taskQueue(taskArr, maxCount) {
    return new Promise((resolve, reject) => {
        const res = [];
        const n = taskArr.length;
        let index = 0;
        let finishCount = 0;
        while (index < maxCount) {
            next();
        }
        function next() {
            const curIndex = index;
            index++;
            taskArr[curIndex]().then((data) => {
                res[curIndex] = data;
            }, (e) => {
                res[curIndex] = e;
            }).finally(() => {
                finishCount++;
                if (finishCount === n) resolve(res);
                if (index < n) next();
            });
        }
    });
}
