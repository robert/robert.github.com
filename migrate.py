import os

posts_dir = "./_posts"

for fname in os.listdir(posts_dir):
    path = os.path.join(posts_dir, fname)
    if path.endswith(".swp"):
        continue

    bits = fname.split("-", 3)
    if bits[3].endswith(".md"):
        endbit = bits[3][0:-3]
    else:
        endbit = bits[3]
    url = f"/{bits[0]}/{bits[1]}/{bits[2]}/{endbit}/"
    print(bits)
    print(url)

    with open(path, 'r') as f:
        ls = f.readlines()
        # ls.insert(1, f"permalink: {url}\n")
        ls[1] = f"permalink: {url}\n"
        with open(path, 'w') as fw:
            fw.writelines(ls)
