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
            for (var i = 0; i < this.subTrees.length-1; +i++) {
                result += this.subTrees[i].toString() + ",";
            }
            result += this.subTrees[this.subTrees.length-1].toString() + ")";
            return result;
        }
    }
}

function parse_regEx(regEx) {
    var result = []
    for (var i in regEx) {
        result.push(new RegExTree(charToRoot(regEx[i]), []))
    }
    return parse(result);
}

function parse(result) {

    while (containParenthese(result)) result=processParenthese(result);
    while (containEtoile(result)) result=processEtoile(result);
    while (containConcat(result)) result=processConcat(result);
    while (containAltern(result)) result=processAltern(result);

    if (result.length > 1) throw "Syntax erreur in parsing : more than one subtree in result";
    if (result.length == 0) throw "Erreur parsing : result est vide"

    return removeProtection(result[0])
    
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
            if (!done) throw "Erreur parenthesage";
            found = true;
            let subTrees = [];
            subTrees.push(parse(content.reverse()));
            result.push(new RegExTree(PROTECTION, subTrees));
        }
        else {
            result.push(t)
        }
    }

    if (!found) throw "Erreur parenthesage";
    return result
}

function containEtoile (trees) {
    for (i in trees) {
        t = trees[i]
        if (t.root == ETOILE && t.subTrees.length == 0) return true;
    }
    return false;
}

function processEtoile (trees) {
    let result = [];
    var found = false;
    for (i in trees) {
        t = trees[i];
        if (!found && t.root == ETOILE && t.subTrees.length == 0) {
            if (result.length == 0) throw "Erreur syntaxe etoile";
            found = true;
            let last = result[result.length-1];
            result.pop();
            let subTrees = [];
            subTrees.push(last);
            result.push(new RegExTree(ETOILE, subTrees));
        }
        else {
            result.push(t);
        }
    }
    return result;
}

function containConcat (trees) {
    var firstFound = false;
    for (i in trees) {
        t = trees[i];
        if (!firstFound && t.root != ALTERN) {
            firstFound = true;
            continue;
        }
        if (firstFound) {
            if (t.root != ALTERN) return true;
            else firstFound = false;
        }
    }
    return false;
}

function processConcat (trees) {
    let result = [];
    var found = false;
    var firstFound = false;
    for (i in trees) {
        t = trees[i];
        if(!found && !firstFound && t.root != ALTERN) {
            firstFound = true;
            result.push(t);
            continue;
        }
        if (!found && firstFound && t.root == ALTERN) {
            firstFound = false;
            result.push(t);
            continue;
        }
        if (!found && firstFound && t.root != ALTERN) {
            found = true;
            let last = result[result.length-1];
            result.pop();
            let subTrees = [];
            subTrees.push(last);
            subTrees.push(t);
            result.push(new RegExTree(CONCAT,subTrees));
        }
        else {
            result.push(t);
        }
    }
    return result;
}

function containAltern (trees) {
    for (i in trees) {
        t = trees[i]
        if (t.root == ALTERN && t.subTrees.length == 0) return true;
    }
    return false;
}

function processAltern (trees) {
    let result = [];
    var found = false;
    var gauche = null;
    var done = false;
    for (i in trees) {
        t = trees[i];
        if (!found && t.root == ALTERN && t.subTrees.length == 0) {
            if (result.length == 0) throw "Erreur syntaxe Altern";
            found = true;
            gauche = result[result.length-1];
            result.pop();
            continue;
        }
        if (found && !done) {
            if (gauche == null) throw "Erreur syntaxe Altern";
            done = true;
            let subTrees = [];
            subTrees.push(gauche);
            subTrees.push(t);
            result.push(new RegExTree(ALTERN, subTrees));
        }
        else {
            result.push(t);
        }
    }
    return result;
}

function removeProtection (tree) {
    if (tree.root == PROTECTION && tree.subTrees.length != 1) {
        throw "Erreur de syntaxe parenthesage";
    }
    if (tree.subTrees.length == 0) {
        if (tree.root == DOT) tree.root = ".";
        return tree;
    }
    if (tree.root == PROTECTION) return removeProtection(tree.subTrees[0]);

    let subTrees = []
    for (i in tree.subTrees) subTrees.push(removeProtection(tree.subTrees[i]));
    return new RegExTree(tree.root, subTrees);
}



