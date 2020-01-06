// Macros
let CONCAT = 0xC04CA7;
let ETOILE = 0xE7011E;
let ALTERN = 0xA17E54;
let PROTECTION = 0xBADDAD;

let PARENTHESEOUVRANT = 0x16641664;
let PARENTHESEFERMANT = 0x51515151;
let DOT = 0xD07;

function charToRoot(c) {
    if (c=='.') return DOT;
    if (c=='*') return ETOILE;
    if (c=='|') return ALTERN;
    if (c=='(') return PARENTHESEOUVRANT;
    if (c==')') return PARENTHESEFERMANT;
    return c;
}

let RegExTree = class {

    constructor(root, subTrees) {
        this.root = root;
        this.subTrees = subTrees;
    }

    rootToString() {
        if (this.root==CONCAT) return ".";
        if (this.root==ETOILE) return "*";
        if (this.root==ALTERN) return "|";
        if (this.root==DOT) return ".";
        return this.root;
    }

    toString() {
        if (this.subTrees.length == 0) {
            return this.rootToString();
        }
        else {
            let result = this.rootToString() +"(";
            for (var i in this.subTrees) {
                result += this.subTrees[i].toString() + ",";
            }
            result += this.subTrees[this.subTrees.length-1].toString() + ")";
            return result;
        }
    }
}

function parse(regEx) {
    let result = []
    for (var i in regEx) {
        result.push(new RegExTree(charToRoot(regEx[i]), []))
    }

    var i = 0;
    while (i<5 || containParenthese(result)){
        console.log(i);
        i+=1;
        result=processParenthese(result);
        console.log(i);
        i+=1
    }
    //while (containEtoile(result)) result=processEtoile(result);
    //while (containConcat(result)) result=processConcat(result);
    //while (containAltern(result)) result=processAltern(result);
    //if (result.size()>1) throw new Exception();

    console.log("test parseur :");
    console.log(result)
    for (i in result){
        console.log(result[i].toString());
    }
    return result[0]
    //return result 
}

function containParenthese (trees) {
    for (var i in trees) {
        t = trees[i]
        if (t.root==PARENTHESEFERMANT || t.root==PARENTHESEOUVRANT) {
            return true;
        }
    }
    return false
}

function processParenthese(trees) {
    let result = []
    var found = false;
    for (var i in trees) {
        t = trees[i]
        if (!found && t.root == PARENTHESEFERMANT) {
            var done = false;
            let content = [];
            while (!done && !(result.length == 0)) {
                if (result[result.length-1].root == PARENTHESEOUVRANT) {
                    done = true;
                    result.pop();
                }
                else {
                    content.push(result[result.length-1]);
                    result.pop();
                }
            }
            console.log("done",done)
            if (!done) throw "Erreur parenthesage";
            found = true;
            console.log("found if",found)
            let subTrees = [];
            subTrees.push(parse(content));
            result.push(new RegExTree(PROTECTION, subTrees));
        }
        else {
            result.push(t)
        }
        console.log("found end for",found)
    }
    console.log(found);
    if (!found) throw "Erreur parenthesage";
    return result
}

test_tree = new RegExTree(CONCAT,['a','b']);
console.log("test_tree :");
console.log(test_tree.toString());

let regex = "(a|b)*c.def";
let result_parse = parse(regex);
console.log("Résultat parseur :")
console.log(result_parse)


console.log("enf file RegEx");