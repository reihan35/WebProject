from functools import reduce

INF = 99999
v1 = {"bien":1,"mange":1,"midi":1}
u1 = {"bien":1,"mange":1,"midi":1,"dormi":1,"cours":1}

def file_to_dict(name):
    fp = open(name, 'r')
    line = fp.readline()
    d = dict()
    i = 0
    while line:
        if i!=0:
            print(line)
            data = line.split("      ")
            print(data[0])
            data2 = data[0].split
            print(data2[0])
            d[data2[1]] = data2[0]
            line = fp.readline()
        else:
            i=1
            line = fp.readline()



    return d

file_to_dict("texte1_words")

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
    print(len(max_min))
    for w in max_min:
        s = s + (max_min[w][0] - max_min[w][1])
        s2 = s + max_min[w][0]

    return s / s2

def make_mat_dist(texts):
    mat_dist = []
    for t1 in texts:
        for t2 in texts:
            mat_dist[t1][t2] = jaccard_index(t1, t2)
    return mat_dist

def make_graph(mat_dist, edge):
    graph = []
    for i in range(len(mat_dist)):
        for j in range(len(mat_dist[i])):
            if i == j:
                graph[i][j] = 0
            if mat_dist[i][j] >= edge:
                graph[i][j] = mat_dist[i][j]
            else:
                graph[i][j] = INF

    return graph


def print_solution(dist, v):
    for i in range(v):
        for j in range(v):
            if (dist[i][j] == INF):
                print
                "%7s" % ("INF"),
            else:
                print
                "%7d\t" % (dist[i][j]),
            if j == v - 1:
                print
                ""


def floyd_Warshall(graph, v):
    dist = map(lambda i: map(lambda j: j, i), graph)
    for k in range(v):
        for i in range(v):
            for j in range(v):
                dist[i][j] = min(dist[i][j],
                                 dist[i][k] + dist[k][j]
                                 )
    return dist

def closness_centrality(dist, v):
    map_of_cc = []
    for i in range (v):
        s = 0
        for j in range(dist[v]):
            s = s + dist[v][j]
        map_of_cc[i] = 1/s

    return   sorted(map_of_cc.items(), key=lambda kv: kv[1])
