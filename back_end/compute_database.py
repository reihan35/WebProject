import os
import time
import re
from itertools import groupby
import json
import networkx as nx
import numpy as np
from matplotlib.pyplot import show

def read_book(book):
    # read the book
    f = open(book_dir + "/" + book, "r")
    txt = ' '.join(f.readlines())

    # Replace everything which is not a letter by a space
    txt = re.sub(r'[^a-zA-Z ]+', ' ', txt)

    return txt

def word_list(text):
    sorted_words = sorted(word \
                for word in text.lower().split())
    return (word for word, _ in groupby(sorted_words))

def word_frequencies(text):
    sorted_words = sorted(word \
                    for word in text.lower().split())
    return ((len(list(group)), word) for word, group in groupby(sorted_words))

def d_jaccard_of(i,j, book_index):
    M = np.sum(
        book_index[i] * (book_index[i] - book_index[j] >= 0) 
        + book_index[j] * (book_index[i] - book_index[j] < 0)
        )

    m = nb_words[i] + nb_words[j] - M

    return 1 - m/M

def build_graph(d_jaccard, seuil):
    G = nx.Graph()
    G.add_nodes_from(range(len(books)))
    G.add_weighted_edges_from(
        (i,j,d_jaccard[i][j]) 
        for i in range(len(books)) 
        for j in range(len(books)) 
        if d_jaccard[i][j] < seuil)

    return G

if __name__ == "__main__":
    
    nb_books = 200
    start_time = time.time()  

    # Directory of the books
    book_dir = "book_test"

    # Load books file names
    books = [b for b in os.listdir(book_dir)][:nb_books]


    # List of words in the books

    t_words = time.time()

    words = dict()

    for i in range(len(books)):
        txt = read_book(books[i])
        for w in word_list(txt):
            if not w in words.keys():
                words[w] = len(words.keys())
        print("Read words %d / %d" % (i, len(books)))
    print("Nb words : %d" % len(words))
    print("Mots de taille < 3 : %d" % len([w for w in words.keys() if len(w) < 3]))
    print("Mots de taille 3 : %d" % len([w for w in words.keys() if len(w) == 3]))

    print("** Time words : %.3f seconds" % (time.time() - t_words))

    t_fill = time.time()


    # Building the index

    books_index = np.zeros((len(books), len(words.keys())), dtype=int)

    for i in range(len(books)):
        print("Fill book %d / %d" % (i, len(books)))
        txt = read_book(books[i])
        for (occ,w) in word_frequencies(txt):
            books_index[i][words[w]] = occ

    print("** Time fill books : %.3f seconds" % (time.time() - t_words))
    

    # Number of words in each books

    t_nbwords = time.time()
    nb_words = np.array([np.sum(books_index[i]) for i in range(len(books))])
    print("** Time sum words : %.3f seconds" % (time.time() - t_nbwords))


    # Compute jaccard distance

    t_jac = time.time()

    d_jaccard = [[0]*len(books) for _ in range(len(books))]

    for i in range(len(books)):
        print("Jaccard %d / %d" % (i, len(books)))
        for j in range(i):
            d_jaccard[i][j] = d_jaccard_of(i,j, books_index)
            d_jaccard[j][i] = d_jaccard[i][j]

    #print(d_jaccard)

    print("** Time jaccard : %.3f seconds" % (time.time() - t_jac))


    # Build graph
    
    t_graph = time.time()
    G = build_graph(d_jaccard, 0.7)
    print("** Time build graph : %.3f seconds" % (time.time() - t_graph))

    # Centrality index

    t_centr = time.time()
    closeness = nx.closeness_centrality(G)
    print("** Time centrality : %.3f seconds" % (time.time() - t_centr))
    

    # Write the json data

    
    t_json = time.time()

    """
    words_json = {}
    for w in list(words.keys()):
        for i in range(len(books_index)):
            words_json[w] = [int(books_index[i][words[w]]) for i in range(len(books_index))]
    """

    json_file = {}

    for i in range(len(books)):
        words_of_book = dict()
        for w in list(words.keys()):
            occ = int(books_index[i][words[w]])
            if occ != 0:
                words_of_book[w] = occ
        json_file[books[i]] = {
            "clos_index" : closeness[i],
            "words" : words_of_book
        }
        print("Book recorded : %d / %d" % (i,len(books)))

    print("json computed !")

    with open('data.json', 'w', encoding='utf-8') as outfile:
        json.dump({"data":json_file}, outfile)

    print("** Time JSON : %.3f seconds" % (time.time() - t_json))
    

    print("** Time elapsed : %.3f seconds" % (time.time() - start_time))