# Running the SHIELD Dashboard locally

1. `echo DEBUG=true >> .env`
2. `virtualenv env`
3. `source env/bin/activate`
4. `pip install -r requirements.txt`
5. `npm install`
9. (optional) `echo PROD_API=true >> .env` for using the prod (https://shielddash.herokuapp.com) and not the dev (http://localhost:8000) API
6. `gulp build`
7. Set up the database
    1. Install postgres
        * Mac: `brew install postgres`
    2. Create a new user with name *shielddash* and password *shielddash*
        * Mac: `createuser --pwprompt shielddash`
    3. Create a new database named *shielddash* that the *shielddash* user has
       read/write access to
        * Mac: `createdb -Oshielddash -Eutf8 shielddash`
    4. Run postgres
        * Mac: `postgres -D /usr/local/var/postgres`
8. `python manage.py runserver`
9. Load [127.0.0.1:8000](http://127.0.0.1:8000)
