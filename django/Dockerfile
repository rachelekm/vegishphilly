FROM quay.io/azavea/django:2.2-python3.8-slim

RUN mkdir -p /usr/local/src
WORKDIR /usr/local/src

COPY requirements.txt /usr/local/src/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /usr/local/src

# RUN python manage.py collectstatic --no-input

CMD ["-b :8033", \
    "--workers=2", \
    "--timeout=60", \
    "--access-logfile=-", \
    "--access-logformat=%({X-Forwarded-For}i)s %(h)s %(l)s %(u)s %(t)s \"%(r)s\" %(s)s %(b)s \"%(f)s\" \"%(a)s\"", \
    "--error-logfile=-", \
    "--log-level=info", \
    "--capture-output", \
    "vegishphilly.wsgi"]
