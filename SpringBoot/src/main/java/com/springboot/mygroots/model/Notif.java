package com.springboot.mygroots.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import com.springboot.mygroots.utils.Enumerations.*;

import javax.management.Notification;

@Document(collection = "Notif")
public class Notif {

    @Id
    private String id;

    @DBRef
    private Account source;
    @DBRef
    private Account target;
    @DBRef
    private Person member;
    private Relation relation;
    private String body;
    private NotifType type;

    public Notif(Account source, Person member, Account target,NotifType type,Relation relation) { //Source : celui qui envoie la notification, member : celui qui est lié à la demande, target : celui qui reçoit la notification
        this.source = source;
        this.target = target;
        this.member = member;
        this.type = type;
        this.relation = relation;
        String relationFR = this.tradRelation(relation);
        if(type == NotifType.DEMAND_ADDTOFAMILY){
            this.body = source.getPerson().getFirstName() + " " + source.getPerson().getLastName() + " veut vous ajouter dans son arbre familial en tant que " + relationFR + " de " + member.getFirstName() + " " + member.getLastName();
        }
        else if(type == NotifType.ALERT_DEMANDACCEPTED){
            this.body = source.getPerson().getFirstName() + " " + source.getPerson().getLastName() + " a accepté votre demande";
        }
        else if(type == NotifType.ALERT_DEMANDDECLINED){
            this.body = source.getPerson().getFirstName() + " " + source.getPerson().getLastName() + " a refusé votre demande";
        }
    }
    
    public String tradRelation(Relation relation) {
    	switch (relation) {
    		case FATHER:
    			return "père";
    		case MOTHER:
    			return "mère";
    		case CHILD:
    			return "enfant";
    		default:
    			return "partenaire";
    	}
    }

    public void acceptDemand(){
        source.addNotif(new Notif(target,member,source,NotifType.ALERT_DEMANDACCEPTED,relation));
        for(Notif n : target.getNotifs()){
            if(n.getId().equals(this.getId())){
                target.removeNotif(n);
                break;
            }
        }

        Boolean isTreeEquivalant = source.getFamilyTree().isEquivalant(target.getFamilyTree());

        if(relation == Relation.FATHER){
            source.getFamilyTree().addFather(member,target.getPerson());
            System.out.println("ça rentre dans la fonction father");
            if(isTreeEquivalant){
                target.getFamilyTree().addChild(target.getPerson(),member);
            }
        }
        else if(relation == Relation.MOTHER){
            source.getFamilyTree().addMother(member,target.getPerson());
            System.out.println("ça rentre dans la fonction mother");
            if(isTreeEquivalant){
                target.getFamilyTree().addChild(target.getPerson(),member);
            }
        }
        else if(relation == Relation.PARTNER){
            System.out.println("ça rentre dans la fonction partner");

            source.getFamilyTree().addPartner(member,target.getPerson());


            if(isTreeEquivalant){
                target.getFamilyTree().addPartner(target.getPerson(),member);
            }
        }
        else if(relation == Relation.CHILD){
            source.getFamilyTree().addChild(member,target.getPerson());
            System.out.println("ça rentre dans la fonction child");
            if(isTreeEquivalant){
                if(source.getPerson().getGender() == Gender.MALE){
                    target.getFamilyTree().addFather(target.getPerson(),member);
                }
                else{
                    target.getFamilyTree().addMother(target.getPerson(),member);
                }
            }
        }


    }

    public void declineDemand(){
        source.addNotif(new Notif(target,member,source,NotifType.ALERT_DEMANDDECLINED,relation));
        for(Notif n : target.getNotifs()){
            if(n.getId().equals(this.getId())){
                target.removeNotif(n);
                break;
            }
        }
    }

    public Account getSource() {
        return source;
    }

    public Account getTarget() {
        return target;
    }

    public String getBody() {
        return body;
    }


    public NotifType getType() {
        return type;
    }

    @Override
    public String toString() {
        return "Notif{" +
                "source=" + source +
                ", member=" + member +
                ", target=" + target +
                ", body='" + body + '\'' +
                ", type=" + type +
                '}';
    }


    public String getId() {return id;}
}
