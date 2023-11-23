package com.springboot.mygroots.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.mongodb.lang.Nullable;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "FamilyGraph")
public class FamilyGraph {

    @Id
    private String id;

    private String familyName;
    
    private List<FamilyRelationEdge> relationShips;

    @DBRef
    private List<Person> owners;
    
    @DBRef
    @Nullable
    private List<Person> members;

    public FamilyGraph(String familyName) {
        this.familyName = familyName;
        this.owners = new ArrayList<>();
        this.members = new ArrayList<>();
        this.relationShips = new ArrayList<>();
    }
    
    public void addOwner(Person owner) {
        if (!this.owners.contains(owner)) {
            this.owners.add(owner);
        }
    }

    public void addRelation(Person source, Person target, FamilyRelation relation) {
        int sourceID = this.members.indexOf(source);
        int targetID = this.members.indexOf(target);

        if (sourceID == -1) {
            this.members.add(source);
            sourceID = this.members.size() - 1;
        }
        if (targetID == -1) {
            this.members.add(target);
            targetID = this.members.size() - 1;
        }
        this.relationShips.add(new FamilyRelationEdge(sourceID, targetID, relation));
    }


    public List<FamilyRelationEdge> getRelationShips() {
        return relationShips;
    }

    public static class FamilyRelationEdge {

        private int sourceID;
        private int targetID;
        private FamilyRelation relation;

        public FamilyRelationEdge(int sourceID, int targetID, FamilyRelation relation) {

            this.sourceID = sourceID;
            this.targetID = targetID;
            this.relation = relation;
        }

        public int getSourceID() {
            return sourceID;
        }

        public int getTargetID() {
            return targetID;
        }

        public FamilyRelation getRelation() {
            return relation;
        }
    }

    public String getFamilyName() {
        return familyName;
    }

    public List<Person> getOwners() {
        return owners;
    }

    public List<Person> getMembers() {
        return members;
    }

    public enum FamilyRelation {
        FATHER,
        MOTHER,
        SON,
        DAUGHTER,
        BROTHER,
        SISTER,
        HUSBAND,
        WIFE,
        GRANDFATHER,
        GRANDMOTHER,
        GRANDSON,
        GRANDDAUGHTER,
        UNCLE,
        AUNT,
        NEPHEW,
        NIECE,
        COUSIN,
        NO_RELATION
    }
}
