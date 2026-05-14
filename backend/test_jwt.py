from utils.jwt import (
    create_access_token,
    verify_access_token
)

token = create_access_token({
    "sub": "test_user"
})

print("TOKEN:")
print(token)

print("\nDECODED:")
print(
    verify_access_token(token)
)