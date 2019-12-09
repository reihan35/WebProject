import argparse
import time
import json
import networkx as nx
import numpy as np
from matplotlib.pyplot import show # to show the graph

# Project files
import book_functions as bf


def d_jaccard_of(i,j, book_index):
    M = np.sum(
        book_index[i] * (book_index[i] - book_index[j] >= 0) 
        + book_index[j] * (book_index[i] - book_index[j] < 0)
        )

    m = nb_words_of_book[i] + nb_words_of_book[j] - M

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

    start_time = time.time()  

    # Directory of the books
    book_dir = "book_test"
    parser = argparse.ArgumentParser(description="Compute the database for Firebase")
    parser.add_argument("-n", "--nb_books", type=int)
    parser.add_argument("-j", "--no_jaccard", action="store_true")
    parser.add_argument("-c", "--no_centrality", action="store_true")

    args = parser.parse_args()

    nb_book_max = args.nb_books
    do_jaccard = not args.no_jaccard
    do_centrality = do_jaccard & (not args.no_centrality)

    
    book_name = bf.import_books(book_dir, max=nb_book_max)
    books = [book_dir + "/" + b for b in book_name]

    t_binfo = time.time()
    books_info = [bf.get_info_of(b) for b in books]
    print("** Time get book infos : %.3f seconds" % (time.time() - t_binfo))

    # Get all the words

    t_words = time.time()

    ind_of_word = dict()

    print("Record words of book :")
    for i in range(len(books)):
        for w in bf.words_of(books[i]):
            if not w in ind_of_word.keys():
                ind_of_word[w] = len(ind_of_word.keys())
        if (i % 10 == 0):
            print("%d / %d" % (i, len(books)))
    print("Nb words : %d" % len(ind_of_word))
    print("Mots de taille < 3 : %d" % len([w for w in ind_of_word.keys() if len(w) < 3]))
    print("Mots de taille 3 : %d" % len([w for w in ind_of_word.keys() if len(w) == 3]))

    print("** Time words : %.3f seconds" % (time.time() - t_words))

    t_fill = time.time()


    # Building the index of books

    books_index = np.zeros((len(books), len(ind_of_word.keys())), dtype=int)

    print("Fill index for book :")
    for i in range(len(books)):
        if i % 10 == 0:
            print("%d / %d" % (i, len(books)))
       
        for (w, occ) in bf.word_frequencies_of(books[i]):
            books_index[i][ind_of_word[w]] = occ

    print("** Time fill books : %.3f seconds" % (time.time() - t_words))
    

    # Number of words in each books

    t_nbwords = time.time()
    nb_words_of_book = np.array([np.sum(books_index[i]) for i in range(len(books))])
    print("** Time sum words : %.3f seconds" % (time.time() - t_nbwords))


    # Compute jaccard distance
    d_jaccard = []
    if do_jaccard:
        t_jac = time.time()

        d_jaccard = [[0]*len(books) for _ in range(len(books))]

        for i in range(len(books)):
            print("Jaccard %d / %d" % (i, len(books)))
            for j in range(i):
                d_jaccard[i][j] = d_jaccard_of(i,j, books_index)
                d_jaccard[j][i] = d_jaccard[i][j]

        print("** Time jaccard : %.3f seconds" % (time.time() - t_jac))


    # Build graph & centrality index
    G = nx.Graph()
    closeness = []
    if do_centrality:
        t_graph = time.time()
        G = build_graph(d_jaccard, 0.7)
        print("** Time build graph : %.3f seconds" % (time.time() - t_graph))

        t_centr = time.time()
        closeness = nx.closeness_centrality(G)
        print("** Time centrality : %.3f seconds" % (time.time() - t_centr))
    

    # Write the json data
    
    t_json = time.time()

    json_file = {}

    print("Build json data :")
    for i in range(len(books)):
        json_file[book_name[i]] = dict()
        words_of_book = [w for w in ind_of_word.keys() if books_index[i][ind_of_word[w]] != 0]
        json_file[book_name[i]]["words"] = words_of_book
        for info in books_info[i].keys():
            json_file[book_name[i]][info] = books_info[i][info]
        if do_centrality:
            json_file[book_name[i]]["clos_index"] = closeness[i]

        if i % 10 == 0:
            print("%d / %d" % (i,len(books)))

    print("Writing the output json file..")

    with open('data.json', 'w', encoding='utf-8') as outfile:
        json.dump({"data":json_file}, outfile)

    print("** Time JSON : %.3f seconds" % (time.time() - t_json))
    

    print("** Time elapsed : %.3f seconds" % (time.time() - start_time))
