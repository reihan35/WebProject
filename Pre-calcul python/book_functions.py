import os
import re
from itertools import groupby

def import_books(path_books_dir, max=None):
    """Returns the list of names of the files in path_books_dir."""
    books = [b for b in os.listdir(path_books_dir)]
    if max is None:
        max = len(books)
    elif max > len(books):
        print("WARNING : there are less books than the max entered in \
             \"import_books\" function")
    return books[:max]

def group_words_of(path):
    """Returns the generator (word, group) 
    for each different word of the text stored in path."""
    
    # Get the text
    f = open(path, "r")
    text = ' '.join(f.readlines())

    # Remove everything which is not a letter by a space
    text = re.sub(r'[^a-zA-Zçéàèùâêîôûë ]+', ' ', text)

    sorted_words = sorted(word \
                    for word in text.lower().split())

    return groupby(sorted_words)
    

def words_of(path):
    """Returns one instance of each word in the text stored in path."""
    return (word for word, _ in group_words_of(path))

def word_frequencies_of(path):
    """Returns the generator (word,frequency) 
    for each different word of the text stored in path."""
    return ((word,len(list(group))) for word, group in group_words_of(path))

def nb_words_of(path):
    """Returns the number of different words contained in the text stored in path."""
    return len([w for w in words_of(path)])

def get_info_of(path):

    infos = dict()

    title = "Title: "
    author = "Author: "
    release = "Release Date: "

    with open(path) as f:
        for _, line in enumerate(f):
            if line[:len(title)] == title:
                infos["title"] = line[len(title):-1]
            elif line[:len(author)] == author:
                infos["author"] = line[len(author):-1]
            elif line[:len(release)] == release :
                rel = line[len(release):-1]
                rel = rel.split('[')[0]
                infos["release"] = rel
                break
    
    return infos


"""if len(list(infos.keys())) != 3:
raise("Problème lecture, infos manquantes")"""