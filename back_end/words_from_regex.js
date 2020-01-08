// Generate the word list from the regex :

function words_from(regex, size_max) {
    switch (regex.root) {
        case CONCAT:
            var l1 = words_from(regex.subTrees[0], size_max-1);
            var l2 = words_from(regex.subTrees[1], size_max-1);
            var result = []
            for (var i in l1) {
                w1 = l1[i];
                for (var j in l2) {
                    w2 = l2[j];
                    if (w1.length + w2.length < size_max) result.push(w1+w2);
                }
            }
            return result;
        case ETOILE:
            var content = words_from(regex.subTrees[0], size_max)
            var result = content;
            var last_words = content
            while (last_words.length != 0) {
                let new_words = []
                for (var i in content) {
                    w1 = content[i];
                    for (var j in last_words) {
                        w2 = last_words[j]
                        if (w1.length + w2.length < size_max
                            && !result.some((word) => word == w1+w2)) {
                            result.push(w1+w2);
                            new_words.push(w1+w2);
                        }
                    }
                }
                last_words = new_words;
            }
            return result;
        case ALTERN:
            var l1 = words_from(regex.subTrees[0], size_max-1);
            var l2 = words_from(regex.subTrees[1], size_max-1);
            for (var i in l2) {
                l1.push(l2[i]);
            }
            return l1;
        default:
            return [regex.root];
    }
}

// Test the code :

let regex = "(a|b)*c.def";
console.log("RegEx : ", regex);

let result_parse = parse_regEx(regex);
console.log("Résultat parseur :");
console.log(result_parse.toString());
console.log(result_parse);

console.log("List of words from the RegEx :");

// size_max : taille max des mots calculés à partir de la regex
let size_max = 10
let words = words_from(result_parse,10);

for (var i in words) {
    console.log(words[i])
}

