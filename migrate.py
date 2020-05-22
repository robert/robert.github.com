import os

posts_dir = "./_posts"

for fname in os.listdir(posts_dir):
    path = os.path.join(posts_dir, fname)
    if path.endswith(".swp"):
        continue

    bits = fname.split("-", 3)
    url = f"/{bits[0]}/{bits[1]}/{bits[2]}/{bits[3].rstrip('.md')}"
    print(url)

    with open(path, 'r') as f:
        ls = f.readlines()
        ls.insert(1, f"permalink: {url}\n")
        with open(path, 'w') as fw:
            fw.writelines(ls)
