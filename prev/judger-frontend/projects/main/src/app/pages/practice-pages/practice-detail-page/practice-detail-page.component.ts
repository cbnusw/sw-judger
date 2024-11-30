import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PDFDocumentProxy } from 'ng2-pdf-viewer/public_api';
import { Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IProblem } from '../../../models/problem';
import { PracticeService } from '../../../services/apis/practice.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'sw-practice-detail-page',
  templateUrl: './practice-detail-page.component.html',
  styleUrls: ['./practice-detail-page.component.scss']
})
export class PracticeDetailPageComponent implements OnInit {
  private subscription: Subscription;

  isLoading: boolean = true;
  problem: IProblem;
  lastPage = 1;
  page = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private practiceService: PracticeService
  ) {
  }

  get isWriter(): boolean {
    if (!this.problem || !this.auth.me) {
      return false;
    }
    return this.problem.writer._id === this.auth.me._id;
  }

  get isStudent(): boolean {
    return this.auth.me.role === 'student';
  }

  loadPdf(e: PDFDocumentProxy): void {
    this.lastPage = (e as any)._pdfInfo.numPages;
  }

  prevPage(): void {
    this.page--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextPage(): void {
    this.page++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  editProblem(): void {
    this.router.navigate(['/practice/edit', this.problem._id]);
  }

  moveListPage(): void {
    this.router.navigateByUrl('/practice/list');
  }

  mySubmitStatus(): void {
    this.router.navigate(['/practice/submit/',this.problem._id,'my-list']);
  }

  userSubmitStatus(): void {
    alert('준비중입니다!');
  }

  removeProblem(): void {
    const yes = confirm('문제를 삭제하시겠습니까?');

    if (!yes) {
      return;
    }

    this.practiceService.removePractice(this.problem._id).subscribe(
      (res) => {
        this.router.navigateByUrl('/practice/list')
      },
      (err) => alert(`${(err.error && err.error.message) || err.message}`)
    );
  }

  ngOnInit(): void {
    let params: any;
    this.route.queryParams.subscribe((res) => {
      params = res;
    });
    this.subscription = this.route.params.pipe(
      map(params => params.id),
      switchMap(id => this.practiceService.getPractice(id))
    ).subscribe(res => {
        this.problem = res.data;
        this.isLoading = false;
      },
      error => console.log(error)
    );
  }

  submitSource(): void {
    this.router.navigate(['/practice/submit/',this.problem._id]);
  }

}
