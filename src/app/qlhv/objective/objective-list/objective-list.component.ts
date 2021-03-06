import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Objective} from '../../../interface/objective';
import {ObjectiveService} from '../../../services/objective/objective.service';
import {TransferDataService} from '../../../services/transfer-data/transfer-data.service';
import {SyllabusService} from '../../../services/syllabus/syllabus.service';
import {TokenStorageService} from '../../../auth/token-storage.service';

@Component({
  selector: 'app-objective-list',
  templateUrl: './objective-list.component.html',
  styleUrls: ['./objective-list.component.scss']
})
export class ObjectiveListComponent implements OnInit {

  objectives: Objective[] = [];

  public roles: string[];
  public authority: string;
  public isAuthorized = false;

  constructor(private objectiveService: ObjectiveService,
              private router: Router,
              private dataTransferService: TransferDataService,
              private syllabusService: SyllabusService,
              private tokenStorage: TokenStorageService
              ) {
  }

  ngOnInit() {
    this.objectiveService.getList().subscribe(result => {
      this.objectives = result;
      console.log('success');
    }, error => {
      console.log('error');
    });
    if (this.tokenStorage.getToken()) {
      this.roles = this.tokenStorage.getAuthorities();
      this.roles.every(role => {
        if (role === 'ROLE_ADMIN') {
          this.authority = 'admin';
          this.isAuthorized = true;
          return false;
        } else if (role === 'ROLE_PM') {
          this.authority = 'pm';
          this.isAuthorized = true;
          return false;
        }
        this.authority = 'user';
        return true;
      });
    }
  }

  submitDeleteObjective(id: number) {
    if (confirm('Bạn thực sự muốn xóa') === true) {
      this.deleteCategory(id);
    }
    window.location.reload();
  }

  deleteCategory(id: number) {
    this.objectiveService.deleteObjective(id).subscribe(() => {
      console.log('success');
    }, error => {
      console.log('error');
    });
  }

  goToEdit(item: Objective) {
    this.objectiveService.setData(item);
    this.router.navigateByUrl('/edit-objective');
  }

  getCreateObjectiveForm() {
    this.router.navigateByUrl('/add-objective');
  }

  getSKills(id: number) {
    this.objectiveService.setData(id);
    this.router.navigateByUrl('/activity-of-objective');
  }
}
