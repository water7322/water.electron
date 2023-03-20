// 给一个二维数组，输出其所有笛卡尔积组合，例如：[['a', 'b'], ['c', 'd'], ['e']] => ['ace', 'ade', 'bce', 'bde'];

function test(arr) {
    const m = arr.length;
    if (m === 0) return [];
    const results = [];

    function rec(i, j, res) {
        if (i === m) {
            results.push(res);
            return;
        }
        if (arr[i].length === 0) {
            rec(i + 1, 0, res);
            return;
        }
        if (j === arr[i].length) return;
        rec(i + 1, 0, res + arr[i][j]);
        rec(i, j + 1, res);
    }

    rec(0, 0, '');
    console.log(results);
}
test([['a', 'b', 'c'], ['c', 'd'], ['e'], [], ['f', 'g']]);

function cartesianProductOf(arr) {
    return arr.reduce((a, b) => {
        const ret = [];
        a.forEach((a) => {
            b.forEach((b) => {
                ret.push(a.concat([b]));
            });
        });
        return ret;
    }, [[]]);
}

console.log(cartesianProductOf([['a', 'b', 'c'], ['c', 'd'], ['e'], ['f', 'g']]))
