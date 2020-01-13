import json
import sys
import matplotlib.pyplot as plt
import os
#from query_yes_no import query_yes_no

json_file = ""
if len(sys.argv) != 2:
    raise("SVP donnez 1 argument : le nom du fichier json à lire")
else:
    json_file = sys.argv[1]

print("\n Fichier json chargé : %s" % json_file)

savedir_name = json_file[:-5]

if savedir_name in os.listdir():
    #erase_dir = query_yes_no("Ecraser le dossier " + savedir_name + " ?")
    erase_dir = True
    if erase_dir:
        os.system("rm -rd " + savedir_name)
    else:
        exit()

os.mkdir(savedir_name)

data = dict()
with open(json_file) as data_file:
    data = json.load(data_file)
    for key in data.keys():
        data = data[key]

vkey = "Voisins"
cckey = "Composantes connexes"
clkey = "Cliques"
seuilkey = "Seuils"
keys = [vkey, cckey, clkey]
seuils = data[seuilkey]
seuils_str = ["0."+str(round(1000*js)) for js in seuils]

keylabel = dict()
keylabel[vkey] = "Nombre de voisins"
keylabel[cckey] = "Taille des composantes connexes"
keylabel[clkey] = "Taille des cliques"

minkey = "min"
maxkey = "max"
moykey = "moyenne"
repkey = "repartition"

# Figures min max moy
for key in keys:
    fig = plt.figure()
    for k in [minkey, maxkey, moykey] :
        plt.plot(seuils, data[key][k])
    plt.legend([minkey, maxkey, moykey])
    plt.title(key)
    plt.xlabel("Seuil de Jaccard")
    plt.ylabel(keylabel[key])
    fig.savefig(savedir_name + "/aaa_" + key + ".png", dpi=fig.dpi)

    print(key + " min max moy généré")
    
# Figures répartition
def dernier_non_nul(list):
    for i in range(len(list)-1,-1,-1):
        if list[i] != 0:
            return i

for key in keys:
    max_dernier_non_nul = -1
    for rep in data[key][repkey]:
        max_dernier_non_nul = max(max_dernier_non_nul, dernier_non_nul(rep))
    for i in range(len(data[key][repkey])):
        data[key][repkey][i] = data[key][repkey][i][:(max_dernier_non_nul+1)]
    maxy = 0
    for rep in data[key][repkey]:
        maxy = max(maxy, max(rep))
    for i in range(len(seuils)):
        js = seuils[i]
        js_str = seuils_str[i]
        fig = plt.figure()
        if key != cckey:
            plt.ylim(0,maxy)
        plt.bar([x for x in range(len(data[key][repkey][i]))], data[key][repkey][i])
        plt.title(key + "\nSeuil jaccard = " + js_str)
        plt.xlabel(keylabel[key])
        plt.ylabel("Quantité")
        fig.savefig(savedir_name + "/" + key + "_" + js_str + ".png", dpi=fig.dpi)
        plt.close(fig)

    print(key + " répartition généré")
