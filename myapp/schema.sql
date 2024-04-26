CREATE TABLE IF NOT EXISTS "user" (
  User_ID char(11) PRIMARY KEY,
  User_name varchar(20) NOT NULL,
  Password varchar(20) NOT NULL,
  Email varchar(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS "admin" (
  User_ID char(11) PRIMARY KEY,
  User_name varchar(20) NOT NULL,
  Password varchar(20) NOT NULL,
  Email varchar(40) NOT NULL,
  Created_Reports varchar(100),
  FOREIGN KEY (User_ID) REFERENCES "user" (User_ID)
);

CREATE TABLE IF NOT EXISTS trainer (
  User_ID char(11),
  Trainer_ID char(11) UNIQUE,
  User_name varchar(20) NOT NULL,
  Password varchar(20) NOT NULL,
  Specialization varchar(40),
  Telephone_Number varchar(40),
  Social_Media varchar(100),
  PRIMARY KEY (User_ID, Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES "user" (User_ID)
);


CREATE TABLE IF NOT EXISTS trainee (
  User_ID char(11) PRIMARY KEY,
  User_name varchar(20) NOT NULL,
  Password varchar(20) NOT NULL,
  Age numeric(2,0),
  Date_of_Birth varchar(20),
  Gender varchar(20),
  Weight numeric(3,1),
  Height numeric(3,0),
  Past_Achievements varchar(100),
  FOREIGN KEY (User_ID) REFERENCES "user" (User_ID)
);

CREATE TABLE IF NOT EXISTS report (
  Report_ID char(11) PRIMARY KEY,
  Report_Type varchar(20) NOT NULL,
  Content varchar(400)
);

CREATE TABLE IF NOT EXISTS chat (
  Trainer_ID char(11),
  User_ID char(11),
  Message_ID char(11) PRIMARY KEY,
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES "user" (User_ID)
);

CREATE TABLE IF NOT EXISTS message (
  Message_ID char(11),
  User_ID char(11),
  Trainer_ID char(11),
  Content varchar(400),
  PRIMARY KEY (Message_ID, User_ID, Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES "user" (User_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID)
);

CREATE TABLE IF NOT EXISTS progress (
  Progress_ID char(11),
  User_ID char(11),
  Date varchar(20),
  Metric_Type varchar(20),
  Metric_Value numeric(3,1),
  PRIMARY KEY (Progress_ID, User_ID),
  FOREIGN KEY (User_ID) REFERENCES "user" (User_ID)
);

CREATE TABLE IF NOT EXISTS fitnessgoal (
  Goal_ID char(11),
  User_ID char(11),
  Trainer_ID char(11),
  Goal_Type varchar(20),
  Goal_Value numeric(3,1),
  Start_Date varchar(20),
  End_Date varchar(20),
  Status varchar(40),
  PRIMARY KEY (Goal_ID, User_ID, Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES "user" (User_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID)
);

CREATE TABLE IF NOT EXISTS nutrition_plan (
  Nutrition_Plan_Name varchar(40),
  User_ID char(11),
  Trainer_ID char(11),
  Description varchar(400),
  Total_Calories numeric(4,0) NOT NULL,
  Meal_Schedule varchar(200) NOT NULL,
  PRIMARY KEY (Nutrition_Plan_Name, User_ID, Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES "user" (User_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID)
);

CREATE TABLE IF NOT EXISTS achievement (
  Achievement_ID char(11),
  User_ID char(11),
  Achievement_Type varchar(20),
  Achievement_Date varchar(40),
  Achievement_Details varchar(400),
  PRIMARY KEY (Achievement_ID, User_ID),
  FOREIGN KEY (User_ID) REFERENCES "user" (User_ID)
);

CREATE TABLE IF NOT EXISTS workout_plan (
  Routine_Name varchar(20),
  Trainer_ID char(11),
  User_ID char(11),
  Description varchar(400),
  Duration varchar(40),
  Difficulty_Level varchar(20),
  PRIMARY KEY (Routine_Name, Trainer_ID, User_ID),
  FOREIGN KEY (Trainer_ID, User_ID) REFERENCES trainer (Trainer_ID, User_ID),
  FOREIGN KEY (User_ID) REFERENCES "user" (User_ID)
);
