package com.springboot.mygroots.service;

import com.springboot.mygroots.model.Account;
import com.springboot.mygroots.model.Notif;
import com.springboot.mygroots.repository.AccountRepository;
import com.springboot.mygroots.repository.NotifRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.springboot.mygroots.utils.Enumerations.*;

import java.util.List;

@Service
public class NotifService {
    @Autowired
    private NotifRepository notifRepository;

    @Autowired
    private AccountRepository accountRepository;


    public void saveNotif(Notif notif) {
        notifRepository.save(notif);
    }

    public void removeNotif(Notif notif) {
        notifRepository.delete(notif);
    }

    public Notif getNotifById(String id) {
        return notifRepository.findById(id).get();
    }

    public void updateNotif(Notif notif) {
        notifRepository.save(notif);
    }





    public List<Notif> getAllNotifs() {
        return notifRepository.findAll();
    }
}
