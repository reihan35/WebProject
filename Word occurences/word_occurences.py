import os
import time
import re
from itertools import groupby
import json

def word_frequencies(text):
    """ Return the generator (occurence, word) for each word of text.
        All letters are changed to lowercase. """
    sorted_words = sorted(word \
                        for word in text.lower().split())
    return ((len(list(group)), word) for word, group in groupby(sorted_words))

def fill_data (occur, ind_book):
    """ Fill the json data which already received i books
        with the occurence (n, word). """
    if occur[1] in data.keys():
        data[occur[1]].append(occur[0])  
    else:
        data[occur[1]] = [0]*ind_book + [occur[0]]

def fill_empty_data (ind_book):
    """ Add 0 if data[word] has no value for this book """
    [data[word].append(0) for word in data.keys() if len(data[word]) == ind_book ]

def read(book, ind_book):
    """ Open a book and record each word with its number of occurences. """
    # read the book
    f = open(book_dir + "/" + book, "r")
    txt = ' '.join(f.readlines())

    # Replace everything which is not a letter by a space
    txt = re.sub(r'[^a-zA-Z]+', ' ', txt)

    # Fill the json data
    [fill_data(occur, ind_book) for occur in word_frequencies(txt)]
    fill_empty_data(ind_book)

    print("book %d" % ind_book)



if __name__ == "__main__":

    start_time = time.time()  

    # Directory of the books
    book_dir = "books_data"

    # Load books file names
    books = [b for b in os.listdir(book_dir) if b[-4:] == ".txt"]

    # Json data
    data = {}

    # Read books
    print("** Reading books ..")
    [read(books[i], i) for i in range(len(books))]

    # Write the json data
    print ("** Writing data ..")
    with open('data.txt', 'w') as outfile:
        json.dump(data, outfile)

    print("** Time elapsed : %s seconds" % (time.time() - start_time))
