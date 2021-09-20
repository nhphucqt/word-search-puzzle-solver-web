class Direction {
    constructor(_x = 0, _y = 0, _u = 0, _v = 0) {
        this.x = _x;
        this.y = _y;
        this.u = _u;
        this.v = _v;
    }
    dir() {
        if (this.x < this.u && this.y < this.v) return 0;
        if (this.x > this.u && this.y < this.v) return 1;
        if (this.x == this.u && this.y < this.v) return 2;
        return 3;
    }
}

const dx = [1, -1, 0, 1];
const dy = [1, 1, 1, 0];
var row = 0, col = 0;
var mat = [], words = [];
var dirListAllWords = [];
var dirListOfWord = [];
var mark = [];
var wordId = 0;

function getMatrix() {
    var inputText = document.getElementById("inputMatrix").value;
    mat = inputText.split('\n');
    for (let i = 0; i < mat.length; ++i) {
        mat[i] = mat[i].split(" ");
        mat[i] = mat[i].filter(x => { return x != ""; });
    }
    mat = mat.filter(x => { return x.length > 0; });
    row = mat.length;
    if (row > 0) col = mat[0].length;
}

function getWordList() {
    words = document.getElementById("inputWordList").value;
    words = words.split('\n');
    for (let i = 0; i < words.length; ++i) {
        words[i] = words[i].trim();
    }
    words = words.filter(x => { return x.length > 0; });
}

function Zfunc(s) {
    let n = s.length;
    let z = [];
    for (let i = 0; i < n; ++i) z.push(0);
    let x = 0, y = 0;
    for (let i = 1; i < n; ++i) {
        z[i] = Math.max(0, Math.min(z[i-x], y-i+1));
        while (i+z[i] < n && s[z[i]] == s[i+z[i]]) {
            x = i; y = i+z[i]; z[i]++;
        }
    }
    return z;
}

function solve(t) {
    let res = [], z = [], s = "";
    for (let i = 0; i < row; ++i) {
        s = "";
        for (let j = 0; j < col; ++j) {
            s += mat[i][j];
        }
        z = Zfunc(t+'#'+s);
        for (let j = t.length; j < z.length; ++j) {
            if (z[j] >= t.length) {
                res.push(new Direction(i, j-t.length-1, i, j-2));
            }
        }
    }
    for (let j = 0; j < col; ++j) {
        s = "";
        for (let i = 0; i < row; ++i) {
            s += mat[i][j];
        }
        z = Zfunc(t+'#'+s);
        for (let i = t.length; i < z.length; ++i) {
            if (z[i] >= t.length) {
                res.push(new Direction(i-t.length-1, j, i-2, j));
            }
        }
    }
    for (let i = 0; i < row; ++i) {
        s = "";
        for (let j = 0; i-j >= 0 && j < col; ++j)  {
            s += mat[i-j][j];
        }
        z = Zfunc(t+'#'+s);
        for (let j = t.length; j < z.length; ++j) {
            if (z[j] >= t.length) {
                let k = j - t.length - 1;
                res.push(new Direction(i-k, k, i-j+2, j-2));
            }
        }
        s = "";
        for (let j = 0; i+j < row && j < col; ++j) {
            s += mat[i+j][j];
        }
        z = Zfunc(t+'#'+s);
        for (let j = t.length; j < z.length; ++j) {
            if (z[j] >= t.length) {
                let k = j - t.length - 1;
                res.push(new Direction(i+k, k, i+j-2, j-2));
            }
        }
    }
    for (let j = 1; j < col; ++j) {
        s = "";
        for (let i = 0; row-1-i >= 0 && j+i < col; ++i) {
            s += mat[row-1-i][j+i];
        }
        z = Zfunc(t+'#'+s);
        for (let i = t.length; i < z.length; ++i) {
            if (z[i] >= t.length) {
                let k = i - t.length - 1;
                res.push(new Direction(row-1-k, j+k, row-i+1, j+i-2));
            }
        }
        s = "";
        for (let i = 0; i < row && j+i < col; ++i) {
            s += mat[i][j+i];
        }
        z = Zfunc(t+'#'+s);
        for (let i = t.length; i < z.length; ++i) {
            if (z[i] >= t.length) {
                let k = i - t.length - 1;
                res.push(new Direction(k, j+k, i-2, j+i-2));
            }
        }
    }
    return res;
}

function buildDirList() {
    dirListOfWord = [];
    dirListAllWords = [];
    for (let i = 0; i < words.length; ++i) {
        let dirList = solve(words[i]);
        dirList = dirList.concat(solve(words[i].split("").reverse().join("")));
        dirListOfWord.push(dirList);
        dirListAllWords = dirListAllWords.concat(dirList);

    }
}

function initMarkCell() {
    for (let i = 0; i < row; ++i) {
        mark.push([]);
        for (let j = 0; j < col; ++j) {
            mark[i].push(false);
        }
    }
}

function markCell(dirList) {
    for (let i = 0; i < row; ++i)
    for (let j = 0; j < col; ++j) {
        mark[i][j] = false;
    }
    for (let i = 0; i < dirList.length; ++i) {
        let id = dirList[i].dir();
        let x = dirList[i].x;
        let y = dirList[i].y;
        mark[x][y] = true;
        while (x != dirList[i].u || y != dirList[i].v) {
            x += dx[id]; y += dy[id];
            mark[x][y] = true;
        }
    }
}

function printResult() {
    let resultText = document.getElementById("resultText");
    resultText.innerHTML = "";
    let res = "";
    for (let i = 0; i < row; ++i) {
        for (let j = 0; j < col; ++j) {
            if (mark[i][j])
                res += "<mark>" + mat[i][j] + "</mark>";
            else 
                res += mat[i][j];
            res += " ";
        }
        res += "<br>";
    }
    resultText.innerHTML = res;
}

function printResultForAllWords() {
    document.getElementById("findWordText").innerHTML = "Find all words!<hr>";
    markCell(dirListAllWords);
    printResult();
    document.getElementById("findPrevButton").disabled = true;
    document.getElementById("findNextButton").disabled = true;
}

function printResultForWord(id) {
    document.getElementById("findWordText").innerHTML = "Find word #" + (id+1) + ": " + words[id] + "<hr>";
    markCell(dirListOfWord[id]);
    printResult();
}

function findEachWord() {
    if (dirListAllWords.length == 0) return;
    printResultForWord(wordId = 0);
    document.getElementById("findPrevButton").disabled = false;
    document.getElementById("findNextButton").disabled = false;
}

function findPrevWord() {
    if (--wordId < 0) wordId = words.length - 1;
    printResultForWord(wordId);
}

function findNextWord() {
    if (++wordId == words.length) wordId = 0;
    printResultForWord(wordId);
}

function puzzleSolve() {
    getMatrix();
    getWordList();
    buildDirList();
    initMarkCell();
    printResultForAllWords();
    document.getElementById("findAllButton").disabled = false;
    document.getElementById("findEachButton").disabled = false;
}