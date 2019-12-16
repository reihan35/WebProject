import time
import multiprocessing 
import argparse

def basic_func(x):
    if x == 0:
        return 'zero'
    elif x%2 == 0:
        return 'even'
    else:
        return 'odd'

def multiprocessing_func(x):
    y = x*x
    time.sleep(2)
    print('{} squared results in a/an {} number'.format(x, basic_func(y)))
    
if __name__ == '__main__':

    parser = argparse.ArgumentParser()
    parser.add_argument("-m", "--mode", type=int)
    args = parser.parse_args()
    mode = args.mode

    if mode == 0:
        starttime = time.time()
        for i in range(0,10):
            y = i*i
            time.sleep(2)
            print('{} squared results in a/an {} number'.format(i, basic_func(y)))
    
        print('That took {} seconds'.format(time.time() - starttime))

    elif mode == 1:
        starttime = time.time()
        processes = []
        for i in range(0,10):
            p = multiprocessing.Process(target=multiprocessing_func, args=(i,))
            processes.append(p)
            p.start()
            
        for process in processes:
            process.join()
        
        print('That took {} seconds'.format(time.time() - starttime))

    elif mode == 2:
        starttime = time.time()
        pool = multiprocessing.Pool()
        pool.map(multiprocessing_func, range(0,10))
        pool.close()
        print('That took {} seconds'.format(time.time() - starttime))