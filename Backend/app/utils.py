import uuid
#change this later, store number of users in db etc.
def generate_user_id():
    user_id = str(uuid.uuid4())[:11]  # Generate a UUID and truncate it to 11 characters
    return user_id          