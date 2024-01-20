#Assignment 2
##Application Security Verifcation Standard (ASVS)

## Introduction

The Application Security Verication Standard (ASVS) is a list of application security requirements or tests that can be used by architects, developers, testers, security professionals, tool vendors, and consumers to dene, build, test and verify secure applications. In this sense, it establishes a framework of requirements and controls that guide the design, development and testing of contemporary Web/mobile applications.

In this assignment, students should evolve their DETI memorabilia online shop to comply with level 1
Application Security Verication Standard requirements. Students should rst conduct a full Web application compliance audit, and then implement security improvements resulting from the audit.


## Project Structure

This project is organized into several components:

	• app_org: contains the original application, including instructions to run it.
	• app_sec: contains the improved secure application, including instructions to run it.
	• analysis: contains audit checklist/textual descriptions/logs/screen captures describing the identied issues for ASVS Level 1 and the implemented xes;
	• README.md: contains the project description, authors, and identies the audited issues and the implemented improvements;
	
	
	

## Project Setup

### Frontend
	* React JS - Employed for the creation of the user interface (UI) to enhance the overall user experience.

### Backend
	* Node JS - Employed for the creation of the backend server, which handles the requests from the frontend and communicates with the database.

### Database
	* SQL - Employed for the creation of the database, which stores all the information related to the online shop.
	
	
	
## Project Execution and Delivery
### Group Members

This project was implemented by a group of five students:

    Student 1: Vasco Faria      -107323     vascomfaria@ua.pt
    Student 2: Goncalo Lopes    -107572     goncalorcml@ua.pt
    Student 3: Tiago Cruz       -108615     tiagofcruz78@ua.pt
    Student 4: Rodrigo Graça    -107634     rodrigomgraca@ua.pt
    Student 5: Gabriel Couto    -103270     gabrielcouto@ua.pt
    
    


### Project Execution
To execute this project you need to open the terminal in 3 different directories.

1. In the first directory (named 'db') you need to execute this command:
    - ```cd db``` (to go to the directory)
    - Then ```docker compose build``` and ```docker compose up```

2. In the second directory (named 'Server') you need to execute the following commands:
    - ```cd Server``` (to go to the directory)
    - ```npm run dev```

3. In the third directory (named 'deti_store') you need to execute the following commands:
    - ```cd deti_store``` (to go to the directory)
    - ```npm start```

> [!NOTE]
> These commands must be executed by this specific order, otherwise the project will not work properly. 




