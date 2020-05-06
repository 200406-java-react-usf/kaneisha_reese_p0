--create tables
create table Groomers (
	groomer_id serial,
	username varchar(25) unique not null,
	password varchar(256) not null,
	first_name varchar(25) not null,
	last_name varchar(25) not null,
	earnings numeric(7,2) default 0.00,
	hours numeric(4,2) default 0.00,
	
	constraint groomer_pk primary key (groomer_id)
);

create table Services (
	service_id serial,
	name varchar(25) unique not null,
	
	constraint service_pk primary key (service_id)
);

create table Animals (
	animal_id serial,
	name varchar(25)  not null,
	groomer_id int not null,
	weight int,
	
	constraint animal_pk primary key (animal_id),
	constraint animal_groomer_fk foreign key (groomer_id) references Groomers on delete cascade
);

create table Sizes (
	size_id serial,
	size_name varchar(25) unique not null,
	
	constraint size_pk primary key (size_id)
);

create table Animal_Size (
	animal_id int,
	animal_size int,
	
	constraint animal_size_pk primary key (animal_id, animal_size),
	constraint asize_animal_fk foreign key (animal_id) references Animals on delete cascade,
	constraint asize_size_fk foreign key (animal_size) references Sizes on delete cascade
);

create table Animal_Services (
	animal_id int,
	service_id int,
	
	constraint animal_services_pk primary key (animal_id, service_id),
	constraint as_animal_fk foreign key (animal_id) references Animals on delete cascade,
	constraint as_services_fk foreign key (service_id) references Services on delete cascade 
);

create table Service_Pricing_By_Size (
	service_id int,
	animal_size int,
	service_cost numeric(4,2) not null,
	service_time numeric(3,2) not null,
	
	
	constraint sp_pk primary key (service_id, animal_size ),
	constraint sp_service_fk foreign key (service_id) references Services on delete cascade,
	constraint sp_size_fk foreign key (animal_size) references Sizes on delete cascade
);

--insert groomers into table
insert into sizes (size_name) values ('small'), ('medium'), ('large');
insert into groomers ("username" , "password" , "first_name", "last_name", "role")
values ('kreese', 'password', 'Kaneisha', 'Reese', 'supervisor'),
('rreese', 'password', 'Romeo', 'Reese', 'employee'),
('mwilson', 'password', 'Michelle', 'Wilson', 'employee');


--Function for updating groomers earnings
CREATE OR REPLACE FUNCTION update_groomer_pay() RETURNS TRIGGER as $update_groomer_pay$

declare 
groomer_earnings	numeric(5,2);
begin
    groomer_earnings = groomers .earnings + (select service_cost from service_pricing_by_size spbs 
    								where spbs.service_id = new.service_id and spbs.animal_size = 
    										(select animal_size from animal_size as2 
    										where as2.animal_id  = new.animal_id));
	update groomers 
    set g.earnings = groomer_earning where groomer_id = (select groomer_id from animals a2 where a2.animal_id = new.animal_id);

	return null ;
end;
$update_groomer_pay$
language plpgsql;
--Trigger for updating groomers earnings
create trigger update_groomer_pay
after insert on animal_services
for each row execute procedure update_groomer_pay();