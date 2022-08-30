from flask import Flask, request,session
from flask import jsonify
from flask_restful import Resource, Api, marshal_with, fields
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)


CORS(app)
cors = CORS(app, resource={
    r"/*":{
        "origins":"*"
    }
})


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///dbsqlite.db'
db = SQLAlchemy(app)


# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "s3e767w6sauyfhjdsfyu43r7t87527w738576qywgiu"  
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
app.config['SECRET_KEY'] = "s3e767w6sauyfhjdsfyu43r7t87527w738576qywgiu"  
jwt = JWTManager(app)


#user model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))

#workday model
class WorkDay(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime)


workDayFields = {
    'id':fields.Integer,
    'start_date':fields.DateTime(dt_format='rfc822'),
    'end_date':fields.DateTime(dt_format='rfc822')
}


# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@app.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    user = User.query.filter_by(email=email).first()

    # check if the user actually exists
    # take the user-supplied password, hash it, and compare it to the hashed password in the database
    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Wrong username or password"}), 401

    access_token = create_access_token(identity=email)
    
    session['access_token'] = access_token
    return jsonify(access_token=access_token)

@app.route("/create_user", methods=["POST"])
def create_user():
    name = request.json.get("name", None)
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    user = User.query.filter_by(email=email).first()


    if user: # if a user is found, we want to redirect back to signup page so user can try again
        return jsonify({"msg": " Email address already exists"}), 401
    
    elif not password.isalnum():
        return jsonify({"msg": "Your password contains invalid characters."}), 401

    else:
        # create a new user with the form data. Hash the password so the plaintext version isn't saved.
        new_user = User(email=email, name=name, password=generate_password_hash(password, method='sha256'))

        # add the new user to the database
        db.session.add(new_user)
        db.session.commit()
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token,user=new_user.name, email=new_user.email)

class WorkDays(Resource):
    @jwt_required(optional=False)
    @marshal_with(workDayFields)
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        
        work_days = WorkDay.query.filter(WorkDay.user_id==user.id).all()
        
        print(user)
        print(work_days)
        return work_days

    @marshal_with(workDayFields)
    @jwt_required(optional=False)
    def post(self):
        data = request.json
        
        current_user = get_jwt_identity()
        print(current_user)
        user = User.query.filter_by(email=current_user).first()
    
        date_time = datetime.strptime(data['entry'],"%Y-%m-%dT%H:%M")
        
        work_day = WorkDay(user_id=user.id,start_date=date_time)
        db.session.add(work_day)
        db.session.commit()

        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        
        work_days = WorkDay.query.filter(WorkDay.user_id==user.id).all()
        return work_days

class SingleWorkDay(Resource):
    @marshal_with(workDayFields)
    @jwt_required(optional=False)
    def get(self, pk):
        work_day = WorkDay.query.filter_by(id=pk).first()
        return work_day

    @marshal_with(workDayFields)
    @jwt_required(optional=False)
    def put(self, pk):
        data = request.json
        date_time = datetime.strptime(data['end_time'],"%Y-%m-%dT%H:%M")
        work_day = WorkDay.query.filter_by(id=pk).first()
        work_day.end_date = date_time
        db.session.commit()
        
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        
        work_days = WorkDay.query.filter(WorkDay.user_id==user.id).all()
        
        return work_days


api.add_resource(WorkDays, '/')
api.add_resource(SingleWorkDay, '/<int:pk>')


if __name__ == '__main__':
    app.run(debug=True)