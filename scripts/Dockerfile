FROM python:3.7-alpine

# set the working directory
WORKDIR /app

# copy the requirements.txt 
COPY ./requirements.txt /app/requirements.txt

RUN mkdir ./uploads

# install the required package
RUN pip3 install -r requirements.txt

# copy all the files in current directory to working directory
COPY . /app

EXPOSE 8000

# the command to start the flask app
CMD ["gunicorn", "-b 0.0.0.0:8000", "-w 4", "app:app"]
