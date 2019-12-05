import os
import time
import re
from itertools import groupby
import json
import networkx as nx
import numpy as np
from matplotlib.pyplot import show

# Index

def word_frequencies(text):
    """ Return the generator (occurence, word) for each word of text.
        All letters are changed to lowercase. """
    sorted_words = sorted(word \
                        for word in text.lower().split())
    return ((len(list(group)), word) for word, group in groupby(sorted_words))

def fill_index (occur, ind_book):
    """ Fill the json data which already received ind_book books
        with the occurence (n, word). """
    if occur[1] in index.keys():
        index[occur[1]].append(occur[0])  
    else:
        index[occur[1]] = [0]*ind_book + [occur[0]]

def fill_empty_index (ind_book):
    """ Add 0 if data[word] has no value for this book """
    [index[word].append(0) for word in index.keys() if len(index[word]) == ind_book ]

def read(book, ind_book):
    """ Open a book and record each word with its number of occurences. """
    # read the book
    f = open(book_dir + "/" + book, "r")
    txt = ' '.join(f.readlines())

    # Replace everything which is not a letter by a space
    txt = re.sub(r'[^a-zA-Z ]+', ' ', txt)

    # Fill the index
    [fill_index(occur, ind_book) for occur in word_frequencies(txt)]
    fill_empty_index(ind_book)

    print("book %d / %d" % (ind_book, len(books)))


def d_jaccard_of(i,j, book_index):
    #mask = book_index[i] - book_index[j] > 0
    M = np.sum(
        book_index[i] * (book_index[i] - book_index[j] >= 0) 
        + book_index[j] * (book_index[i] - book_index[j] < 0)
        )
    #M = sum([max(index[word][i],index[word][j]) for word in index.keys()])
    m = nb_words[i] + nb_words[j] - M
    #m = sum([min(index[word][i],index[word][j]) for word in index.keys()])
    return 1 - m/M

# Jaccard Graph
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

    nb_books = 20

    start_time = time.time()  

    # Directory of the books
    book_dir = "book_test"

    # Load books file names
    books = [b for b in os.listdir(book_dir)]#[:20]

    # Data to fill
    index = {}
    d_jaccard = [[0]*len(books) for _ in range(len(books))]

    # Fill index with the books
    print("** Reading books ..")
    [read(books[i], i) for i in range(len(books))]

    print("Nombre de mots : %d" % len(index))

    t_convert = time.time()
    
    book_index = np.array([[index[word][i] for word in index.keys()] for i in range(len(books))])
    nb_words = [np.sum(book_index[i]) for i in range(len(books))]
    print("** Time convert : %.3f seconds" % (time.time() - t_convert))

    t_jac = time.time()

    # Fill d_jaccard
    for i in range(len(books)):
        print("line %d / %d" % (i, len(books)))
        for j in range(i):
            d_jaccard[i][j] = d_jaccard_of(i,j, book_index)
            d_jaccard[j][i] = d_jaccard[i][j]

    print("** Time jaccard : %.3f seconds" % (time.time() - t_jac))

    t_graph = time.time()

    # Build graph
    G = build_graph(d_jaccard, 0.7)
    print("** Time build graph : %.3f seconds" % (time.time() - t_graph))

    # Centrality index
    t_centr = time.time()
    closeness = nx.closeness_centrality(G)
    print("** Time centrality : %.3f seconds" % (time.time() - t_centr))

    # Draw the graph
    #nx.draw(G)
    #show()

    # Write the json data
    print ("** Writing data ..")
    with open('data.json', 'w') as outfile:
        json.dump({"books":books}, outfile)
        json.dump({"index":index}, outfile)
        json.dump({"jaccard_distance":d_jaccard}, outfile)
        json.dump({"closeness":closeness}, outfile)
        
    print("** Time elapsed : %.3f seconds" % (time.time() - start_time))