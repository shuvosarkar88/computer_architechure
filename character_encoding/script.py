# with open("file.txt", "w", encoding="utf-8") as f:
#     f.write("भारत")

with open("file.txt", "rb") as f:
    raw = f.read()
    print("Raw bytes:", raw)

decoded = raw.decode("utf-8")
print("Decoded text:", decoded)