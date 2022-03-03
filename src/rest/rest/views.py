from email.policy import default
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from rest.utilities import BSON_handler
import json
import logging
import os
import pymongo
from dotenv import load_dotenv
load_dotenv()

# connect to the database
print(os.getenv('MONGO_URI'))
try:
    if os.getenv('MONGO_URI') == None:
        mongo_uri = 'mongodb://mongo:27017' # connect to docker container
    else:
        mongo_uri = os.getenv('MONGO_URI') # run on local server
    client = pymongo.MongoClient(mongo_uri)
    db = pymongo.MongoClient(mongo_uri)['test_db']
except Exception as err:
    logging.error(err)


class TodoListView(APIView):

    def get(self, request):
        try:
            # fetch all todos from mongodb
            todo_list = json.dumps([todo for todo in db.todos.find()], default=BSON_handler)
        except Exception as err:
            logging.error(err)
            return JsonResponse([], status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return JsonResponse(todo_list, safe=False, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            # decode the incoming request data
            data = json.loads(request.body.decode("utf-8"))
            # insert the todo into mongodb
            db.todos.insert_one({"taskName": data['taskName']})
        except Exception as err:
            logging.error(err)
            return JsonResponse({}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return JsonResponse({}, status=status.HTTP_200_OK)
