from functools import reduce

INF = 99999

def file_to_dict(filename):
    text = open(filename, "r")
    # Create an empty dictionary
    d = dict()
    # Loop through each line of the file
    for line in text:
        # Remove the leading spaces and newline character
        line = line.strip()

        # Convert the characters in line to
        # lowercase to avoid case mismatch
        line = line.lower()

        # Split the line into words
        words = line.split(" ")

        for word in words:
            if word in d:
                d[word] = d[word] + 1
            else:
                d[word] = 1
        return d

#function which parses a file into a dictionary
def file_to_dict_2(name):
    fp = open(name, 'r')
    line = fp.readline()
    d = dict()
    i = 0
    while line:
        if i!=0:
            print(line)
            line = line[1:]
            data = line.split()
            d[data[1]] = int(data[0])
            line = fp.readline()
        else:
            i=1
            line = fp.readline()
    return d

#Transformation of a set a files to a list of dictionaries
def files_to_dicts(names):
    l = []
    for n in names:
        l.append( file_to_dict(n))
    return l

#Given two dictionaties of str:int this function calculates the Jaccard distance
def jaccard_index(t1, t2):
    max_min = dict()
    for w in t1:
        if w in t2:
            if t1[w] > t2[w]:
                max = t1[w]
                min = t2[w]
            else:
                max = t2[w]
                min = t1[w]
        else:
            max = t1[w]
            min = 0
        max_min[w] = (max, min)

    for w in t2:
        if w not in t1:
            max_min[w] = (t2[w], 0)
    s = 0
    s2 = 0
    print(len(max_min))
    print(max_min)
    for w in max_min:
        s = s + (max_min[w][0] - max_min[w][1])
        s2 = s2 + max_min[w][0]
    print("s " +str(s))
    print("s2 " + str(s2))
    return s / s2

#Creation of the matrix of jaccard distances from a set of files in the form of a list of dictionaries
def make_mat_dist(texts): #textes est une liste de dictionnaires
    mat_dist = [ [ 0 for i in range(len(texts)) ] for j in range(len(texts)) ]

    for i in range(len(texts)):
        #j = i+1
        for j in range(len (texts)):
            if (i!=j):
                print(i)
                print(j)
                print(len(texts))
                print("je suis la" + str(jaccard_index(texts[i], texts[j])))
                mat_dist[i][j] = jaccard_index(texts[i], texts[j])
    return mat_dist

#print(jaccard_index(file_to_dict("easyExample/v1"),file_to_dict("easyExample/s1")))
#print(make_mat_dist(files_to_dicts(["easyExample/v1","easyExample/u1","easyExample/w1","easyExample/t1","easyExample/s1"])))

#Creats a geometric graph from the matrix by choosing the "edge limit" we eliminate edeges between nodes which have a distance > "edge"
def make_graph(mat_dist, edge):
    graph = [[0 for i in range(len(mat_dist))] for j in range(len(mat_dist))]
    for i in range(len(mat_dist)):
        for j in range(len(mat_dist[i])):
            if i == j:
                graph[i][j] = 0
            if mat_dist[i][j] <= edge:
                graph[i][j] = mat_dist[i][j]
            else:
                graph[i][j] = INF

    return graph

def print_solution(dist, v):
    print("je rentre")
    for i in range(v):
        for j in range(v):
            if (dist[i][j] == INF):
                print("%7s" % ("INF"))
            else:
                print("%7d\t" % (dist[i][j]))
            if j == v - 1:
                print ("")



def floyd_warshall(weights):
    V = len(weights)
    distance_matrix = weights
    for k in range(V):
        next_distance_matrix = [list(row) for row in distance_matrix] # make a copy of distance matrix
        for i in range(V):
            for j in range(V):
                # Choose if the k vertex can work as a path with shorter distance
                next_distance_matrix[i][j] = min(distance_matrix[i][j], distance_matrix[i][k] + distance_matrix[k][j])
        distance_matrix = next_distance_matrix # update
        #print(distance_matrix)
    return distance_matrix


# def floyd_Warshall(graph, v):
#     dist = list(map(lambda i: list(map(lambda j: j, i)), graph))
#     for k in range(v):
#         for i in range(v):
#             for j in range(v):
#                 dist[i][j] = min(dist[i][j],dist[i][k] + dist[k][j])
#
#     print_solution(dist, v)
#     return dist

#print("voila " + str(floyd_warshall(make_graph(make_mat_dist(files_to_dicts(["easyExample/v1","easyExample/u1","easyExample/w1","easyExample/t1","easyExample/s1"])), 0.81))))
#fw = floyd_warshall(make_graph(make_mat_dist(files_to_dicts(["easyExample/v1","easyExample/u1","easyExample/w1","easyExample/t1","easyExample/s1"])), 0.81))
dicts = files_to_dicts(["DataBase/text1.txt","DataBase/text2.txt","DataBase/text3.txt","DataBase/text4.txt"])
print(dicts)
#fw = floyd_warshall(make_graph(make_mat_dist(files_to_dicts(["DataBase/text1.txt","DataBase/text2.txt","DataBase/text3.txt","DataBase/text4.txt"])), 0.81))
#print(fw)

def closness_centrality(dist):
    map_of_cc = dict()
    v = len(dist)
    print(v)
    for i in range(v):
        print("JE RENTRE")
        print(i)
        s = 0
        for j in range(len(dist[i])):
            s = s + dist[i][j]
        print("je comprends " + str(j))
        map_of_cc[i] = 1/s

    return sorted(map_of_cc.items(), key=lambda kv: kv[1],reverse=True)

#def betweeness_centrality():

#print("t'es laaaaa ?")
#print(closness_centrality(fw))
