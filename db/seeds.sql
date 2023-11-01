-- Table inserts from MySQL
 INSERT INTO department (name)
 VALUES
 ("Sales"),
 ("Operations"),
 ("Technology"),
("Management");

INSERT INTO role (title, department_id, salary) VALUES
("Call Center", 1, 36000),
("Software Engineer", 3, 96000),
("QA", 3, 84000),
("Help Desk", 2, 53000),
("CTO", 4, 150000),
("Office Manager", 4, 60000);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES  
('Cindy', 'Reynolds', 6, NULL),  
('Cina', 'Mann', 5, NULL),
('Billy', 'Finch', 2, 2), 
('Anna', 'Krug', 3, 2),   
('Leah', 'Tortilla', 4, 2),
('Paco', 'Pooch', 1, 1),   
('Paige', 'Berry', 1, 1),  
('Penny', 'Gig', 1, 1),    
('Stinky', 'Kat', 4, 2);     



