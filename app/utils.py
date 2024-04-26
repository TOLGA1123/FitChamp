#change this to count rows 10000000001, 100000000002 etc.
import uuid
def generate_user_id():
        # Generate a unique user_id
        user_id = str(uuid.uuid4())[:11]
        return user_id