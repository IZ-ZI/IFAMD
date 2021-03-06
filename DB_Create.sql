USE ifamd;
create table Player(
   playerID INT NOT NULL,
   short_name CHAR(25) NOT NULL,
   long_name CHAR(50) NOT NULL,
   nationality CHAR(20) NOT NULL,
	 position CHAR (5) NOT NULL,
   PRIMARY KEY (PlayerID)
);

create table Club(
   club_name CHAR(25) NOT NULL,
   nation CHAR(20) NOT NULL,
   city CHAR(20) NOT NULL,
   PRIMARY KEY (club_name)
);

create table League(
   leagueID INT NOT NULL AUTO_INCREMENT,
   league_name CHAR(25) NOT NULL,
   nation CHAR(25) NOT NULL,
   PRIMARY KEY (leagueID)
);

create table Manager(
   managerID INT NOT NULL AUTO_INCREMENT,
   first_name CHAR(25) NOT NULL,
   last_name CHAR(25) NOT NULL,
	 nationality CHAR(25),
   PRIMARY KEY (managerID)
);

create table Matches(
   match_id INT NOT NULL AUTO_INCREMENT,
   date DATE,
   start_time TIMESTAMP NOT NULL,
	 end_time TIMESTAMP NOT NULL,
	 match_city CHAR(25),
   PRIMARY KEY (match_id)
);

create table Contract(
	playerID INT NOT NULL AUTO_INCREMENT,
	club_name CHAR (25) NOT NULL,
	is_active BOOLEAN NOT NULL,
	PRIMARY KEY (playerID, club_name),
	FOREIGN KEY (playerID) references Player(playerID) ON DELETE CASCADE,
	FOREIGN KEY (club_name) references Club(club_name) ON DELETE CASCADE
);

create table Manage(
	managerID INT NOT NULL AUTO_INCREMENT,
	club_name CHAR (25) NOT NULL,
	PRIMARY KEY (managerID, club_name),
	FOREIGN KEY (managerID) references Manager(managerID) ON DELETE CASCADE,
	FOREIGN KEY (club_name) references Club(club_name) ON DELETE CASCADE
);

create table Belongs_To(
	club_name CHAR(25) NOT NULL,
	leagueID INT NOT NULL,
	PRIMARY KEY (club_name, leagueID),
	FOREIGN KEY (club_name) references Club(club_name) ON DELETE CASCADE,
	FOREIGN KEY (leagueID) references League(leagueID) ON DELETE CASCADE
);

create table Has_Scored(
	match_id INT NOT NULL,
	playerID INT NOT NULL,
	PRIMARY KEY (match_id, playerID),
	FOREIGN KEY (match_id) references Matches(match_id) ON DELETE CASCADE,
	FOREIGN KEY (playerID) references Player(playerID) ON DELETE CASCADE
);

create table Participate(
	club_name CHAR (25) NOT NULL,
	match_id INT NOT NULL,
	is_home BOOLEAN NOT NULL,
	score INT NOT NULL,
	PRIMARY KEY (club_name, match_id),
	FOREIGN KEY (club_name) references Club(club_name) ON DELETE CASCADE,
	FOREIGN KEY (match_id) references Matches(match_id) ON DELETE CASCADE
);
