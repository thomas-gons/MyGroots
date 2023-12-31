package com.springboot.mygroots.controller;

import com.springboot.mygroots.dto.AccountDTO;
import com.springboot.mygroots.model.FamilyTree;
import com.springboot.mygroots.service.AccountService;
import com.springboot.mygroots.service.FamilyTreeService;
import com.springboot.mygroots.service.PersonService;

import java.time.LocalDate;
import java.util.*;

import com.springboot.mygroots.utils.ExtResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.mygroots.model.Account;
import com.springboot.mygroots.model.Person;

/**
 * Controller for the search
 */
@RestController
@RequestMapping(value="/search")
@CrossOrigin(origins = "http://localhost:4200")
public class SearchCtrl {

    @Autowired
    PersonService personService;
   
    @Autowired
    AccountService accountService;
   
    @Autowired
    FamilyTreeService familyTreeService;

    /**
     * Search an account by his id
     * @param data map containing the id of the person
     * @return the person
     */
    @PostMapping(value= "/id")
    public ExtResponseEntity<AccountDTO> searchById(@RequestBody Map<String, String> data) {
        Account acc = accountService.getAccountById(data.get("accountId"));
        if (acc == null) {
            return new ExtResponseEntity<>("Aucun compte correspondant pour cet id !", HttpStatus.BAD_REQUEST);
        }
        return new ExtResponseEntity<>(new AccountDTO(acc), HttpStatus.OK);
    }

    /**
     * Search an account by his name or his last name or his birthdate
     * @param data map containing the name, the last name and the birthdate of the person
     * @return list of accounts corresponding to the search
     */
    @PostMapping(value= "/name")
    public ExtResponseEntity<List<AccountDTO>> searchByPersonalData(@RequestBody Map<String, String> data) {
        String firstName = Objects.equals(data.get("firstName"), "") ? null : data.get("firstName");
        String lastName = Objects.equals(data.get("lastName"), "") ? null : data.get("lastName");
        LocalDate birthDate = Objects.equals(data.get("birthDate"), "") ? null : LocalDate.parse(data.get("birthDate"));
        List<Person> persResults = personService.findAllByFirstNameAndLastNameAndBirthDate(
                firstName, lastName, birthDate
        );
        if (persResults == null) {
            return new ExtResponseEntity<>("Aucune resultat !", HttpStatus.BAD_REQUEST);
        }
        persResults.removeIf(person ->
        person.getFirstName().equals("unknown") || person.getLastName().equals("unknown")
        );
        List<AccountDTO> results = new ArrayList<>();
        for (Person p: persResults) {
        	Account a = accountService.getAccountByPerson(p);
        	if (a != null) {
        		results.add(new AccountDTO(a));
        	}
        }
        return new ExtResponseEntity<>(results, HttpStatus.OK);
    }

    @PostMapping(value="/common-members")
    public ExtResponseEntity<Map<String, List<AccountDTO>>> getCommonMembers(@RequestBody Map<String, String> data) {
        String src_acc_id = data.get("src_acc_id");
        String target_id = data.get("target_id");
        Account acc = accountService.getAccountById(src_acc_id);
        Map<String, List<Person>> commons = familyTreeService.getSimilarNodes(acc.getPerson(), target_id);

        if (commons.isEmpty()) {
            return new ExtResponseEntity<>("Aucun arbre ne correspond à cet id!", HttpStatus.BAD_REQUEST);
        }

        List<AccountDTO> same = new ArrayList<>();
        for (Person p: commons.get("same")) {
            Account a = accountService.getAccountByPerson(p);
            AccountDTO accDTO = new AccountDTO(a);
            same.add(accDTO);
        }
        List<AccountDTO> probably_same = new ArrayList<>();
        for (Person p: commons.get("probably_same")) {
            AccountDTO accDTO = new AccountDTO(null, null, null, p);
            probably_same.add(accDTO);
        }
        Map<String, List<AccountDTO>> accs = Map.of(
                "same", same,
                "probably_same", probably_same
        );
        return new ExtResponseEntity<>(accs, HttpStatus.OK);
    }



}
