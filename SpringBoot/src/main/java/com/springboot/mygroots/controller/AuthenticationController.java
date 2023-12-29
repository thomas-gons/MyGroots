package com.springboot.mygroots.controller;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.mygroots.model.Account;
import com.springboot.mygroots.model.FamilyTree;
import com.springboot.mygroots.model.Person;
import com.springboot.mygroots.service.AccountService;
import com.springboot.mygroots.service.FamilyTreeService;
import com.springboot.mygroots.service.PersonService;
import com.springboot.mygroots.service.AuthenticationService;
import com.springboot.mygroots.utils.Enumerations.Gender;

@RestController
@RequestMapping(value="/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthenticationController {	
    @Autowired
    private AuthenticationService authenticationService;
    
    @Autowired
    private PersonService personService;
    
    @Autowired
    private FamilyTreeService familyTreeService;
    	
	@PostMapping(value= "/register")
	/**
	 * Register a new user into the database. Creation of an account and a person.
	 * @param data table of informations
	 * @return message to indicated whether the registration has been carried out correctly
	 */
	public ResponseEntity<String> register(@RequestBody Map<String, String> data){
		try {
			ResponseEntity<String> response = authenticationService.register(
				data.get("email"),
				data.get("firstName"),
				data.get("lastName"),
				LocalDate.parse(data.get("birthDate")),
				Gender.valueOf(data.get("gender")),
				data.get("nationality"),
				data.get("socialSecurityNumber")
			);
			Person p = personService.getPersonByFirstNameAndLastNameAndEmail(
				data.get("firstName"),
				data.get("lastName"),
				LocalDate.parse(data.get("birthDate"))
			);
			FamilyTree ft = familyTreeService.getFamilyTreeByOwner(p);
			if (ft == null) {
				ft = new FamilyTree((String) data.get("LastName"), p);
				familyTreeService.saveFamilyTree(ft); 
			}
			return response;
		}catch(Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<String>("{\"errorMessage\":\"Une erreur s'est produite.\"}", HttpStatus.INTERNAL_SERVER_ERROR);	
	}
	
	@PostMapping(value="/login")
	/**
	 * Connection to the account with the email and the password
	 * @param account_login search for an account that matches the email address and password
	 * @return message to indicated whether the login has been carried out correctly
	 */
	public ResponseEntity<String> login(@RequestBody Account account_login){
		try {
			return authenticationService.login(account_login.getEmail(), account_login.getPassword());
		}catch(Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<String>("{\"errorMessage\":\"Une erreur s'est produite.\"}", HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@PostMapping(value="/logout")
	/**
	 * Account logout
	 * @param data
	 * @return message to indicated whether the logout has been carried out correctly
	 */
	public ResponseEntity<String> logout(@RequestBody Map<String, String> data){
		try {
			String token = data.get("token");
			String id = data.get("id");
			return authenticationService.logout(token, id);
		}catch(Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<String>("{\"errorMessage\":\"Une erreur s'est produite.\"}", HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@PostMapping(value="/forgot-password")
	/**
	 * 
	 * @param data
	 */
	public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> data) {
		try {
			String email = data.get("email");
			return authenticationService.forgotPassword(email);
		} catch(Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<String>("{\"errorMessage\":\"Une erreur s'est produite.\"}", HttpStatus.INTERNAL_SERVER_ERROR); 
	}
	
	@PutMapping(value="/change-password")
	/**
	 * 
	 */
	public ResponseEntity<String> changePassword(@RequestBody Map<String, String> data) {
		try {
			String accountId = data.get("id");
			String token = data.get("token");
			String newPassword = data.get("newPassword");
			return this.authenticationService.changePassword(accountId, token, newPassword);
		} catch(Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<String>("{\"errorMessage\":\"Une erreur s'est produite.\"}", HttpStatus.INTERNAL_SERVER_ERROR); 
	}
	
	@PostMapping(value="/activate-account/{accountId}")
	/**
	 * 
	 */
	public ResponseEntity<String> activateAccount(@PathVariable("accountId") String accountId) {
		try {
			return authenticationService.activateAccount(accountId);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<String>("{\"errorMessage\":\"Une erreur s'est produite.\"}", HttpStatus.INTERNAL_SERVER_ERROR); 
	}
}
