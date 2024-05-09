
CREATE TABLE IF NOT EXISTS userf (
  User_ID char(11) PRIMARY KEY,
  User_name varchar(20) NOT NULL,
  Password varchar(20) NOT NULL,
  Email varchar(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS adminf (
  User_ID char(11) PRIMARY KEY,
  User_name varchar(20) NOT NULL,
  Password varchar(20) NOT NULL,
  Email varchar(40) NOT NULL,
  Created_Reports varchar(100),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID)
);

CREATE TABLE IF NOT EXISTS trainer (
  User_ID char(11),
  Trainer_ID char(11) UNIQUE,
  User_name varchar(20) NOT NULL,
  Password varchar(20) NOT NULL,
  Specialization varchar(40),
  Telephone_Number varchar(40),
  Social_Media varchar(100),
  PRIMARY KEY (Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID)
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
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID)
);

CREATE TABLE IF NOT EXISTS report (
  Report_ID char(11) PRIMARY KEY,
  Report_Type varchar(20) NOT NULL,
  Content varchar(400)
);

CREATE TABLE IF NOT EXISTS chat (
  Trainer_ID char(11),
  User_ID char(11),
  Chat_ID char(11) PRIMARY KEY,
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID)
);

CREATE TABLE IF NOT EXISTS message (
  Message_ID char(11),
  User_ID char(11),
  Trainer_ID char(11),
  Content varchar(400),
  PRIMARY KEY (Message_ID, User_ID, Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID)
);

CREATE TABLE IF NOT EXISTS progress (
  Progress_ID char(11),
  User_ID char(11),
  Date varchar(20),
  Metric_Type varchar(20),
  Metric_Value numeric(3,1),
  PRIMARY KEY (Progress_ID, User_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID)
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
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID),
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
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID)
);

CREATE TABLE IF NOT EXISTS achievement (
  Achievement_ID char(11),
  User_ID char(11),
  Achievement_Type varchar(20),
  Achievement_Date varchar(40),
  Achievement_Details varchar(400),
  PRIMARY KEY (Achievement_ID, User_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID)
);

CREATE TABLE IF NOT EXISTS workout_plan (
  Routine_Name varchar(20),
  Trainer_ID char(11),
  User_ID char(11),
  Description varchar(400),
  Duration varchar(40),
  Difficulty_Level varchar(20),
  PRIMARY KEY (Routine_Name, Trainer_ID, User_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID)
);


-- 2.13 Group_Session
CREATE TABLE IF NOT EXISTS Group_Session (
  Trainer_ID char(11),
  User_ID char(11),
  Location varchar(40) NOT NULL,
  Starting_Time varchar(40) NOT NULL,
  End_Time varchar(40) NOT NULL,
  Type varchar(20),
  Max_Participants numeric(3,0) NOT NULL,
  Price varchar(20) NOT NULL,
  PRIMARY KEY (Trainer_ID, User_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID)
);

-- 2.14 Exercise
CREATE TABLE IF NOT EXISTS Exercise (
  Exercise_name varchar(20) PRIMARY KEY,
  Description varchar(200) NOT NULL,
  Muscle_Group_Targeted varchar(40) NOT NULL,
  Equipment varchar(40) NOT NULL,
  Difficulty_Level varchar(20)
);

-- 2.15 Cardio
CREATE TABLE IF NOT EXISTS Cardio (
  Exercise_name varchar(20) PRIMARY KEY,
  Intensity_Level varchar(20) NOT NULL,
  Cardio_Duration varchar(40) NOT NULL,
  FOREIGN KEY (Exercise_name) REFERENCES Exercise (Exercise_name)
);

-- 2.16 HyperTrophy
CREATE TABLE IF NOT EXISTS HyperTrophy (
  Exercise_name varchar(20) PRIMARY KEY,
  Number_of_Sets varchar(40) NOT NULL,
  Rest_Durations varchar(40) NOT NULL,
  FOREIGN KEY (Exercise_name) REFERENCES Exercise (Exercise_name)
);

-- 2.17 Forms
CREATE TABLE IF NOT EXISTS Forms (
  Exercise_name varchar(20),
  Routine_name varchar(20),
  Trainer_ID char(11),
  User_ID char(11),
  PRIMARY KEY (Exercise_name, Routine_name, Trainer_ID, User_ID),
  FOREIGN KEY (Routine_name, Trainer_ID, User_ID) REFERENCES workout_plan (Routine_Name, Trainer_ID, User_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID)
);


-- 2.18 Has
CREATE TABLE IF NOT EXISTS Has (
  Achievement_ID char(11),
  User_ID char(11),
  PRIMARY KEY (Achievement_ID, User_ID),
  FOREIGN KEY (Achievement_ID, User_ID) REFERENCES achievement (Achievement_ID, User_ID) ON DELETE CASCADE,
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID) ON DELETE CASCADE
);

-- 2.19 takes_up
CREATE TABLE IF NOT EXISTS takes_up (
  Routine_name varchar(20),
  Trainer_ID char(11),
  User_ID char(11),
  PRIMARY KEY (Routine_name, Trainer_ID, User_ID),
  FOREIGN KEY (Routine_name, Trainer_ID, User_ID) REFERENCES workout_plan (Routine_Name, Trainer_ID, User_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID)
);

