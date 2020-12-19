International Football Association Matches Database Interface (IFAMD)
=====================================================================

The Fédération Internationale de Football Association(FIFA), also known
as International Federation of Association Football, is the world’s most
famous soccer association that contains 211 national associations; it
holds the most well-known soccer tournaments like the World Cup, the
Women’s World Cup, the Club World Cup, etc. The database contains the
well-known, top-of-the-line European clubs, leagues, as well as football
players; it also contains information about matches between clubs, such
as when and where they hold, what clubs are involved. It would be used
for keeping track of match statistics, player performance, and player’s
contract statuses. Since most information about the player and the match
results are stored separately online, this database aims to contain all
information to facilitate search. For example, if the user searches by
player’s name, all relevant information about the player should be
present, including the player’s league, nationality, involved matches,
scoring, etc.

Our database has five entities and five relations. Player entity holds
information about a football player: the unique player id provided by
FIFA, his short name printed on the back of his shirt, his full long
name, his nationality and the position he plays. Similarly, the Club
contains the name of the club, the nation and its city. Since each club
has a unique name associated, the name of the club is used as the
primary key. League contains the league name, and its holding nation,
and like the clubs, each league has a unique name, and thus it is used
as the primary key. Manager contains the manager id arbitrarily as the
primary key created by us, his first and last name, and his nationality.
Matches contains the arbitrarily created match id as the primary key,
the date of the match, the start and end time of the match, and the city
where the match is held. Each player can only have a Contract
relationship with one club, whereas each club can have many contracted
players. The contract relation also contains information if the contract
is active. Each manager only Manages one club, and each club can only be
managed by one manager. Each club Belongs\_to one league, and each
league can have many clubs. If a player Has\_scored in a match, the
relation will contain the match id of the match he scored in, the player
id of the player, and the total goals scored. When a club Participates a
match, the relation captures the match\_id that it participates in, is
the club home or not, and the score the club gets in that match. The
constraints present in our database are foreign key constraints and NOT
NULL constraints. (Primary key constraints follow the UNIQUE and NOT
NULL constraints by default.) The foreign key constraints, contained by
the tables, serve as the links to the other related tables, and they are
the primary key of those tables; they are crucial for preserving the
relationships that will be shown in the ER diagram below. The NOT NULL
constraints are used for fields like start/end time of a match that
needs the field in order to be established. As explained in the fifth
section below, our tables are all in BCNF; by following this standard,
we managed to remove potential redundancy in our database.
