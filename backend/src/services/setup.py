import json
from datetime import timezone, datetime, timedelta
from threading import Thread

import connexion
import os

from flask import request, Response

from . import helper_functions
from .extensions import db, jwt, bcrypt, mail
import src.config as config
import src.services.filestorage_service as fs_service

from flask_jwt_extended import verify_jwt_in_request, get_jwt, create_access_token, get_jwt_identity, \
    set_access_cookies, jwt_required
from flask_jwt_extended import unset_jwt_cookies

from .helper_functions import response, query
from .logging import log_response_and_request

import os


from src import config


def create_app():

    app = connexion.App(__name__, specification_dir="../")
    # Read the API.yml file to configure the endpoints
    app.add_api("API.yml")
    app.app.config['BASE_URL'] = 'http://127.0.0.1:5000'

    app.app.config['JWT_ENCODE_ISSUER'] = config.JWT_ISSUER
    app.app.config['JWT_DECODE_ISSUER'] = config.JWT_ISSUER
    app.app.config['JWT_ALGORITHM'] = config.JWT_ALGORITHM
    app.app.config['JWT_ACCESS_TOKEN_EXPIRES'] = config.JWT_LIFETIME_SECONDS
    app.app.config['JWT_SECRET_KEY'] = config.JWT_SECRET
    app.app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.app.config['JWT_COOKIE_CSRF_PROTECT'] = True
    app.app.config['JWT_CSRF_CHECK_FORM'] = True
    app.app.config['JWT_COOKIE_SECURE'] = config.JWT_COOKIE_SECURE

    app.app.config['SQLALCHEMY_POOL_SIZE'] = 20
    app.app.config['SQLALCHEMY_POOL_RECYCLE'] = 14400  # every 4 hours reset connection

    app.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.app.config['SQLALCHEMY_DATABASE_URI'] = config.DATABASE_URL

    app.app.config['BCRYPT_HANDLE_LONG_PASSWORDS '] = True

    app.app.config['MAIL_SERVER'] = config.MAIL_SERVER
    app.app.config['MAIL_PORT'] = config.MAIL_PORT
    app.app.config['MAIL_USERNAME'] = config.MAIL_USERNAME
    app.app.config['MAIL_PASSWORD'] = config.MAIL_PASSWORD
    app.app.config['MAIL_USE_TLS'] = config.MAIL_USE_TLS
    app.app.config['MAIL_USE_SSL'] = config.MAIL_USE_SSL

    db.init_app(app.app)
    if config.FILE_STORAGE_ROOT[-1] != "/":
        raise Exception("FILE_STORAGE_ROOT must end with a '/'")
    if not fs_service.dir_exists(config.FILE_STORAGE_ROOT):
        os.makedirs(config.FILE_STORAGE_ROOT)

    @app.app.before_request
    def handle_before_request():
        if ('folder' in request.url or 'file' in request.url) and request.method != 'GET':
            if app.app.backup:
                return response("Operatie is nu niet beschikbaar wegens backup, probeer later weer", 503)

    @app.app.after_request
    def handle_after_request(response):
        response = refresh_expiring_jwts(response)
        log_response_and_request(request, response)
        if response.status_code == 500:
            d = response.get_json()
            d['message'] = "Er ging iets mis op de server; neem contact op met de beheerder!"
            response.data = json.dumps(d)

        return response

    def refresh_expiring_jwts(response):
        try:
            exp_timestamp = get_jwt()["exp"]
            now = datetime.now()
            target_timestamp = datetime.timestamp(now + timedelta(minutes=1))
            if target_timestamp > exp_timestamp:
                access_token = create_access_token(identity=get_jwt_identity())
                set_access_cookies(response, access_token)
            return response
        except (RuntimeError, KeyError):
            # Case where there is not a valid JWT. Just return the original respone
            return response

    with app.app.app_context():
        db.create_engine(config.DATABASE_URL, {})
        jwt.init_app(app.app)
        bcrypt.init_app(app.app)
        mail.init_app(app.app)
        return app