-- 2.20 follows
CREATE TABLE IF NOT EXISTS follows (
  Nutrition_plan_name varchar(40),
  User_ID char(11),
  Trainer_ID char(11),
  PRIMARY KEY (Nutrition_plan_name, User_ID, Trainer_ID),
  FOREIGN KEY (Nutrition_plan_name, User_ID, Trainer_ID) REFERENCES nutrition_plan (Nutrition_plan_name, User_ID, Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID)
);

-- 2.21 aims_to
CREATE TABLE IF NOT EXISTS aims_to (
  Goal_ID char(11),
  User_ID char(11),
  Trainer_ID char(11),
  PRIMARY KEY (Goal_ID, User_ID, Trainer_ID),
  FOREIGN KEY (Goal_ID,User_ID,Trainer_ID) REFERENCES fitnessgoal (Goal_ID,User_ID,Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID)
);

-- 2.22 assigned
CREATE TABLE IF NOT EXISTS assigned (
  Routine_name varchar(20),
  Trainer_ID char(11),
  User_ID char(11),
  PRIMARY KEY (Routine_name, Trainer_ID, User_ID),
  FOREIGN KEY (Routine_name, Trainer_ID, User_ID) REFERENCES workout_plan (Routine_Name, Trainer_ID, User_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID)
);

-- 2.23 trains
CREATE TABLE IF NOT EXISTS trains (
  User_ID char(11),
  Trainer_ID char(11),
  PRIMARY KEY (User_ID, Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID)
);

-- 2.24 joins
CREATE TABLE IF NOT EXISTS joins (
  Trainer_ID char(11),
  User_ID char(11),
  PRIMARY KEY (Trainer_ID, User_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID)
);

-- 2.25 creates_session
CREATE TABLE IF NOT EXISTS creates_session (
  Trainer_ID char(11),
  User_ID char(11),
  PRIMARY KEY (Trainer_ID, User_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID)
);

-- 2.26 sends
CREATE TABLE IF NOT EXISTS sends (
  Trainer_ID char(11),
  User_ID char(11),
  Message_ID char(11),
  PRIMARY KEY (Trainer_ID, User_ID, Message_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID),
  FOREIGN KEY (Message_ID, User_ID,Trainer_ID) REFERENCES message (Message_ID,User_ID,Trainer_ID)
);

-- 2.27 receives
CREATE TABLE IF NOT EXISTS receives (
  User_ID char(11),
  Trainer_ID char(11),
  Message_ID char(11),
  PRIMARY KEY (User_ID, Trainer_ID, Message_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID),
  FOREIGN KEY (Message_ID, User_ID,Trainer_ID) REFERENCES message (Message_ID,User_ID,Trainer_ID)
);

-- 2.28 made
CREATE TABLE IF NOT EXISTS made (
  Progress_ID char(11),
  User_ID char(11),
  PRIMARY KEY (Progress_ID, User_ID),
  FOREIGN KEY (Progress_ID,User_ID) REFERENCES progress (Progress_ID,User_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID)
);

-- 2.29 monitor
CREATE TABLE IF NOT EXISTS monitor (
  Progress_ID char(11),
  Trainer_ID char(11),
  User_ID char(11),
  PRIMARY KEY (Progress_ID, Trainer_ID, User_ID),
  FOREIGN KEY (Progress_ID,User_ID) REFERENCES progress (Progress_ID,User_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID)
);

-- 2.30 contains
CREATE TABLE IF NOT EXISTS contains (
  Message_ID char(11),
  Trainer_ID char(11),
  User_ID char(11),
  PRIMARY KEY (Message_ID, Trainer_ID, User_ID),
  FOREIGN KEY (Message_ID, User_ID, Trainer_ID) REFERENCES message (Message_ID, User_ID, Trainer_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID)
);


-- 2.31 adds
CREATE TABLE IF NOT EXISTS adds (
  Nutrition_plan_name varchar(40),
  User_ID char(11),
  Trainer_ID char(11),
  PRIMARY KEY (Nutrition_plan_name, User_ID, Trainer_ID),
  FOREIGN KEY (Nutrition_plan_name, User_ID, Trainer_ID) REFERENCES nutrition_plan (Nutrition_plan_name, User_ID, Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID)
);

-- 2.32 plans
CREATE TABLE IF NOT EXISTS plans (
  Exercise_name varchar(20),
  Trainer_ID char(11),
  PRIMARY KEY (Exercise_name, Trainer_ID),
  FOREIGN KEY (Exercise_name) REFERENCES Exercise (Exercise_name),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID)
);

-- 2.33 creates
CREATE TABLE IF NOT EXISTS creates (
  Routine_name varchar(20),
  Trainer_ID char(11),
  User_ID char(11),
  PRIMARY KEY (Routine_name, Trainer_ID, User_ID),
  FOREIGN KEY (Routine_name, Trainer_ID, User_ID) REFERENCES workout_plan (Routine_Name, Trainer_ID, User_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID)
);

-- 2.34 creates_report
CREATE TABLE IF NOT EXISTS creates_report (
  User_ID char(11),
  Report_ID char(11),
  PRIMARY KEY (User_ID, Report_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID),
  FOREIGN KEY (Report_ID) REFERENCES report (Report_ID)
);

-- 2.35 overview
CREATE TABLE IF NOT EXISTS overview (
  User_ID char(11),
  Report_ID char(11),
  PRIMARY KEY (User_ID, Report_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID),
  FOREIGN KEY (Report_ID) REFERENCES report (Report_ID)
);


