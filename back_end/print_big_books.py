# Project files
import book_functions as bf

if __name__ == "__main__":

    books_path = "book_test"
    max = None

    books = bf.import_books(books_path, max)

    for i in range(len(books)):
        nb_words = bf.nb_words_of(books_path + "/" + books[i]) 
        if nb_words > 20000:
            print("%s : %d" % (books[i], nb_words))
        if (i % 100 == 0):
            print ("%d / %d" % (i,len(books)))  
    