import urllib.request
from concurrent.futures import ThreadPoolExecutor
import time


def fun_test(k):
    print("hello %d" % k)
    l = []
    for i in range(10000000):
        results[k*i] = k

start_time = time.time()

results = [0] * 100000000
"""for i in range(10):
    fun_test(i)"""

with ThreadPoolExecutor(5) as executor:
    executor.map(fun_test, list(range(10)))

print("** Time elapsed : %.3f seconds" % (time.time() - start_time))