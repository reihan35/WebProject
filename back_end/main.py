import argparse
import time
import json
import networkx as nx
import numpy as np
import numpy.ma as ma
from matplotlib.pyplot import show # to show the graph
import multiprocessing


# Project files
import book_functions as bf

seuil_jaccard = 0.7


def d_jaccard_of(i,j, book_index):

    M = np.sum(
        np.maximum(book_index[i], book_index[j])
        )

    m = nb_words_of_book[i] + nb_words_of_book[j] - M

    return 1 - m/M

def line_of_jac(i):
    if i % 10 == 0:
        print("Jaccard %d / %d" % (i, len(books)))
    for j in range(i):
        d_jaccard[i][j] = d_jaccard_of(i,j, books_index)
        d_jaccard[j][i] = d_jaccard[i][j]

def jac_part(i1, i2):
    for i in range (i1,i2):
        line_of_jac(i)



def build_graph(d_jaccard, seuil):
    G = nx.Graph()
    G.add_nodes_from(book_id)
    G.add_weighted_edges_from(
        (i,j,d_jaccard[i][j]) 
        for i in range(len(books)) 
        for j in range(len(books)) 
        if d_jaccard[i][j] < seuil)

    return G


if __name__ == "__main__":

    start_time = time.time()  

    # Get the argument values
    parser = argparse.ArgumentParser(description="Compute the database for Firebase")
    parser.add_argument("-n", "--nb_books", type=int)
    parser.add_argument("-j", "--no_jaccard", action="store_true")
    parser.add_argument("-c", "--no_centrality", action="store_true")
    parser.add_argument("-w", "--no_write_json", action="store_true")

    args = parser.parse_args()

    nb_book_max = args.nb_books
    do_jaccard = not args.no_jaccard
    do_centrality = do_jaccard & (not args.no_centrality)
    write_json = not args.no_write_json

    # Directory of the books
    book_dir = "book_test"
    
    book_filename = bf.import_books(book_dir, max=nb_book_max)
    book_id = list(range(len(book_filename))) 
    book_num_gut = [b.split('.')[0] for b in book_filename]
    books = [book_dir + "/" + b for b in book_filename]

    t_binfo = time.time()
    books_info = [bf.get_info_of(b) for b in books]
    print("** Time get book infos : %.3f seconds" % (time.time() - t_binfo))

    # Get all the words

    t_words = time.time()

    ind_of_word = dict()
    word_list = []

    print("Record words of book :")
    for i in range(len(books)):
        for w in bf.words_of(books[i]):
            if not w in ind_of_word.keys():
                ind_of_word[w] = len(ind_of_word.keys())
                word_list.append(w)
        if (i % 10 == 0):
            print("%d / %d" % (i, len(books)))
    print("Nb words : %d" % len(word_list))
    print("Mots de taille < 3 : %d" % len([w for w in word_list if len(w) < 3]))
    print("Mots de taille 3 : %d" % len([w for w in word_list if len(w) == 3]))

    print("** Time words : %.3f seconds" % (time.time() - t_words))


    # Building the index of books

    t_fill = time.time()

    books_index = np.zeros((len(books), len(word_list)), dtype=int)

    print("Fill index for book :")
    for i in range(len(books)):
        if i % 10 == 0:
            print("%d / %d" % (i, len(books)))
       
        for (w, occ) in bf.word_frequencies_of(books[i]):
            books_index[i][ind_of_word[w]] = occ

    print("** Time fill books : %.3f seconds" % (time.time() - t_fill))
    

    # Number of words in each books

    t_nbwords = time.time()
    nb_words_of_book = np.array([np.sum(books_index[i]) for i in range(len(books))])

    word_array = np.array(word_list)

    print("** Time sum words : %.3f seconds" % (time.time() - t_nbwords))


    # Compute jaccard distance
    d_jaccard = []

    mode = 0

    if do_jaccard:
        t_jac = time.time()

        d_jaccard = [[0]*len(books) for _ in range(len(books))]

        if mode == 0:
        
            for i in range(len(books)):
                if i % 10 == 0:
                    print("Jaccard %d / %d" % (i, len(books)))
                for j in range(i):
                    d_jaccard[i][j] = d_jaccard_of(i,j, books_index)
                    d_jaccard[j][i] = d_jaccard[i][j]

            print("** Time jaccard : %.3f seconds" % (time.time() - t_jac))

        elif mode == 1:

            t_multijac = time.time()

            d_jaccard = [[0]*len(books) for _ in range(len(books))]

            """for i in range (len(books), 4):
                process1.append(i)
                process2.append(i+1)
                process3.append(i+2)
                process4.append(i+3)
                
                puis lancer le calcul sur les 4 process seulement : un par coeur"""

            processes = []
            size_compute = [
                0,
                len(books)//2, 
                len(books)//2 + len(books)//4, 
                len(books)//2 + len(books)//4 + len(books)//8, 
                len(books)//2 + len(books)//4 + len(books)//8 + len(books)//16,
                len(books) - len(books)//2 - len(books)//4 - len(books)//8 - len(books)//16
            ]
            for i in range(1,6):
                p = multiprocessing.Process(target=jac_part, args=(size_compute[i-1], size_compute[i]))
                processes.append(p)
                p.start()
                
            print(len(processes))

            for process in processes:
                process.join()

            #print(d_jaccard)

            print("** Time multiprocess Jaccard : %.3f seconds" % (time.time() - t_multijac))

        elif mode == 2:
            t_pool = time.time()
            pool = multiprocessing.Pool()
            pool.map(line_of_jac, range(len(books)))
            pool.close()
            #print(d_jaccard)
            print("** Time pool Jaccard : %.3f seconds" % (time.time() - t_pool))

    # Build graph & centrality index
    G = nx.Graph()
    closeness = {}
    if do_centrality:
        t_graph = time.time()
        G = build_graph(d_jaccard, seuil_jaccard)
        print("** Time build graph : %.3f seconds" % (time.time() - t_graph))
        #nx.draw(G)
        #show()

        print("Computing centrality index ..")
        t_centr = time.time()
        closeness = nx.closeness_centrality(G)
        print("** Time centrality : %.3f seconds" % (time.time() - t_centr))
    

    # Get the neighbours
    if do_jaccard:
        time_neigh = time.time()

        neighbours = []
        for i in range(len(books)):
            ngh_i = [book_id[j] for j in range(len(books)) if d_jaccard[i][j] < seuil_jaccard]
            ngh_i.sort(key=lambda i : closeness[i], reverse=True)
            neighbours.append(ngh_i)

        print("** Time compute neighbours : %.3f seconds" % (time.time() - time_neigh))

    # Write the json data
    
    if write_json:

        t_json = time.time()

        #json_file = {}

        print("Build json data :")

        word_json = dict()

        print("-- Record word :")

        nw = 0
        num_doc = 0

        while nw < len(word_list):

            j=0
            doc = "words" + str(num_doc)
            word_json[doc] = dict()
            while j < 20000 and nw < len(word_list):

                if nw % 10000 == 0 :
                    print("%d / %d" % (nw , len(word_list) ))

                books_of_word = [book_id[i] for i in range(len(books)) if books_index[i][j] != 0]
                books_of_word.sort(key= lambda id : closeness[id], reverse=True)

                word_json[doc][word_list[nw]] = books_of_word

                j += 1
                nw += 1
            
            num_doc += 1

        #json_file["words"] = word_json    
        # Write words collection
        with open(str(len(books)) + '_data_words.json', 'w', encoding='utf-8') as outfile:
            json.dump({"words":word_json}, outfile)


        print("Record books :")

        book_json = dict()

        for i in range(len(books)):

            book_data = dict()

            #book_data["ID"] = book_id[i]
            book_data["gut_num"] = book_num_gut[i]

            
            # Record the words 
            # GARDER IDEE !!
            """masked = ma.masked_array(word_array, mask= books_index[i] == 0)
            words_of_book = list(masked[~masked.mask])
            book_data["words"] = words_of_book"""

            # Record title author and release
            for info in books_info[i].keys():
                book_data[info] = books_info[i][info]
            if do_centrality:
                book_data["clos_index"] = closeness[i]

            # Record the neighbours of the book
            book_data["neighbours"] = neighbours[i]

            # Place it on the json file
            book_json[book_id[i]] = book_data

            if i % 100 == 0:
                print("%d / %d" % (i,len(books)))

        #print("Writing the output json file..")

        # Write book collecction

        with open(str(len(books)) + '_data_books.json', 'w', encoding='utf-8') as outfile:
            json.dump({"books":book_json}, outfile)

        print("** Time JSON : %.3f seconds" % (time.time() - t_json))
        

    print("** Time elapsed : %.3f seconds" % (time.time() - start_time))
