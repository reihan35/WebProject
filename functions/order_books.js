

exports.order_books = function(kw_booklist, kwlist, nb_books) {

    var books_by_number_of_words = [];
    var books_by_number_of_words_order = [];
    for(i = 0; i < nb_books; i++){
      books_by_number_of_words.push([]);
    }
  
    for(p = 0; p <= kwlist.length; p++){
     books_by_number_of_words_order.push([]);
    }
    for (var j in kwlist){
      books = kw_booklist[j]
      for (var l in books) {
          (books_by_number_of_words[books[l]]).push(kwlist[j])
      }
    }
    
    for (var n in books_by_number_of_words){
        for (s=1;s<=kwlist.length;s++) {
            if (books_by_number_of_words[n].length == s ){
                (books_by_number_of_words_order[kwlist.length - s + 1]).push([n,books_by_number_of_words[n]])
            }
        }
    }
  
    return books_by_number_of_words_order

}