CREATE TABLE IF NOT EXISTS userf (
  User_ID char(11) PRIMARY KEY,
  User_name varchar(20) NOT NULL,
  Password varchar(20) NOT NULL,
  Email varchar(40) NOT NULL,
  Profile_Picture bytea
);

CREATE TABLE IF NOT EXISTS adminf (
  User_ID char(11) PRIMARY KEY,
  User_name varchar(20) NOT NULL,
  Password varchar(20) NOT NULL,
  Email varchar(40) NOT NULL,
  Created_Reports varchar(100),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID) ON DELETE CASCADE
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
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trainee (
  User_ID char(11) PRIMARY KEY,
  User_name varchar(20) NOT NULL,
  Password varchar(20) NOT NULL,
  Age numeric(2,0),
  Date_of_Birth varchar(20),
  Gender varchar(20),
  Weight numeric(4,1),    --0-999
  Height numeric(3,0),
  Past_Achievements varchar(100),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS report (
  Report_ID char(11) PRIMARY KEY,
  Report_Type varchar(20) NOT NULL,
  Content varchar(400)
);

CREATE TABLE IF NOT EXISTS workout_plan (
  Routine_Name varchar(20),
  Trainer_ID char(11),
  Exercises varchar(20)[],
  Duration varchar(40),
  Difficulty_Level varchar(20),
  PRIMARY KEY (Routine_Name),
  UNIQUE (Routine_Name),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS nutrition_plan (
  NutritionPlan_ID varchar(11),
  User_ID char(11),
  Total_Calories numeric(8,0) NOT NULL,
  PRIMARY KEY (NutritionPlan_ID),
  UNIQUE (NutritionPlan_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Meal (
User_ID char(11),
Meal_name varchar(20) UNIQUE,
Calories numeric(5,1) NOT NULL,
Description varchar(200) NOT NULL,
PRIMARY KEY (Meal_name, User_ID),
FOREIGN KEY (User_ID) REFERENCES userf (User_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Diet (
  Meal_name varchar(20),
  NutritionPlan_ID varchar(11),
  User_ID char(11),
  Eaten boolean DEFAULT FALSE,
  PRIMARY KEY (Meal_name, NutritionPlan_ID),
  FOREIGN KEY (NutritionPlan_ID) REFERENCES nutrition_plan (NutritionPlan_ID) ON DELETE CASCADE,
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fitnessgoal (
  Goal_ID char(11),
  User_ID char(11),
  Goal_Name varchar(20),
  Goal_Type varchar(20),
  initial_value numeric(6,1),
  current_value numeric(6,1),
  target_value numeric(6,1),
  Start_Date varchar(20),
  End_Date varchar(20),
  achieved boolean DEFAULT FALSE,
  progress numeric(4,0),
  PRIMARY KEY (Goal_ID, User_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID) ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS achievement (
  Achievement_ID char(11),
  User_ID char(11),
  Achievement_Name varchar(20),
  Achievement_Type varchar(20),
  Achievement_Date varchar(40),
  target_value numeric(6,1),
  PRIMARY KEY (Achievement_ID, User_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID) ON DELETE CASCADE
);

-- 2.13 Group_Session
CREATE TABLE IF NOT EXISTS Group_Session (
  Group_Session_ID char(11),
  Trainer_ID char(11),
  Session_name varchar(11) NOT NULL,
  Location varchar(40) NOT NULL,
  Starting_Time varchar(40) NOT NULL,
  End_Time varchar(40) NOT NULL,
  Type varchar(20),
  Max_Participants numeric(3,0) NOT NULL,
  PRIMARY KEY (Trainer_ID, Group_Session_ID),
  UNIQUE (Group_Session_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Group_Sessions (
  User_ID char(11),
  Group_Session_ID char(11),
  Trainer_ID char(11),
  PRIMARY KEY (User_ID, Group_Session_ID, Trainer_ID),
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID) ON DELETE CASCADE,
  FOREIGN KEY (User_ID) REFERENCES trainee (User_ID) ON DELETE CASCADE,
  FOREIGN KEY (Group_Session_ID) REFERENCES Group_Session (Group_Session_ID) ON DELETE CASCADE
);

-- 2.14 Exercise
CREATE TABLE IF NOT EXISTS Exercise (
  User_ID char(11),
  Exercise_name varchar(20) UNIQUE,
  Target_Audiance varchar(12),
  Description varchar(200) NOT NULL,
  Calories_Burned varchar(40) NOT NULL,
  Equipment varchar(40) NOT NULL,
  Difficulty_Level varchar(20),
  PRIMARY KEY (Exercise_name, User_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Forms (
  Routine_name varchar(20),
  Trainer_ID char(11),
  User_ID char(11),
  Start_time varchar(20),
  End_time varchar(20),
  Completed boolean DEFAULT FALSE,
  PRIMARY KEY (Routine_name, Trainer_ID, User_ID),
  FOREIGN KEY (Routine_name) REFERENCES workout_plan (Routine_Name) ON DELETE CASCADE,
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID) ON DELETE CASCADE,
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID) ON DELETE CASCADE
);

-- 2.23 trains
CREATE TABLE IF NOT EXISTS trains (
  User_ID char(11),
  Trainer_ID char(11),
  PRIMARY KEY (User_ID, Trainer_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID) ON DELETE CASCADE,
  FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID) ON DELETE CASCADE
);

-- 2.35 overview
CREATE TABLE IF NOT EXISTS overview (
  User_ID char(11),
  Report_ID char(11),
  PRIMARY KEY (User_ID, Report_ID),
  FOREIGN KEY (User_ID) REFERENCES userf (User_ID) ON DELETE CASCADE,
  FOREIGN KEY (Report_ID) REFERENCES report (Report_ID) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS individual_session (
Trainer_ID char(11),
User_ID char(11),
Session_ID char(11) PRIMARY KEY,
Session_Date varchar(20) NOT NULL,
Session_Time varchar(20) NOT NULL,
Location varchar(20) NOT NULL,
Description varchar(200) NOT NULL,
FOREIGN KEY (User_ID) REFERENCES userf (User_ID) ON DELETE CASCADE,
FOREIGN KEY (Trainer_ID) REFERENCES trainer (Trainer_ID) ON DELETE CASCADE
);


CREATE OR REPLACE FUNCTION delete_related_data_function()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the trigger event is caused by a direct deletion of a user from the userf table
    IF TG_TABLE_NAME = 'userf' THEN
        -- Delete related tuples with deleted user_id from other tables
        DELETE FROM adminf WHERE User_ID = OLD.User_ID;
        DELETE FROM trains WHERE User_ID = OLD.User_ID;

        DELETE FROM fitnessgoal WHERE User_ID = OLD.User_ID;
        DELETE FROM nutrition_plan WHERE User_ID = OLD.User_ID;
        DELETE FROM achievement WHERE User_ID = OLD.User_ID;
        DELETE FROM Group_sessions WHERE User_ID = OLD.User_ID;

        
       
       
        
        
        
        




        DELETE FROM overview WHERE User_ID = OLD.User_ID;
    ELSE
        -- Delete trainers and trainees if the deletion is not direct
        DELETE FROM trainer WHERE User_ID = OLD.User_ID;
        DELETE FROM trainee WHERE User_ID = OLD.User_ID;
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER delete_related_data
AFTER DELETE ON userf
FOR EACH ROW
EXECUTE FUNCTION delete_related_data_function();

CREATE OR REPLACE FUNCTION delete_related_trainer_data_function()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete related tuples with deleted trainer_id from trains table
    DELETE FROM trains WHERE Trainer_ID = OLD.Trainer_ID;

    -- Delete related tuples with deleted trainer_id from other tables
    DELETE FROM Group_Session WHERE Trainer_ID = OLD.Trainer_ID;


   
    
   
    
    
    



    DELETE FROM userf WHERE User_ID = OLD.User_ID;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER delete_related_trainer_data
AFTER DELETE ON trainer
FOR EACH ROW
EXECUTE FUNCTION delete_related_trainer_data_function();
CREATE OR REPLACE FUNCTION delete_related_trainee_data_function()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete related tuples with deleted user_id from other tables
    DELETE FROM trains WHERE User_ID = OLD.User_ID;

    DELETE FROM fitnessgoal WHERE User_ID = OLD.User_ID;
    DELETE FROM nutrition_plan WHERE User_ID = OLD.User_ID;
    DELETE FROM achievement WHERE User_ID = OLD.User_ID;

    
    
    
    
    
    
    
   



    DELETE FROM overview WHERE User_ID = OLD.User_ID;
    
    -- Delete the user from userf table
    DELETE FROM userf WHERE User_ID = OLD.User_ID;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delete_related_trainee_data
AFTER DELETE ON trainee
FOR EACH ROW
EXECUTE FUNCTION delete_related_trainee_data_function();