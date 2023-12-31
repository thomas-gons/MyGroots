import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { Gender } from '@app/core/models';
import { FamilyTreeService, SnackbarService } from '@app/core/services';
import FamilyTree from '@balkangraph/familytree.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-view-other-family-tree',
  templateUrl: './view-other-family-tree.component.html',
  styleUrls: ['../family-tree.component.css']
})
export class ViewOtherFamilyTreeComponent implements OnInit {

  @ViewChild('sidepanel')
  sidepanel!: MatSidenav;
  
  treeData!: any;
  family!: FamilyTree;
  selectedNodeId!: number;
  selectedNodePersonData!: any;
  showSidePanel: boolean = false;
  watcherId!: string;
  watchedId!: string;

  readonly genders: any = [
    { value: Gender.MALE, viewValue: "Masculin" },
    { value: Gender.FEMALE, viewValue: "Féminin" },
  ];

  constructor(
    private _ngxService: NgxUiLoaderService,
    private _familytreeService: FamilyTreeService,
    private _snackbarService: SnackbarService,
    private _activatedRoute: ActivatedRoute,
    private _location: Location,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.watcherId = String(this._activatedRoute.snapshot.paramMap.get("watcherId"));
    this.watchedId = String(this._activatedRoute.snapshot.paramMap.get("watchedId"));
    this._ngxService.start();
    /* Send request to get user family tree */
    this._familytreeService.getOtherFamilyTreeById(this.watcherId, this.watchedId).subscribe({
      next: (response) => {
        console.log(response);
        this.treeData = response.body;
        this.initTree(this.treeData);
        this._ngxService.stop();
      },
      error: (err) => {
        console.log(err);
        this._ngxService.stop();
        this._snackbarService.openSnackbar(err.error.message);
        this._location.back();
      }
    });
  }

  private initTree(treeData: any): void {
    /* Load FamilyTreeJS api */
    const tree = document.getElementById("tree");
    if (tree) {
      /* Config and load tree */
      this.family = new FamilyTree(tree, {
        nodeBinding: treeData.nodeBindings,
        nodeMouseClick: FamilyTree.action.none,
        mouseScrool: FamilyTree.action.none,
      });
      this.family.onInit(() => {
        let root = this.getRootOf(this.family.getNode(this.treeData.nodes.length - 1));
        this.family.config.roots = [root.id];
        this.family.draw();
        this.family.center(0);
      })
      this.family.load(treeData.nodes);

      /* Set custom properties */
      FamilyTree.SEARCH_PLACEHOLDER = "Rechercher dans l'arbre";

      /* Set custom events functions */
      this.family.onNodeClick((node: any) => {
        console.log(node);
        this.selectedNodeId = node.node.id;
        this.family.center(this.selectedNodeId);
        if (!this.sidepanel.opened) {
          this.toggleSidePanel();
        }
        this.selectedNodePersonData = this.treeData.members[this.selectedNodeId];
      });
    }
  }

  private getRootOf(node: any): any {
    while (node) {
      if (!this.family.getNode(node.mid) && !this.family.getNode(node.fid)) {
        break;
      }
      else if(this.family.getNode(node.mid)) {
        node = this.family.getNode(node.mid);
      }
      else if(this.family.getNode(node.fid)) {
        node = this.family.getNode(node.fid);
      }
    }
    return node;
  }
  
  protected toggleSidePanel(): void {
    this.sidepanel.toggle();
  }

  protected getSelectedNodeGender(): string {
    for (let gender of this.genders) {
      if (gender.value == this.selectedNodePersonData?.gender) {
        return gender.viewValue;
      }
    }
    return "";
  }

  protected centerFamilyTree() {
    this.family.center(0);
  }
  
}
