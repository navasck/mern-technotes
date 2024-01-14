
1. Auth API

   1. Login - http://localhost:3500/auth   POST
      {
          "username": "Navas",
          "password": "navas123"
      }
    2. Refresh Token -   http://localhost:3500/auth/refresh GET
    3. Logout-    http://localhost:3500/auth/logout   POST


2. USERS API

    1. get users - http://localhost:3500/users   GET
    2. add new users- http://localhost:3500/users   POST

       {
         "username": "Izan",
         "password": "izan123",
         "roles": ["Manager"],
         "active": true
       }
    3. update user -  http://localhost:3500/users  PATCH

         {
            "id": "659c1591178414bf56d46c3f",
            "username": "Aslam",
            "roles": [
                "Employee"
            ],
            "active": true,
            "__v": 0
        }
    4. delete user -   http://localhost:3500/users    DELETE

      {
        "id": "659c1591178414bf56d46c3f"
      }


2. NOTES API

   1.  get notes -     http://localhost:3500/notes    GET
   2.  add new notes   http://localhost:3500/notes    POST
       {
         "user": "659c1591178414bf56d46c3f",
         "title": "Sample Note 123",
         "text": "This is the content of the sample note."
        }
   2.  update notes    http://localhost:3500/notes    PATCH
   2.  delete notes    http://localhost:3500/notes    DELETE
