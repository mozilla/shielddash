# SHIELD Studies Dashboard

Basic automated analysis of Firefox SHIELD::studies

[issues](https://github.com/mozilla/shielddash/issues)
[milestones](https://github.com/mozilla/shielddash/milestones)

## developing?

Get started with local development:

```shell
which postgres || echo "postgres not installed" && exit 1
createuser --pwprompt shielddash
createdb -Oshielddash -Eutf8 shielddash
postgres -D /usr/local/var/postgres

echo DEBUG=True >> .env
virtualenv env
source env/bin/activate
pip install -r requirements.txt
npm install
gulp build
python manage.py runserver

open http://127.0.0.1:8000
```
