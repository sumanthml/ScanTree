from utils.hashing import (
    hash_password,
    verify_password
)

password = "ScanTrace123"

hashed = hash_password(password)

print("HASHED:")
print(hashed)

print("\nVERIFIED:")
print(
    verify_password(
        password,
        hashed
    )
)