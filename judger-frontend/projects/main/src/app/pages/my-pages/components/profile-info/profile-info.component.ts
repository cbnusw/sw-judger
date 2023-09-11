import { Component, OnInit } from '@angular/core';
import { AssignmentService } from '../../../../services/apis/assignment.service';
import { ContestService } from '../../../../services/apis/contest.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'sw-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit {

  contests = [];
  assignments = [];

  contestColumns = [
    'no',
    'title'
  ];

  assignmentsColumns = [
    'no',
    'course',
    'title'
  ];

  constructor(
    public authService: AuthService,
    private contestService: ContestService,
    private assignmentService: AssignmentService
  ) {
  }

  getMyEnrollContest(): void {
    this.contestService.getMyEnrollContests().pipe(
    ).subscribe(
      res => {
        this.contests = res.data;
      },
      err => {
        alert(`${err.error && err.error.message || err.messasge}`);
      }
    );
  }

  getMyEnrollAssignment(): void {
    this.assignmentService.getMyEnrollAssignments().pipe(
    ).subscribe(
      res => {
        this.assignments = res.data;
      }
    )
  }

  ngOnInit(): void {
    this.getMyEnrollContest();
    this.getMyEnrollAssignment();
  }

}
