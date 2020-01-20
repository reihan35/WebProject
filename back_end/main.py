import argparse
import time
import json
import networkx as nx
import numpy as np
import numpy.ma as ma
import matplotlib.pyplot as plt
import multiprocessing


# Project files
import book_functions as bf

seuil_jaccard_default = 0.48


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
    parser.add_argument("-g", "--graph_analyze", action="store_true")
    parser.add_argument("-r", "--record_graph", action="store_true")
    parser.add_argument("-s", "--seuil_jaccard", type=float)

    args = parser.parse_args()

    nb_book_max = args.nb_books
    do_jaccard = not args.no_jaccard
    do_centrality = do_jaccard & (not args.no_centrality)
    write_json = not args.no_write_json
    graph_analyze = args.graph_analyze
    record_graph = args.record_graph

    seuil_jaccard = seuil_jaccard_default
    if args.seuil_jaccard != None:
        seuil_jaccard = args.seuil_jaccard


    # Directory of the books
    book_dir = "books"
    
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

    def build_graph_with(seuil_jaccard):
        # Compute jaccard distance
        d_jaccard = []

        if do_jaccard:
            t_jac = time.time()

            d_jaccard = [[0]*len(books) for _ in range(len(books))]

            for i in range(len(books)):
                if i % 10 == 0:
                    print("Jaccard %d / %d" % (i, len(books)))
                for j in range(i):
                    d_jaccard[i][j] = d_jaccard_of(i,j, books_index)
                    d_jaccard[j][i] = d_jaccard[i][j]

            print("** Time jaccard : %.3f seconds" % (time.time() - t_jac))

    
        # Build graph & centrality index
        G = nx.Graph()
        closeness = {}
        if do_centrality:
            t_graph = time.time()
            G = build_graph(d_jaccard, seuil_jaccard)
            print("** Time build graph : %.3f seconds" % (time.time() - t_graph))
            if record_graph:
                fig = plt.figure()
                nx.draw_networkx(G, with_labels=False)
                plt.title(str(len(books)) + " livres\n Seuil de jaccard : " + str(seuil_jaccard))
                plt.axis("off")
                fig.savefig(str(len(books)) + "_" + str(seuil_jaccard) + ".png", dpi=fig.dpi)
                plt.close(fig)
                exit()

            print("Computing centrality index ..")
            t_centr = time.time()
            closeness = nx.closeness_centrality(G)
            print("** Time centrality : %.3f seconds" % (time.time() - t_centr))

        # Get the neighbours
        if do_jaccard:
            time_neigh = time.time()

            neighbours = []
            for i in range(len(books)):
                ngh_i = [book_id[j] for j in range(len(books)) if i != j and d_jaccard[i][j] < seuil_jaccard]
                ngh_i.sort(key=lambda i : closeness[i], reverse=True)
                neighbours.append(ngh_i)

            print("** Time compute neighbours : %.3f seconds" % (time.time() - time_neigh))

        return G, closeness, neighbours

    if not graph_analyze:
        G, closeness, neighbours = build_graph_with(seuil_jaccard)

    else:
        
        jacc_min = 0.1
        jacc_max = 0.9
        jacc_pas = 0.1

        seuils_test = []
        
        s = jacc_min
        while s <= jacc_max:
            seuils_test.append(s)
            s += jacc_pas

        data_analyze = dict()

        vkey = "Voisins"
        cckey = "Composantes connexes"
        clkey = "Cliques"

        minkey = "min"
        maxkey = "max"
        moykey = "moyenne"
        repkey = "repartition"

        data_analyze[vkey] = dict()
        data_analyze[cckey] = dict()
        data_analyze[clkey] = dict()

        for key in data_analyze.keys():
            data_analyze[key][minkey] = []
            data_analyze[key][maxkey] = []
            data_analyze[key][moykey] = []
            data_analyze[key][repkey] = []

        for seuil in seuils_test:

            G, closeness, neighbours = build_graph_with(seuil)

            if record_graph:
                continue

            nb_neigh = [len(v) for v in neighbours]
            cc_of_G = nx.connected_components(G)
            size_cc = [len(cc) for cc in cc_of_G]
            cliques = nx.find_cliques(G)
            size_cliques = [len(c) for c in cliques]

            for key in data_analyze.keys():
                elts = []
                if key == vkey:
                    elts = nb_neigh
                elif key == cckey:
                    elts = size_cc
                elif key == clkey:
                    elts = size_cliques

                data_analyze[key][minkey].append(min(elts))
                data_analyze[key][maxkey].append(max(elts))
                data_analyze[key][moykey].append( sum(elts) / len(elts) )

                rep = [0] * (len(books)+1)
                for n in elts:
                    try:
                        rep[n] += 1
                    except:
                        print("\n\n Erreur")
                        print("len books : %d" % (len(books)))
                        print("n : %d" %n)

                data_analyze[key][repkey].append(rep)
            
                
        data_analyze["Seuils"] = seuils_test
        with open(str(len(books)) + '_analyze_graph_large.json', 'w', encoding='utf-8') as outfile:
            json.dump({"data":data_analyze}, outfile)

        exit()

    # Write the json data
    
    if write_json:

        t_json = time.time()

        #json_file = {}

        print("Build json data :")

        print("-- Record word :")

        file_limit = 50000
        
        nw = 0
        doc = 10
        while nw < len(word_list):

            word_json = dict()
            words_in_file = 0

            while words_in_file < file_limit and nw < len(word_list):

                word_json["words"] = dict()

                if nw % 10000 == 0 :
                    print("%d / %d" % (nw , len(word_list) ))

                books_of_word = [book_id[i] for i in range(len(books)) if books_index[i][nw] != 0]
                books_of_word.sort(key= lambda id : closeness[id], reverse=True)

                word_json["words"][word_list[nw]] = books_of_word

                nw += 1
                words_in_file += 1
            
            doc += 1
            
            # Write words collection
            with open(str(len(books)) + '_data_words_' + str(doc) + '.json', 'w', encoding='utf-8') as outfile:
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

            # On ne garde que les 3 voisins les plus pertinents
            book_data["neighbours"] = neighbours[i][:3]

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
