# DETI Online Store

## Introduction

Welcome to the DETI Memorabilia Online Shop project. This project is developed by a group of students from the University of Aveiro and is designed to be an educational exercise in identifying and fixing vulnerabilities in a web application.

The primary goal of this project is to create a functional online shop that sells memorabilia related to the Department of Electronics, Telecommunications, and Informatics (DETI) while concealing specific vulnerabilities that are not apparent to casual users but can be exploited for educational purposes. The vulnerabilities include Cross-Site Scripting (CWE-79) and SQL Injection (CWE-89), among others.

## Project Description

The DETI Memorabilia Online Shop is an online platform for purchasing various memorabilia items, including mugs, cups, t-shirts, and hoodies, related to the Department of Electronics, Telecommunications, and Informatics at the University of Aveiro. The shop provides a range of features, including user management, product catalog, shopping cart, checkout process, inventory management, order history, reviews, and ratings.

## Project Structure

This project is organized into several components:

    app: This folder contains the insecure version of the online shop application, including instructions on how to run it. This version intentionally includes vulnerabilities that will be explored in the project.

    app_sec: This folder contains the secure version of the online shop application, along with instructions on how to run it. This version addresses the vulnerabilities present in the insecure version.

    analysis: This folder includes scripts, textual descriptions, logs, and screen captures demonstrating the exploration of each vulnerability in the insecure application and the fixes implemented in the secure application.

    README.md: You are reading the project README, which contains an overview of the project, its structure, and important information.


## Project Setup

### Frontend
* React JS - Employed for the creation of the user interface (UI) to enhance the overall user experience.

### Backend
* Node JS - Employed for the creation of the backend server, which handles the requests from the frontend and communicates with the database.

### Database
* SQL - Employed for the creation of the database, which stores all the information related to the online shop.



## Vulnerabilities

The following vulnerabilities were identified during the analysis of this project, and were then properly corrected in app_sec:

    CWE-79  : Improper Neutralization of Input DuringWeb Page Generation (’Crosssite Scripting’)

    CWE-89  : Improper Neutralization of Special Elements used in an SQL Command (’SQL Injection’)

    CWE-256 : Plaintext Storage of a Password

    CWE-620 : Unverified Password Change

    CWE-262 : Not Using Password Aging

    CWE-522 : Insufficiently Protected Credentials

    CWE-488 : Exposure of Data Element to Wrong Session

    CWE-521 : Weak Password Requirements

    CWE-20  : Improper Input Validation


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
    - Then go to the file [Commands](app_sec/db/commands.txt), where it has all the information needed

2. In the second directory (named 'Server') you need to execute the following commands:
    - ```cd Server``` (to go to the directory)
    - ```npm run dev```

3. In the third directory (named 'deti_store') you need to execute the following commands:
    - ```cd deti_store``` (to go to the directory)
    - ```npm start```

> [!NOTE]
> These commands must be executed by this specific order, otherwise the project will not work properly. 


